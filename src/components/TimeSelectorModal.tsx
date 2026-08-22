import { CloudSun, Sun, Moon, X } from 'lucide-react'

export type TimeOfDay = 'morning' | 'afternoon' | 'night'

const OPTIONS: { key: TimeOfDay; label: string; range: string; icon: typeof Sun }[] = [
  { key: 'morning', label: 'Mañana', range: '6:00 a.m - 12:00 p.m', icon: CloudSun },
  { key: 'afternoon', label: 'Tarde', range: '12:00 p.m - 6:00 p.m', icon: Sun },
  { key: 'night', label: 'Noche', range: '6:00 p.m - 11:59 p.m', icon: Moon },
]

export default function TimeSelectorModal({
  placeName,
  onClose,
  onSelect,
}: {
  placeName: string
  onClose: () => void
  onSelect: (time: TimeOfDay) => void
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

        <p className="pr-6 font-instrument text-xs text-black/50">{placeName}</p>
        <h2 className="mt-1 font-instrument text-xl font-semibold text-black">
          ¿A qué hora te desplazarás?
        </h2>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              className="flex flex-col items-center gap-2 rounded-xl border border-hairline px-2 py-4 text-center transition-all duration-200 hover:scale-105 hover:border-brand hover:shadow-md active:scale-95"
            >
              <option.icon className="h-7 w-7 text-brand" />
              <span className="font-instrument text-sm font-semibold text-black">
                {option.label}
              </span>
              <span className="font-instrument text-[11px] text-black/50">{option.range}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-brand/10 px-4 py-3">
          <p className="font-instrument text-xs text-brand">
            La información puede cambiar según el momento y las condiciones del entorno.
          </p>
        </div>
      </div>
    </div>
  )
}
