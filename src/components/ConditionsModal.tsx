import { useEffect, useState } from 'react'
import { X, MapPin, Info, ShieldCheck } from 'lucide-react'
import type { TimeOfDay } from './TimeSelectorModal'
import { supabase } from '../lib/supabase'
import { situationIcon } from '../lib/situationIcons'

const TIME_LABEL: Record<TimeOfDay, string> = {
  morning: 'la mañana',
  afternoon: 'la tarde',
  night: 'la noche',
}

const TIME_HOUR_RANGE: Record<TimeOfDay, [number, number]> = {
  morning: [6, 12],
  afternoon: [12, 18],
  night: [18, 24],
}

const PREVENTIVE_TIPS: Record<string, string> = {
  Robo: 'Evita mostrar objetos de valor y camina por vías principales.',
  'Poca iluminación': 'Prefiere rutas bien iluminadas y evita transitar solo de noche.',
  Accidente: 'Cruza por zonas señalizadas y mantente atento al tráfico.',
  Violencia: 'Evita confrontaciones y busca ayuda de las autoridades si notas riesgo.',
  'Persona Sospechosa': 'Mantente alerta y comparte tu ubicación con alguien de confianza.',
  Tráfico: 'Prevé tiempo adicional y usa siempre los cruces peatonales.',
  'Cruce Peligroso': 'Cruza por la cebra y espera el cambio de semáforo.',
  'Vía en mal estado': 'Camina con cuidado y evita ir distraído con el celular.',
  Inundación: 'Evita zonas bajas y no cruces corrientes de agua.',
  'Lluvias intensas': 'Busca refugio y evita desplazarte durante la tormenta.',
  Deslizamiento: 'Aléjate de laderas inestables, sobre todo tras lluvias fuertes.',
  Acoso: 'Busca zonas concurridas y avisa a alguien de confianza.',
  'Alta circulación vehicular': 'Extrema precaución al cruzar y usa puentes peatonales si existen.',
  Otro: 'Mantente alerta a tu entorno y comparte tu ubicación con alguien de confianza.',
}

const NEARBY_DEGREES = 0.045 // ~5km

type CategoryInfo = { key: string; label: string; color: string }
type ReportRow = { category: string; situation: string; occurred_at: string }
type SituationSummary = { situation: string; color: string; count: number }

export default function ConditionsModal({
  placeName,
  address,
  coords,
  time,
  userInitial,
  onClose,
}: {
  placeName: string
  address: string
  coords: { lat: number; lng: number } | null
  time: TimeOfDay
  userInitial: string
  onClose: () => void
}) {
  const [loading, setLoading] = useState(true)
  const [situations, setSituations] = useState<SituationSummary[]>([])
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    if (!coords) {
      setLoading(false)
      return
    }

    setLoading(true)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    Promise.all([
      supabase.from('report_categories').select('*'),
      supabase
        .from('reports')
        .select('category, situation, occurred_at')
        .gte('occurred_at', sevenDaysAgo)
        .gte('latitude', coords.lat - NEARBY_DEGREES)
        .lte('latitude', coords.lat + NEARBY_DEGREES)
        .gte('longitude', coords.lng - NEARBY_DEGREES)
        .lte('longitude', coords.lng + NEARBY_DEGREES),
    ]).then(([categoriesRes, reportsRes]) => {
      const categories = (categoriesRes.data ?? []) as CategoryInfo[]
      const reports = (reportsRes.data ?? []) as ReportRow[]
      const [start, end] = TIME_HOUR_RANGE[time]

      const inTimeRange = reports.filter((r) => {
        const hour = new Date(r.occurred_at).getHours()
        return hour >= start && hour < end
      })

      const bySituation = new Map<string, SituationSummary>()
      for (const r of inTimeRange) {
        const color = categories.find((c) => c.key === r.category)?.color ?? '#6b7280'
        const existing = bySituation.get(r.situation)
        if (existing) existing.count += 1
        else bySituation.set(r.situation, { situation: r.situation, color, count: 1 })
      }

      setSituations(Array.from(bySituation.values()).sort((a, b) => b.count - a.count))

      const mostRecent = inTimeRange.reduce<string | null>((latest, r) => {
        if (!latest || r.occurred_at > latest) return r.occurred_at
        return latest
      }, null)
      setLastUpdated(mostRecent)

      setLoading(false)
    })
  }, [coords?.lat, coords?.lng, time])

  function formatLastUpdated(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime()
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
    if (diffHours < 1) return 'Última actualización: hace menos de 1 hora'
    if (diffHours < 24) return `Última actualización: hace ${diffHours} h`
    const diffDays = Math.floor(diffHours / 24)
    return `Última actualización: hace ${diffDays} día${diffDays === 1 ? '' : 's'}`
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 px-4">
      <div className="animate-fade-up relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-instrument text-base font-semibold text-white shadow-md">
            {userInitial}
          </span>
          <h2 className="mt-3 font-instrument text-2xl font-bold text-black">{placeName}</h2>
          <p className="mt-1 flex items-center gap-1.5 font-instrument text-sm text-black/60">
            <MapPin className="h-4 w-4 flex-shrink-0 text-brand" />
            {address}
          </p>
        </div>

        {loading ? (
          <p className="mt-6 text-center font-instrument text-sm text-black/40">Cargando...</p>
        ) : situations.length === 0 ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-green-100 p-5">
            <ShieldCheck className="h-6 w-6 flex-shrink-0 text-green-600" />
            <div>
              <p className="font-instrument text-base font-semibold text-black">
                Sin reportes recientes para {TIME_LABEL[time]}
              </p>
              <p className="mt-1 font-instrument text-sm text-black/70">
                No se han registrado situaciones cerca de este lugar en los últimos 7 días para
                este horario. Aun así, mantente alerta a tu entorno y comparte tu ubicación con
                alguien de confianza.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-green-100 p-5">
              <p className="font-instrument text-base font-semibold text-black">
                Condiciones y riesgos reportados para {TIME_LABEL[time]}
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {situations.map((item) => {
                  const Icon = situationIcon(item.situation)
                  return (
                    <div key={item.situation} className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: item.color }} />
                      </span>
                      <span className="font-instrument text-sm text-black">{item.situation}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-100 p-5">
              <p className="font-instrument text-base font-semibold text-black">
                Recomendaciones preventivas
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {situations.map((item) => (
                  <li
                    key={item.situation}
                    className="font-instrument text-sm text-black/80 before:mr-1.5 before:content-['•']"
                  >
                    {PREVENTIVE_TIPS[item.situation] ?? PREVENTIVE_TIPS.Otro}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 font-instrument text-sm text-black/60">
          {lastUpdated ? formatLastUpdated(lastUpdated) : 'Basado en reportes de los últimos 7 días'}
          <Info className="h-4 w-4 flex-shrink-0 text-black/40" />
        </div>
      </div>
    </div>
  )
}
