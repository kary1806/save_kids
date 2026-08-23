import { useEffect, useState } from 'react'
import { X, MapPin, Clock, Send, CloudCheck, ShieldCheck, Lock, Users, LocateFixed } from 'lucide-react'
import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { supabase } from '../lib/supabase'
import PlaceAutocompleteInput from './PlaceAutocompleteInput'

const CONFIRMATION_ITEMS = [
  {
    icon: ShieldCheck,
    text: 'Tu información será revisada antes de ser utilizada como alerta general.',
  },
  {
    icon: Lock,
    text: 'No compartiremos públicamente tus datos personales.',
  },
  {
    icon: Users,
    text: 'Los reportes ayudan a construir información preventiva para la comunidad.',
  },
]

type Category = { key: string; label: string; color: string }
type Situation = { id: string; category_key: string; label: string }
type Selection = { categoryKey: string; label: string }

export default function ReportModal({
  userId,
  userLocation,
  onClose,
}: {
  userId: string
  userLocation: { lat: number; lng: number } | null
  onClose: () => void
}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [situations, setSituations] = useState<Situation[]>([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [selections, setSelections] = useState<Selection[]>([])
  const [location, setLocation] = useState('')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locatingMe, setLocatingMe] = useState(false)
  const geocodingLibrary = useMapsLibrary('geocoding')
  const [when, setWhen] = useState(() => new Date().toISOString().slice(0, 16))
  const [description, setDescription] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('report_categories').select('*').order('sort_order'),
      supabase.from('report_situations').select('*').order('sort_order'),
    ]).then(([categoriesRes, situationsRes]) => {
      setCategories(categoriesRes.data ?? [])
      setSituations(situationsRes.data ?? [])
      setLoadingOptions(false)
    })
  }, [])

  async function handleUseMyLocation() {
    if (!userLocation) return
    setLocatingMe(true)

    if (geocodingLibrary) {
      const geocoder = new geocodingLibrary.Geocoder()
      try {
        const { results } = await geocoder.geocode({ location: userLocation })
        setLocation(results[0]?.formatted_address ?? 'Mi ubicación actual')
      } catch {
        setLocation('Mi ubicación actual')
      }
    } else {
      setLocation('Mi ubicación actual')
    }

    setCoords(userLocation)
    setLocatingMe(false)
  }

  const canSubmit = Boolean(selections.length > 0 && location && when && confirmed)

  function toggleCategory(key: string) {
    setExpandedCategory((current) => (current === key ? null : key))
  }

  function toggleSituation(categoryKey: string, label: string) {
    setSelections((current) => {
      const exists = current.some((s) => s.categoryKey === categoryKey && s.label === label)
      if (exists) {
        return current.filter((s) => !(s.categoryKey === categoryKey && s.label === label))
      }
      return [...current, { categoryKey, label }]
    })
  }

  function removeSelection(categoryKey: string, label: string) {
    setSelections((current) =>
      current.filter((s) => !(s.categoryKey === categoryKey && s.label === label)),
    )
  }

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('reports').insert(
      selections.map((s) => ({
        user_id: userId,
        category: s.categoryKey,
        situation: s.label,
        location,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
        occurred_at: new Date(when).toISOString(),
        description: description || null,
      })),
    )

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 px-4">
        <div className="animate-fade-up relative w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
          >
            <X className="h-5 w-5" />
          </button>

          <p className="font-instrument text-xs font-bold uppercase tracking-widest text-brand">
            Confirmación del reporte
          </p>

          <CloudCheck className="mx-auto mt-6 h-16 w-16 text-green-500" strokeWidth={1.5} />

          <h2 className="mt-4 font-instrument text-xl font-semibold text-black">
            Reporte recibido
          </h2>
          <p className="mt-1 font-instrument text-sm text-black/60">
            Gracias por contribuir con información preventiva
          </p>

          <div className="mt-6 flex flex-col gap-3 text-left">
            {CONFIRMATION_ITEMS.map((item) => (
              <div key={item.text} className="flex items-start gap-3 rounded-xl bg-green-100 p-3">
                <item.icon className="h-5 w-5 flex-shrink-0 text-green-700" />
                <p className="font-instrument text-sm text-green-900">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 px-4">
      <div className="animate-fade-up relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="font-instrument text-xs font-bold uppercase tracking-widest text-brand">
          Reporte Preventivo
        </p>
        <h2 className="mt-1 pr-6 font-instrument text-xl font-semibold text-black">
          ¿Qué ocurrió?
        </h2>
        <p className="mt-1 font-instrument text-sm text-black/60">
          Selecciona una o más situaciones. No incluyas nombres ni datos personales.
        </p>

        {loadingOptions ? (
          <p className="mt-4 font-instrument text-sm text-black/40">Cargando categorías...</p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const hasSelection = selections.some((s) => s.categoryKey === cat.key)
                const isExpanded = expandedCategory === cat.key
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => toggleCategory(cat.key)}
                    className={`rounded-full border px-4 py-1.5 font-instrument text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                      isExpanded ? 'ring-2 ring-offset-1' : ''
                    }`}
                    style={
                      hasSelection
                        ? {
                            backgroundColor: cat.color,
                            borderColor: cat.color,
                            color: '#fff',
                          }
                        : { borderColor: '#afafaf', color: '#000' }
                    }
                  >
                    {cat.label}
                  </button>
                )
              })}
            </div>

            {expandedCategory && (
              <div className="animate-fade-up mt-3 flex flex-col overflow-hidden rounded-xl border border-hairline shadow-sm">
                {situations
                  .filter((s) => s.category_key === expandedCategory)
                  .map((item) => {
                    const category = categories.find((c) => c.key === expandedCategory)
                    const isSelected = selections.some(
                      (s) => s.categoryKey === expandedCategory && s.label === item.label,
                    )
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSituation(expandedCategory, item.label)}
                        className={`flex items-center gap-2 px-3 py-2.5 text-left font-instrument text-sm text-black transition-colors duration-200 hover:bg-black/5 ${
                          isSelected ? 'bg-black/5 font-semibold' : ''
                        }`}
                      >
                        <span
                          className="h-3 w-3 flex-shrink-0 rounded-full"
                          style={{ backgroundColor: category?.color }}
                        />
                        {item.label}
                        {isSelected && <span className="ml-auto text-brand">✓</span>}
                      </button>
                    )
                  })}
              </div>
            )}

            {selections.length > 0 && (
              <div className="animate-fade-up mt-3 flex flex-wrap gap-2">
                {selections.map((s) => {
                  const category = categories.find((c) => c.key === s.categoryKey)
                  return (
                    <span
                      key={`${s.categoryKey}-${s.label}`}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-instrument text-sm font-medium"
                      style={{
                        backgroundColor: `${category?.color}20`,
                        color: category?.color,
                      }}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                      {s.label}
                      <button
                        type="button"
                        onClick={() => removeSelection(s.categoryKey, s.label)}
                        aria-label={`Quitar ${s.label}`}
                        className="ml-0.5 hover:opacity-60"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
                })}
              </div>
            )}
          </>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-hairline pt-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="font-instrument text-xs font-medium text-black/60">
              Seleccionar ubicación
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-black/40" />
              <PlaceAutocompleteInput
                placeholder="Ej. Av. Pedro de heredia"
                className="w-full min-w-0 font-instrument text-sm text-black outline-none"
                biasCenter={userLocation}
                onPlaceSelected={(place) => {
                  setLocation(place.address)
                  setCoords({ lat: place.lat, lng: place.lng })
                }}
              />
            </div>
            {userLocation && (
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locatingMe}
                className="flex items-center gap-1.5 self-start font-instrument text-xs font-medium text-brand transition-opacity duration-200 hover:opacity-70 disabled:opacity-50"
              >
                <LocateFixed className="h-3.5 w-3.5" />
                {locatingMe ? 'Ubicando...' : 'Usar mi ubicación actual'}
              </button>
            )}
            {location && <p className="font-instrument text-xs text-brand">📍 {location}</p>}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="font-instrument text-xs font-medium text-black/60">
              ¿Cuándo ocurrió?
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-black/40" />
              <input
                type="datetime-local"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className="w-full min-w-0 font-instrument text-sm text-black outline-none"
              />
            </div>
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="font-instrument text-xs font-medium text-black/60">
            Descripción, opcional
          </span>
          <textarea
            placeholder="Cuéntanos solo lo necesario"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-lg border border-hairline px-3 py-2 font-instrument text-sm text-black outline-none placeholder:text-black/40 focus:border-brand"
          />
        </label>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-brand"
            />
            <span className="font-instrument text-xs text-black/60">
              No estoy compartiendo datos personales y la información es verdadera
            </span>
          </label>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex flex-shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-2.5 font-instrument font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            {submitting ? 'Enviando...' : 'Enviar reporte'}
            <Send className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="mt-3 font-instrument text-sm text-red-600">{error}</p>}
      </div>
    </div>
  )
}
