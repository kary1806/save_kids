import { X } from 'lucide-react'
import iconMorning from '../assets/icon-morning.png'
import iconAfternoon from '../assets/icon-afternoon.png'
import iconNight from '../assets/icon-night.png'

export type TimeOfDay = 'morning' | 'afternoon' | 'night'

const OPTIONS: { key: TimeOfDay; label: string; range: string; icon: string }[] = [
  { key: 'morning', label: 'Mañana', range: '6:00 a.m - 12:00 p.m', icon: iconMorning },
  { key: 'afternoon', label: 'Tarde', range: '12:00 p.m - 6:00 p.m', icon: iconAfternoon },
  { key: 'night', label: 'Noche', range: '6:00 p.m - 11:59 p.m', icon: iconNight },
]

export default function TimeSelectorModal({
  onClose,
  onSelect,
}: {
  placeName: string
  onClose: () => void
  onSelect: (time: TimeOfDay) => void
}) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8 sm:items-center">
      <div className="animate-fade-up relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl sm:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-center font-instrument text-2xl font-bold text-black">
          ¿A qué hora te desplazarás?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              className="flex flex-col items-center gap-3 rounded-2xl border border-hairline px-4 py-8 text-center transition-all duration-200 hover:scale-105 hover:border-brand hover:shadow-md active:scale-95"
            >
              <img src={option.icon} alt="" className="h-14 w-14" />
              <span className="font-instrument text-lg font-semibold text-black">
                {option.label}
              </span>
              <span className="font-instrument text-sm text-black/50">{option.range}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-brand/10 px-4 py-4 text-center">
          <p className="font-instrument text-sm text-brand">
            La información puede cambiar según el momento y las condiciones del entorno.
          </p>
        </div>
      </div>
    </div>
  )
}
