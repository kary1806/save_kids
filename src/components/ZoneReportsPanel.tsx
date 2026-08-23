import { useState } from 'react'
import { MapPin, ChevronDown, ChevronUp, TriangleAlert, Wallet, UserX, ShieldAlert, CircleHelp } from 'lucide-react'

const REPORT_TYPES = [
  { label: 'Robo', count: 12, icon: Wallet, color: '#dc2626' },
  { label: 'Acoso', count: 8, icon: UserX, color: '#9333ea' },
  { label: 'Violencia', count: 5, icon: ShieldAlert, color: '#ea580c' },
  { label: 'Otro', count: 3, icon: CircleHelp, color: '#6b7280' },
]

const HOURLY_REPORTS = [
  { hour: '6', value: 2 },
  { hour: '8', value: 3 },
  { hour: '10', value: 2 },
  { hour: '12', value: 4 },
  { hour: '14', value: 3 },
  { hour: '16', value: 5 },
  { hour: '18', value: 9 },
  { hour: '20', value: 11 },
  { hour: '22', value: 7 },
  { hour: '0', value: 2 },
]

const PEAK_HOURS = ['18', '20', '22']
const maxValue = Math.max(...HOURLY_REPORTS.map((h) => h.value))

export default function ZoneReportsPanel() {
  const [open, setOpen] = useState(false)

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

          <div>
            <p className="font-instrument text-sm font-semibold text-black">
              Reportes registrados
            </p>
            <p className="font-instrument text-xs text-black/50">Últimos 7 días</p>

            <div className="mt-3 flex flex-col gap-2">
              {REPORT_TYPES.map((report) => (
                <div key={report.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-instrument text-sm text-black">
                    <report.icon className="h-4 w-4" style={{ color: report.color }} />
                    {report.label}
                  </span>
                  <span className="font-instrument text-sm font-semibold text-black">
                    {report.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-instrument text-sm font-semibold text-black">
              Horarios con más reportes
            </p>
            <p className="font-instrument text-xs text-black/50">Basado en reportes recientes</p>

            <div className="mt-3 flex items-end gap-1.5">
              {HOURLY_REPORTS.map((h) => (
                <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      PEAK_HOURS.includes(h.hour) ? 'bg-brand' : 'bg-divider'
                    }`}
                    style={{ height: `${(h.value / maxValue) * 48}px` }}
                  />
                  <span className="font-instrument text-[10px] text-black/40">{h.hour}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center font-instrument text-xs font-medium text-brand">
              18:00 – 22:00
            </p>
          </div>

          <button
            type="button"
            className="rounded-2xl border border-hairline px-4 py-2.5 font-instrument text-sm font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:border-brand hover:text-brand active:scale-95"
          >
            Consultar por horario
          </button>
        </div>
      )}
    </div>
  )
}
