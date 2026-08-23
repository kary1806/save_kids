import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps'
import {
  ShieldCheck,
  Home,
  TriangleAlert,
  Route,
  User,
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
import ProfileModal from '../components/ProfileModal'
import SettingsModal from '../components/SettingsModal'
import HelpModal from '../components/HelpModal'

type MapCategory = { key: string; label: string; color: string }
type ReportMarker = {
  id: string
  category: string
  situation: string
  latitude: number
  longitude: number
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const CARTAGENA_CENTER = { lat: 10.406, lng: -75.5144 }

const NAV_ITEMS = [
  { label: 'Inicio', icon: Home, color: '#000000' },
  { label: 'Reportar Situación', icon: TriangleAlert, color: '#f97316' },
  { label: 'Rutas', icon: Route, color: '#16a34a' },
  { label: 'Tu perfil', icon: User, color: '#000000' },
]

function Sidebar({
  activeNav,
  onNavClick,
  onClose,
  onSignOut,
  onOpenSettings,
  onOpenHelp,
}: {
  activeNav: string
  onNavClick: (label: string) => void
  onClose?: () => void
  onSignOut: () => void
  onOpenSettings: () => void
  onOpenHelp: () => void
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
          onClick={onOpenSettings}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-brand/5"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          Configuración
        </button>
        <button
          type="button"
          onClick={onOpenHelp}
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
  const [category, setCategory] = useState('todo')
  const [mapCategories, setMapCategories] = useState<MapCategory[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [timeModalOpen, setTimeModalOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState<TimeOfDay | null>(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Inicio')
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied' | 'blocked'>(
    'pending',
  )
  const [reportMarkers, setReportMarkers] = useState<ReportMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<ReportMarker | null>(null)

  const selectedPlace = {
    name: 'Centro Comercial Caribe Plaza',
    address: 'Cl. 29d #22-108, Pie de la Popa, Cartagena de Indias, Bolívar',
  }

  useEffect(() => {
    if (!loading && !session) navigate('/login')
  }, [loading, session, navigate])

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('denied')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        setLocationStatus('granted')
      },
      (error) => setLocationStatus(error.code === error.PERMISSION_DENIED ? 'blocked' : 'denied'),
    )
  }

  useEffect(() => {
    if (!navigator.permissions?.query) {
      requestLocation()
      return
    }

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        setLocationStatus('blocked')
      } else {
        requestLocation()
      }
      result.onchange = () => {
        if (result.state === 'granted') requestLocation()
        if (result.state === 'denied') setLocationStatus('blocked')
      }
    })
  }, [])

  useEffect(() => {
    supabase
      .from('report_categories')
      .select('*')
      .order('sort_order')
      .then(({ data }) => setMapCategories(data ?? []))
  }, [])

  useEffect(() => {
    let query = supabase
      .from('reports')
      .select('id, category, situation, latitude, longitude')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (category !== 'todo') query = query.eq('category', category)

    query.then(({ data }) => setReportMarkers(data ?? []))
  }, [category])

  const filterOptions = useMemo(
    () => [{ key: 'todo', label: 'Todo', color: '#000000' }, ...mapCategories],
    [mapCategories],
  )

  function categoryColor(key: string) {
    return mapCategories.find((c) => c.key === key)?.color ?? '#6b7280'
  }

  function categoryLabel(key: string) {
    return mapCategories.find((c) => c.key === key)?.label ?? key
  }

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
    if (label === 'Reportar Situación') setReportModalOpen(true)
    if (label === 'Tu perfil') setProfileModalOpen(true)
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <aside className="hidden flex-shrink-0 border-r border-hairline md:flex">
        <Sidebar
          activeNav={activeNav}
          onNavClick={handleNavClick}
          onSignOut={handleSignOut}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onOpenHelp={() => setHelpModalOpen(true)}
        />
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
              onOpenSettings={() => {
                setSettingsModalOpen(true)
                setMenuOpen(false)
              }}
              onOpenHelp={() => {
                setHelpModalOpen(true)
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
              placeholder={locationStatus === 'granted' ? 'Tu ubicación actual' : '¿A dónde vas?'}
              className="w-full min-w-0 font-instrument text-sm text-black outline-none placeholder:text-black/40"
            />
          </div>

          <button type="button" aria-label="Notificaciones" className="flex-shrink-0">
            <Bell className="h-5 w-5 text-black/70" />
          </button>

          <button
            type="button"
            onClick={() => setProfileModalOpen(true)}
            aria-label="Tu perfil"
            className="flex flex-shrink-0 items-center gap-2 transition-transform duration-200 hover:scale-105"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-instrument text-sm font-semibold text-white">
              {initial}
            </span>
            <div className="hidden text-left sm:block">
              <p className="font-instrument text-sm font-medium text-black">{displayName}</p>
              {role && <p className="font-instrument text-xs capitalize text-black/50">{role}</p>}
            </div>
          </button>
        </header>

        <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {filterOptions.map((cat) => (
            <button
              key={cat.key}
              type="button"
              onClick={() => setCategory(cat.key)}
              className="flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-instrument text-sm font-semibold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
              style={
                category === cat.key
                  ? { backgroundColor: cat.color, borderColor: cat.color, color: '#fff' }
                  : { borderColor: cat.color, color: '#000' }
              }
            >
              {category !== cat.key && (
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1">
          <ZoneReportsPanel
            category={category}
            locationStatus={locationStatus}
            onConsultarHorario={() => setTimeModalOpen(true)}
          />
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={CARTAGENA_CENTER}
            center={userLocation ?? undefined}
            defaultZoom={13}
            zoom={userLocation ? 14 : undefined}
            disableDefaultUI={false}
            className="h-full w-full"
            onClick={() => setSelectedMarker(null)}
          >
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <div className="h-4 w-4 rounded-full border-[3px] border-white bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.3)]" />
              </AdvancedMarker>
            )}

            {reportMarkers.map((marker) => (
              <AdvancedMarker
                key={marker.id}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                onClick={() => setSelectedMarker(marker)}
              >
                <Pin
                  background={categoryColor(marker.category)}
                  borderColor="#ffffff"
                  glyphColor="#ffffff"
                />
              </AdvancedMarker>
            ))}

            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="font-instrument text-sm">
                  <strong>{selectedMarker.situation}</strong>
                  <br />
                  {categoryLabel(selectedMarker.category)}
                </div>
              </InfoWindow>
            )}
          </Map>

          <div className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-hairline bg-white px-4 py-3 shadow-lg">
            <p className="mb-2 font-instrument text-xs font-semibold text-black">
              Información del Mapa
            </p>
            <div className="flex flex-col gap-1">
              {mapCategories.map((cat) => (
                <div key={cat.key} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-instrument text-xs text-black/70">{cat.label}</span>
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

      {profileModalOpen && (
        <ProfileModal
          displayName={displayName}
          email={session.user.email ?? ''}
          role={role}
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {settingsModalOpen && <SettingsModal onClose={() => setSettingsModalOpen(false)} />}

      {helpModalOpen && <HelpModal onClose={() => setHelpModalOpen(false)} />}
    </div>
    </APIProvider>
  )
}
