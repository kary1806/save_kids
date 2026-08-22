import { X, MapPin, Clock, ShoppingBag, Lightbulb, CarFront, TriangleAlert } from 'lucide-react'
import type { TimeOfDay } from './TimeSelectorModal'

const TIME_LABEL: Record<TimeOfDay, string> = {
  morning: 'la mañana',
  afternoon: 'la tarde',
  night: 'la noche',
}

const RISK_TAGS = [
  { label: 'Robo', icon: ShoppingBag, color: '#dc2626', bg: '#fee2e2' },
  { label: 'Poca iluminación', icon: Lightbulb, color: '#6b7280', bg: '#f3f4f6' },
  { label: 'Accidente', icon: CarFront, color: '#d97706', bg: '#fef3c7' },
]

export default function ConditionsModal({
  placeName,
  address,
  time,
  onClose,
}: {
  placeName: string
  address: string
  time: TimeOfDay
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 px-4">
      <div className="animate-fade-up relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 text-black/40 transition-colors duration-200 hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="pr-6 font-instrument text-lg font-semibold text-black">{placeName}</h2>
        <p className="mt-1 font-instrument text-sm text-black/60">
          Condiciones y riesgos reportados para {TIME_LABEL[time]}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {RISK_TAGS.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 font-instrument text-xs font-medium"
              style={{ backgroundColor: tag.bg, color: tag.color }}
            >
              <tag.icon className="h-3.5 w-3.5" />
              {tag.label}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3">
          <TriangleAlert className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="font-instrument text-sm font-semibold text-amber-800">
              Recomendaciones preventivas
            </p>
            <p className="mt-0.5 font-instrument text-xs text-amber-800/80">
              Considera utilizar vías principales, evita zonas poco iluminadas y desplázate
              acompañado.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 font-instrument text-xs text-black/60">
          <MapPin className="h-4 w-4 flex-shrink-0 text-black/40" />
          {address}
        </div>
        <div className="mt-1 flex items-center gap-2 font-instrument text-xs text-black/40">
          <Clock className="h-4 w-4 flex-shrink-0" />
          Última actualización: hace 2 días
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-brand px-6 py-3 font-instrument font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
