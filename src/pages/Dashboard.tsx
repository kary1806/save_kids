import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ShieldCheck,
  Home,
  Map as MapIcon,
  TriangleAlert,
  Route,
  MapPin,
  Settings,
  HelpCircle,
  Search,
  Bell,
  Menu,
  X,
  Users,
  LogOut,
} from 'lucide-react'
import { useSession } from '../lib/useSession'
import { supabase } from '../lib/supabase'
import ZoneReportsPanel from '../components/ZoneReportsPanel'
import TimeSelectorModal, { type TimeOfDay } from '../components/TimeSelectorModal'
import ConditionsModal from '../components/ConditionsModal'
import ReportModal from '../components/ReportModal'

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
  { label: 'Inicio', icon: Home, color: '#000000' },
  { label: 'Mapa', icon: MapIcon, color: '#2563eb' },
  { label: 'Reportar Situación', icon: TriangleAlert, color: '#f97316' },
  { label: 'Rutas', icon: Route, color: '#16a34a' },
  { label: 'Tú zona', icon: MapPin, color: '#000000' },
]

function Sidebar({
  activeNav,
  onNavClick,
  onClose,
  onSignOut,
}: {
  activeNav: string
  onNavClick: (label: string) => void
  onClose?: () => void
  onSignOut: () => void
}) {
  return (
    <div className="flex h-full w-64 flex-col px-4 py-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-brand" />
          <span className="font-instrument text-lg font-bold text-black">
            SAFE <span className="text-brand">KIDS</span>
          </span>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Cerrar menú" className="md:hidden">
            <X className="h-5 w-5 text-black/60" />
          </button>
        )}
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavClick(item.label)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm transition-colors duration-200 ${
                isActive ? 'bg-brand text-white' : 'text-black hover:bg-brand/5'
              }`}
            >
              <item.icon
                className="h-5 w-5 flex-shrink-0"
                style={{ color: isActive ? '#ffffff' : item.color }}
              />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="mt-6 flex flex-col gap-1 border-t border-hairline pt-6">
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-brand/5"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          Configuración
        </button>
        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-brand/5"
        >
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          Ayuda
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>

      <div className="mt-auto overflow-hidden rounded-xl border border-hairline">
        <div className="flex items-center justify-center gap-3 bg-brand/10 py-6">
          <Users className="h-7 w-7 text-brand" />
          <ShieldCheck className="h-9 w-9 text-brand" />
        </div>
        <div className="bg-white p-4">
          <p className="font-instrument text-sm font-semibold text-brand">
            Tu información hace la diferencia
          </p>
          <p className="mt-1 font-instrument text-xs text-black/60">
            Reporta y consulta para tener una ciudad más segura.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { session, loading } = useSession()
  const navigate = useNavigate()
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]['key']>('todo')
  const [menuOpen, setMenuOpen] = useState(false)
  const [timeModalOpen, setTimeModalOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState<TimeOfDay | null>(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Inicio')

  const selectedPlace = {
    name: 'Centro Comercial Caribe Plaza',
    address: 'Cl. 29d #22-108, Pie de la Popa, Cartagena de Indias, Bolívar',
  }

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

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  function handleNavClick(label: string) {
    setActiveNav(label)
    if (label === 'Mapa') setTimeModalOpen(true)
    if (label === 'Reportar Situación') setReportModalOpen(true)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <aside className="hidden flex-shrink-0 border-r border-hairline md:flex">
        <Sidebar activeNav={activeNav} onNavClick={handleNavClick} onSignOut={handleSignOut} />
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-[2000] flex md:hidden">
          <div className="border-r border-hairline bg-white shadow-xl">
            <Sidebar
              activeNav={activeNav}
              onNavClick={(label) => {
                handleNavClick(label)
                setMenuOpen(false)
              }}
              onClose={() => setMenuOpen(false)}
              onSignOut={handleSignOut}
            />
          </div>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="flex-1 bg-black/30"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-4 sm:px-6">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6 text-black" />
          </button>

          <div className="flex min-w-[140px] flex-1 items-center gap-2 rounded-full border border-hairline px-4 py-2">
            <Search className="h-4 w-4 flex-shrink-0 text-black/40" />
            <input
              type="text"
              placeholder="¿A dónde vas?"
              className="w-full min-w-0 font-instrument text-sm text-black outline-none placeholder:text-black/40"
            />
          </div>

          <button type="button" aria-label="Notificaciones" className="flex-shrink-0">
            <Bell className="h-5 w-5 text-black/70" />
          </button>

          <div className="flex flex-shrink-0 items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-instrument text-sm font-semibold text-white">
              {initial}
            </span>
            <div className="hidden text-left sm:block">
              <p className="font-instrument text-sm font-medium text-black">{displayName}</p>
              {role && <p className="font-instrument text-xs capitalize text-black/50">{role}</p>}
            </div>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className={`flex-shrink-0 rounded-full border px-4 py-1.5 font-instrument text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                category === cat.key
                  ? 'border-brand bg-brand text-white shadow-md'
                  : 'border-hairline text-black hover:border-brand hover:text-brand'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <ZoneReportsPanel />
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

      {timeModalOpen && (
        <TimeSelectorModal
          placeName={selectedPlace.name}
          onClose={() => setTimeModalOpen(false)}
          onSelect={(time) => {
            setSelectedTime(time)
            setTimeModalOpen(false)
          }}
        />
      )}

      {selectedTime && (
        <ConditionsModal
          placeName={selectedPlace.name}
          address={selectedPlace.address}
          time={selectedTime}
          userInitial={initial}
          onClose={() => setSelectedTime(null)}
        />
      )}

      {reportModalOpen && (
        <ReportModal userId={session.user.id} onClose={() => setReportModalOpen(false)} />
      )}
    </div>
  )
}
