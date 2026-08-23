import { X, MapPin, Info, ShoppingBag, Lightbulb, CarFront } from 'lucide-react'
import type { TimeOfDay } from './TimeSelectorModal'

const TIME_LABEL: Record<TimeOfDay, string> = {
  morning: 'la mañana',
  afternoon: 'la tarde',
  night: 'la noche',
}

const RISK_ITEMS = [
  { label: 'Robo', icon: ShoppingBag, color: '#ef4444' },
  { label: 'Poca iluminación', icon: Lightbulb, color: '#ef4444' },
  { label: 'Accidente', icon: CarFront, color: '#f59e0b' },
]

export default function ConditionsModal({
  placeName,
  address,
  time,
  userInitial,
  onClose,
}: {
  placeName: string
  address: string
  time: TimeOfDay
  userInitial: string
  onClose: () => void
}) {
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

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-green-100 p-5">
            <p className="font-instrument text-base font-semibold text-black">
              Condiciones y riesgos reportados para {TIME_LABEL[time]}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {RISK_ITEMS.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon className="h-4 w-4 text-white" />
                  </span>
                  <span className="font-instrument text-sm text-black">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-100 p-5">
            <p className="font-instrument text-base font-semibold text-black">
              Recomendaciones preventivas
            </p>
            <p className="mt-4 font-instrument text-sm text-black/80">
              Considera utilizar vías principales, evita zonas poco iluminadas y desplázate
              acompañado.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 font-instrument text-sm text-black/60">
          Última actualización: Hace 2 días
          <Info className="h-4 w-4 flex-shrink-0 text-black/40" />
        </div>
      </div>
    </div>
  )
}
