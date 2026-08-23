import { X, Moon, Sun, Bell } from 'lucide-react'
import { useTheme } from '../lib/useTheme'
import { useState } from 'react'

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 px-4">
      <div className="animate-fade-up relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="pr-6 font-instrument text-xl font-semibold text-black">Configuración</h2>

        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-xl border border-hairline px-4 py-3">
            <span className="flex items-center gap-2 font-instrument text-sm text-black">
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-brand" />
              ) : (
                <Moon className="h-4 w-4 text-brand" />
              )}
              Modo oscuro
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar modo oscuro"
              className={`h-6 w-11 flex-shrink-0 rounded-full p-0.5 transition-colors duration-200 ${
                theme === 'dark' ? 'bg-brand' : 'bg-hairline/40'
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-hairline px-4 py-3">
            <span className="flex items-center gap-2 font-instrument text-sm text-black">
              <Bell className="h-4 w-4 text-brand" />
              Notificaciones
            </span>
            <button
              type="button"
              onClick={() => setNotifications((n) => !n)}
              aria-label="Alternar notificaciones"
              className={`h-6 w-11 flex-shrink-0 rounded-full p-0.5 transition-colors duration-200 ${
                notifications ? 'bg-brand' : 'bg-hairline/40'
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
