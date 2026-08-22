import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useSession } from '../lib/useSession'
import iconTeens from '../assets/icon-teens.svg'

const CATEGORIES = [
  { key: 'todo', label: 'Todo' },
  { key: 'seguridad', label: 'Seguridad Ciudadana' },
  { key: 'vial', label: 'Riesgo Vial' },
  { key: 'ambiental', label: 'Ambiental' },
  { key: 'nna', label: 'Protección NNA' },
  { key: 'escolar', label: 'Entorno Escolar' },
] as const

type RiskLevel = 'safe' | 'medium' | 'high'

const RISK_COLOR: Record<RiskLevel, string> = {
  safe: '#16a34a',
  medium: '#f59e0b',
  high: '#dc2626',
}

const RISK_LABEL: Record<RiskLevel, string> = {
  safe: 'Riesgo bajo',
  medium: 'Riesgo medio',
  high: 'Riesgo alto',
}

const ZONES: {
  id: string
  name: string
  category: (typeof CATEGORIES)[number]['key']
  risk: RiskLevel
  lat: number
  lng: number
}[] = [
  { id: '1', name: 'Castellana', category: 'seguridad', risk: 'safe', lat: 10.4058, lng: -75.4863 },
  { id: '2', name: 'Getsemaní', category: 'escolar', risk: 'medium', lat: 10.4185, lng: -75.5453 },
  { id: '3', name: 'Centro', category: 'vial', risk: 'medium', lat: 10.4236, lng: -75.5497 },
  { id: '4', name: 'El Bosque', category: 'ambiental', risk: 'safe', lat: 10.3891, lng: -75.4954 },
  { id: '5', name: 'Pie del Cerro', category: 'nna', risk: 'high', lat: 10.4102, lng: -75.5321 },
]

function riskIcon(risk: RiskLevel) {
  const color = RISK_COLOR[risk]
  return L.divIcon({
    className: '',
    html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })
}

const NAV_ITEMS = [
  { label: 'Inicio', icon: '🏠', active: true },
  { label: 'Mapa', icon: '🗺️', active: false },
  { label: 'Reportar Situación', icon: '⚠️', active: false },
  { label: 'Rutas', icon: '🧭', active: false },
  { label: 'Tú zona', icon: '📍', active: false },
]

export default function Dashboard() {
  const { session, loading } = useSession()
  const navigate = useNavigate()
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]['key']>('todo')

  useEffect(() => {
    if (!loading && !session) navigate('/login')
  }, [loading, session, navigate])

  const visibleZones = useMemo(
    () => (category === 'todo' ? ZONES : ZONES.filter((z) => z.category === category)),
    [category],
  )

  if (loading || !session) return null

  const fullName = session.user.user_metadata.full_name as string | undefined
  const role = session.user.user_metadata.role as string | undefined
  const displayName = fullName ?? 'Usuaria'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-hairline px-4 py-6">
        <div className="flex items-center gap-2 px-2">
          <span className="text-xl">🛡️</span>
          <span className="font-instrument text-lg font-bold text-black">SAFE KIDS</span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-instrument text-sm transition-colors duration-200 ${
                item.active
                  ? 'bg-brand text-white'
                  : 'text-black hover:bg-brand/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 flex flex-col gap-1 border-t border-hairline pt-6">
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-brand/5"
          >
            ⚙️ Configuración
          </button>
          <button
            type="button"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-brand/5"
          >
            ❓ Ayuda
          </button>
        </div>

        <div className="mt-auto rounded-xl bg-brand/5 p-4">
          <img src={iconTeens} alt="" className="h-10 w-10" />
          <p className="mt-2 font-instrument text-sm font-semibold text-brand">
            Tu información hace la diferencia
          </p>
          <p className="mt-1 font-instrument text-xs text-black/60">
            Reporta y consulta para tener una ciudad más segura.
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-4 border-b border-hairline px-6 py-4">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-hairline px-4 py-2">
            <span className="text-black/40">🔍</span>
            <input
              type="text"
              placeholder="¿A dónde vas?"
              className="w-full font-instrument text-sm text-black outline-none placeholder:text-black/40"
            />
          </div>
          <button type="button" aria-label="Notificaciones" className="text-xl">
            🔔
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-instrument text-sm font-semibold text-white">
              {initial}
            </span>
            <div className="hidden text-left sm:block">
              <p className="font-instrument text-sm font-medium text-black">{displayName}</p>
              {role && <p className="font-instrument text-xs capitalize text-black/50">{role}</p>}
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 border-b border-hairline px-6 py-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className={`rounded-full border px-4 py-1.5 font-instrument text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                category === cat.key
                  ? 'border-brand bg-brand text-white'
                  : 'border-hairline text-black hover:border-brand hover:text-brand'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <MapContainer
            center={[10.406, -75.5144]}
            zoom={13}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {visibleZones.map((zone) => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={riskIcon(zone.risk)}>
                <Popup>
                  <strong>{zone.name}</strong>
                  <br />
                  {RISK_LABEL[zone.risk]}
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-hairline bg-white px-4 py-3 shadow-lg">
            <p className="mb-2 font-instrument text-xs font-semibold text-black">
              Información del Mapa
            </p>
            <div className="flex flex-col gap-1">
              {(Object.keys(RISK_COLOR) as RiskLevel[]).map((risk) => (
                <div key={risk} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: RISK_COLOR[risk] }}
                  />
                  <span className="font-instrument text-xs text-black/70">
                    {RISK_LABEL[risk]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
