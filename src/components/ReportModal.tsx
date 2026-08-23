import { useState } from 'react'
import { X, MapPin, Clock, Send, CloudCheck, ShieldCheck, Lock, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

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

const CATEGORIES = [
  {
    key: 'seguridad',
    label: 'Seguridad Ciudadana',
    color: '#ef4444',
    subItems: ['Robo', 'Violencia', 'Persona Sospechosa', 'Poca iluminación', 'Otro'],
  },
  {
    key: 'vial',
    label: 'Riesgo Vial',
    color: '#f59e0b',
    subItems: ['Tráfico', 'Cruce Peligroso', 'Accidente', 'Vía en mal estado', 'Otro'],
  },
  {
    key: 'ambiental',
    label: 'Ambiental',
    color: '#22c55e',
    subItems: ['Inundación', 'Lluvias intensas', 'Deslizamiento', 'Otro'],
  },
  {
    key: 'nna',
    label: 'Protección NNA',
    color: '#a855f7',
    subItems: ['Acoso', 'Otro'],
  },
  {
    key: 'escolar',
    label: 'Entorno Escolar',
    color: '#3b82f6',
    subItems: ['Alta circulación vehicular', 'Persona Sospechosa', 'Cruce Peligroso', 'Otro'],
  },
] as const

export default function ReportModal({
  userId,
  onClose,
}: {
  userId: string
  onClose: () => void
}) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]['key'] | null>(null)
  const [subItem, setSubItem] = useState<string | null>(null)
  const [location, setLocation] = useState('')
  const [when, setWhen] = useState(() => new Date().toISOString().slice(0, 16))
  const [description, setDescription] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const activeCategory = CATEGORIES.find((c) => c.key === category)
  const canSubmit = Boolean(category && subItem && location && when && confirmed)

  function handleCategoryClick(key: (typeof CATEGORIES)[number]['key']) {
    if (category === key) {
      setSubItem(null)
      return
    }
    setCategory(key)
    setSubItem(null)
  }

  async function handleSubmit() {
    if (!canSubmit || !category || !subItem) return
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('reports').insert({
      user_id: userId,
      category,
      situation: subItem,
      location,
      occurred_at: new Date(when).toISOString(),
      description: description || null,
    })

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
              <div
                key={item.text}
                className="flex items-start gap-3 rounded-xl bg-green-100 p-3"
              >
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
          Selecciona una situación. No incluyas nombres ni datos personales.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat.key
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => handleCategoryClick(cat.key)}
                className="rounded-full border px-4 py-1.5 font-instrument text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                style={
                  isActive
                    ? { backgroundColor: cat.color, borderColor: cat.color, color: '#fff' }
                    : { borderColor: '#afafaf', color: '#000' }
                }
              >
                {cat.label}
              </button>
            )
          })}
        </div>

        {activeCategory && !subItem && (
          <div className="animate-fade-up mt-3 flex flex-col overflow-hidden rounded-xl border border-hairline shadow-sm">
            {activeCategory.subItems.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSubItem(item)}
                className="flex items-center gap-2 px-3 py-2.5 text-left font-instrument text-sm text-black transition-colors duration-200 hover:bg-black/5"
              >
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: activeCategory.color }}
                />
                {item}
              </button>
            ))}
          </div>
        )}

        {activeCategory && subItem && (
          <div className="animate-fade-up mt-3">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-instrument text-sm font-medium"
              style={{ backgroundColor: `${activeCategory.color}20`, color: activeCategory.color }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: activeCategory.color }}
              />
              {subItem}
            </span>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-hairline pt-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="font-instrument text-xs font-medium text-black/60">
              Seleccionar ubicación
            </span>
            <div className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2">
              <MapPin className="h-4 w-4 flex-shrink-0 text-black/40" />
              <input
                type="text"
                placeholder="Ej. Av. Pedro de heredia"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full min-w-0 font-instrument text-sm text-black outline-none placeholder:text-black/40"
              />
            </div>
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
