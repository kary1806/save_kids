import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps'
import {
  ShieldCheck,
  Shield,
  Home,
  Megaphone,
  Route,
  User,
  Settings,
  HelpCircle,
  Bell,
  Menu,
  X,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'
import { useSession } from '../lib/useSession'
import { useTheme } from '../lib/useTheme'
import { supabase } from '../lib/supabase'
import ZoneReportsPanel from '../components/ZoneReportsPanel'
import TimeSelectorModal, { type TimeOfDay } from '../components/TimeSelectorModal'
import ConditionsModal from '../components/ConditionsModal'
import ReportModal from '../components/ReportModal'
import PlaceAutocompleteInput from '../components/PlaceAutocompleteInput'
import ProfileModal from '../components/ProfileModal'
import SettingsModal from '../components/SettingsModal'
import HelpModal from '../components/HelpModal'
import MyReportsPanel from '../components/MyReportsPanel'
import infoCardIllustration from '../assets/info-card-illustration.png'

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

function RecenterMap({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap()
  useEffect(() => {
    if (map && target) {
      map.panTo(target)
      map.setZoom(15)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, target?.lat, target?.lng])
  return null
}

const NAV_ITEMS = [
  { label: 'Inicio', icon: Home, color: '#000000' },
  { label: 'Reportar Situación', icon: Megaphone, color: '#f97316' },
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
    <div className="flex h-full w-64 flex-col bg-white px-4 py-6 dark:bg-gray-900">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-brand" />
          <span className="font-instrument text-lg font-bold text-black dark:text-white">
            SAFE <span className="text-brand">KIDS</span>
          </span>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Cerrar menú" className="md:hidden">
            <X className="h-5 w-5 text-black/60 dark:text-white/60" />
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
                isActive
                  ? 'bg-brand text-white'
                  : 'text-black hover:bg-brand/5 dark:text-white dark:hover:bg-white/5'
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

      <div className="mt-6 flex flex-col gap-1 border-t border-hairline pt-6 dark:border-white/10">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-brand/5 dark:text-white/60 dark:hover:bg-white/5"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          Configuración
        </button>
        <button
          type="button"
          onClick={onOpenHelp}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-brand/5 dark:text-white/60 dark:hover:bg-white/5"
        >
          <HelpCircle className="h-5 w-5 flex-shrink-0" />
          Ayuda
        </button>
        <button
          type="button"
          onClick={onSignOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left font-instrument text-sm text-black/60 transition-colors duration-200 hover:bg-red-50 hover:text-red-600 dark:text-white/60"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>

      <div className="mt-auto overflow-hidden rounded-xl shadow-md">
        <img src={infoCardIllustration} alt="" className="h-auto w-full" />
        <div className="bg-white p-4 dark:bg-gray-900">
          <p className="font-instrument text-sm font-bold leading-tight text-brand">
            Tu información hace la diferencia
          </p>
          <p className="mt-1 font-instrument text-xs text-black/60 dark:text-white/60">
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
  const { theme, toggleTheme } = useTheme()
  const [category, setCategory] = useState('todo')
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
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
  const [searchedPlace, setSearchedPlace] = useState<{
    lat: number
    lng: number
    address: string
  } | null>(null)
  const [locationStatus, setLocationStatus] = useState<'pending' | 'granted' | 'denied' | 'blocked'>(
    'pending',
  )
  const [reportMarkers, setReportMarkers] = useState<ReportMarker[]>([])
  const [selectedMarker, setSelectedMarker] = useState<ReportMarker | null>(null)
  const [reportsVersion, setReportsVersion] = useState(0)

  const selectedCoords = searchedPlace
    ? { lat: searchedPlace.lat, lng: searchedPlace.lng }
    : userLocation

  const selectedPlace = searchedPlace
    ? {
        name: searchedPlace.address.split(',')[0],
        address: searchedPlace.address,
      }
    : userLocation
      ? {
          name: 'Tu ubicación actual',
          address: 'Ubicación detectada automáticamente',
        }
      : {
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
  }, [category, reportsVersion])

  const filterOptions = useMemo(
    () => [{ key: 'todo', label: 'Todo', color: '#235ee0' }, ...mapCategories],
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
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
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
        <header className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="md:hidden"
          >
            <Menu className="h-6 w-6 text-black dark:text-white" />
          </button>

          <div className="flex min-w-[140px] flex-1 items-center gap-2 rounded-full border border-hairline px-4 py-1.5 dark:border-white/20">
            <PlaceAutocompleteInput
              placeholder={locationStatus === 'granted' ? 'Tu ubicación actual' : '¿A dónde vas?'}
              className="w-full min-w-0 font-instrument text-sm text-black outline-none"
              biasCenter={userLocation}
              onPlaceSelected={(place) =>
                setSearchedPlace({ lat: place.lat, lng: place.lng, address: place.address })
              }
            />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
            className="flex flex-shrink-0 items-center justify-center rounded-full border border-hairline p-2 text-black transition-transform duration-200 hover:rotate-12 hover:scale-110 dark:border-white/20 dark:text-white"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button type="button" aria-label="Notificaciones" className="flex-shrink-0">
            <Bell className="h-5 w-5 text-black/70 dark:text-white/70" />
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
              <p className="font-instrument text-sm font-medium text-black dark:text-white">
                {displayName}
              </p>
              {role && (
                <p className="font-instrument text-xs capitalize text-black/50 dark:text-white/50">
                  {role}
                </p>
              )}
            </div>
          </button>
        </header>

        {activeNav === 'Rutas' ? (
          <MyReportsPanel userId={session.user.id} />
        ) : (
        <>
        <div className="flex gap-3 overflow-x-auto px-4 py-3 sm:px-6">
          {filterOptions.map((cat) => {
            const isActive = category === cat.key
            const isHighlighted = isActive || hoveredCategory === cat.key
            const neutralBorder = theme === 'dark' ? 'rgba(255,255,255,0.15)' : '#e5e4e7'
            const neutralText = theme === 'dark' ? '#fff' : '#000'
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                onMouseEnter={() => setHoveredCategory(cat.key)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 font-instrument text-sm transition-all duration-200 active:scale-95"
                style={
                  isActive
                    ? { backgroundColor: cat.color, borderColor: cat.color, color: '#fff' }
                    : isHighlighted
                      ? { borderColor: cat.color, color: neutralText }
                      : { borderColor: neutralBorder, color: neutralText }
                }
              >
                {isHighlighted && (
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: isActive ? '#fff' : cat.color }}
                  />
                )}
                {cat.label}
              </button>
            )
          })}
        </div>

        <div className="relative mt-2 flex-1">
          <ZoneReportsPanel
            category={category}
            locationStatus={locationStatus}
            reportsVersion={reportsVersion}
            onConsultarHorario={() => setTimeModalOpen(true)}
          />
          <Map
            mapId="DEMO_MAP_ID"
            defaultCenter={CARTAGENA_CENTER}
            defaultZoom={13}
            disableDefaultUI={false}
            className="h-full w-full"
            onClick={() => setSelectedMarker(null)}
          >
            <RecenterMap target={searchedPlace ?? userLocation} />

            {searchedPlace && (
              <AdvancedMarker position={searchedPlace}>
                <Pin background="#235ee0" borderColor="#ffffff" glyphColor="#ffffff" />
              </AdvancedMarker>
            )}

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

          <div className="absolute bottom-4 left-4 z-[1000] flex w-fit flex-col gap-2 rounded-2xl bg-white px-5 py-3 shadow-xl">
            <p className="flex items-center gap-1.5 whitespace-nowrap font-instrument text-xs font-semibold text-black">
              <Shield className="h-3.5 w-3.5 flex-shrink-0 text-brand" />
              Información del Mapa
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              {mapCategories.map((cat) => (
                <div key={cat.key} className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0">
                    <path
                      d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
                      fill={cat.color}
                    />
                    <circle cx="12" cy="10" r="3" fill="#ffffff" />
                  </svg>
                  <span className="whitespace-nowrap font-instrument text-xs text-black/70">
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
        )}
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
          coords={selectedCoords}
          time={selectedTime}
          userInitial={initial}
          onClose={() => setSelectedTime(null)}
        />
      )}

      {reportModalOpen && (
        <ReportModal
          userId={session.user.id}
          userLocation={userLocation}
          onReportCreated={() => setReportsVersion((v) => v + 1)}
          onClose={() => setReportModalOpen(false)}
        />
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
