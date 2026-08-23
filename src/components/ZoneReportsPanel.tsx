import { useEffect, useState } from 'react'
import { MapPin, ChevronDown, ChevronUp, TriangleAlert, ShieldCheck, LocateFixed } from 'lucide-react'
import { supabase } from '../lib/supabase'

type CategoryInfo = { key: string; label: string; color: string }
type SituationInfo = { id: string; category_key: string; label: string }
type ReportRow = { id: string; category: string; situation: string; occurred_at: string }

type SituationCount = {
  category: string
  situation: string
  color: string
  count: number
  situationId: string
}

const HOURS = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22']

function bucketHour(isoDate: string) {
  const hour = new Date(isoDate).getHours()
  const bucket = Math.floor(hour / 2) * 2
  return String(bucket)
}

export default function ZoneReportsPanel({
  category,
  locationStatus,
  onConsultarHorario,
}: {
  category: string
  locationStatus: 'pending' | 'granted' | 'denied' | 'blocked'
  onConsultarHorario: () => void
}) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [situations, setSituations] = useState<SituationInfo[]>([])
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('report_categories').select('*'),
      supabase.from('report_situations').select('*'),
    ]).then(([categoriesRes, situationsRes]) => {
      setCategories(categoriesRes.data ?? [])
      setSituations(situationsRes.data ?? [])
    })
  }, [])

  useEffect(() => {
    if (locationStatus !== 'granted') return

    setLoading(true)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    let query = supabase
      .from('reports')
      .select('id, category, situation, occurred_at')
      .gte('occurred_at', sevenDaysAgo)

    if (category !== 'todo') query = query.eq('category', category)

    query.then(({ data }) => {
      setReports(data ?? [])
      setLoading(false)
    })
  }, [category, locationStatus])

  const situationCounts: SituationCount[] = Object.values(
    reports.reduce<Record<string, SituationCount>>((acc, r) => {
      const key = `${r.category}::${r.situation}`
      const cat = categories.find((c) => c.key === r.category)
      const situationInfo = situations.find(
        (s) => s.category_key === r.category && s.label === r.situation,
      )
      if (!acc[key]) {
        acc[key] = {
          category: r.category,
          situation: r.situation,
          color: cat?.color ?? '#6b7280',
          count: 0,
          situationId: situationInfo?.id ?? '',
        }
      }
      acc[key].count += 1
      return acc
    }, {}),
  ).sort((a, b) => b.count - a.count || a.situationId.localeCompare(b.situationId))

  const hourlyCounts = HOURS.map((hour) => ({
    hour,
    value: reports.filter((r) => bucketHour(r.occurred_at) === hour).length,
  }))
  const maxHourly = Math.max(1, ...hourlyCounts.map((h) => h.value))
  const peakHour = hourlyCounts.reduce((max, h) => (h.value > max.value ? h : max), hourlyCounts[0])

  return (
    <div className="absolute right-4 top-4 z-[1000] w-72 max-w-[calc(100vw-2rem)]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-full border border-hairline bg-white px-4 py-2.5 font-instrument text-sm font-medium text-black shadow-lg transition-transform duration-200 hover:scale-[1.02]"
      >
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand" />
          Lo último en tu zona
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div className="animate-fade-up mt-2 flex flex-col gap-4 rounded-2xl border border-hairline bg-white p-4 shadow-lg">
          {locationStatus === 'pending' && (
            <p className="font-instrument text-sm text-black/40">Solicitando ubicación...</p>
          )}

          {locationStatus === 'denied' && (
            <div className="flex items-start gap-3 rounded-xl bg-brand/5 p-3">
              <LocateFixed className="h-5 w-5 flex-shrink-0 text-brand" />
              <div>
                <p className="font-instrument text-sm font-semibold text-black">
                  Activa tu ubicación
                </p>
                <p className="mt-0.5 font-instrument text-xs text-black/60">
                  Necesitamos tu ubicación para mostrarte la información de tu zona.
                </p>
              </div>
            </div>
          )}

          {locationStatus === 'blocked' && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-3">
              <LocateFixed className="h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-instrument text-sm font-semibold text-black">
                  Tu ubicación está bloqueada
                </p>
                <p className="mt-0.5 font-instrument text-xs text-black/60">
                  Tu navegador no volverá a preguntar solo. Actívala manualmente: toca el ícono de
                  candado 🔒 junto a la dirección del sitio → Permisos del sitio (o Ubicación) →
                  Permitir, y recarga la página.
                </p>
              </div>
            </div>
          )}

          {locationStatus === 'granted' && loading && (
            <p className="font-instrument text-sm text-black/40">Cargando...</p>
          )}

          {locationStatus === 'granted' && !loading && (
            <>
              {situationCounts.length > 0 ? (
                <div className="flex items-start gap-3 rounded-xl bg-red-50 p-3">
                  <TriangleAlert className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <div>
                    <p className="font-instrument text-sm font-semibold text-red-700">
                      Estado de Precaución
                    </p>
                    <p className="mt-0.5 font-instrument text-xs text-red-700/80">
                      Se han registrado reportes recientes en esta área.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-xl bg-green-50 p-3">
                  <ShieldCheck className="h-5 w-5 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-instrument text-sm font-semibold text-green-700">
                      Sin reportes recientes
                    </p>
                    <p className="mt-0.5 font-instrument text-xs text-green-700/80">
                      No hay reportes registrados en los últimos 7 días.
                    </p>
                  </div>
                </div>
              )}

              {situationCounts.length > 0 && (
                <div>
                  <p className="font-instrument text-sm font-semibold text-black">
                    Reportes registrados
                  </p>
                  <p className="font-instrument text-xs text-black/50">Últimos 7 días</p>

                  <div className="mt-3 flex flex-col gap-2">
                    {situationCounts.map((report) => (
                      <div
                        key={`${report.category}-${report.situation}`}
                        className="flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2 font-instrument text-sm text-black">
                          <span
                            className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: report.color }}
                          />
                          {report.situation}
                        </span>
                        <span className="font-instrument text-sm font-semibold text-black">
                          {report.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {situationCounts.length > 0 && (
                <div>
                  <p className="font-instrument text-sm font-semibold text-black">
                    Horarios con más reportes
                  </p>
                  <p className="font-instrument text-xs text-black/50">
                    Basado en reportes recientes
                  </p>

                  <div className="mt-3 flex items-end gap-1.5">
                    {hourlyCounts.map((h) => (
                      <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-t transition-all duration-300 ${
                            h.value === peakHour.value && h.value > 0 ? 'bg-brand' : 'bg-divider'
                          }`}
                          style={{ height: `${(h.value / maxHourly) * 48}px` }}
                        />
                        <span className="font-instrument text-[10px] text-black/40">{h.hour}</span>
                      </div>
                    ))}
                  </div>
                  {peakHour.value > 0 && (
                    <p className="mt-2 text-center font-instrument text-xs font-medium text-brand">
                      {peakHour.hour}:00 – {(Number(peakHour.hour) + 2) % 24}:00
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onConsultarHorario}
            className="rounded-2xl border border-hairline px-4 py-2.5 font-instrument text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:border-brand hover:text-brand active:scale-95"
          >
            Consultar por horario
          </button>
        </div>
      )}
    </div>
  )
}
