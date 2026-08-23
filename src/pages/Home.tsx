import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSession } from '../lib/useSession'

export default function Home() {
  const { session, loading } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !session) navigate('/login')
  }, [loading, session, navigate])

  if (loading || !session) return null

  const fullName = session.user.user_metadata.full_name as string | undefined
  const firstName = fullName?.split(' ')[0] ?? 'de nuevo'

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <span className="animate-fade-up rounded-full bg-brand/10 px-4 py-1.5 font-instrument text-sm text-brand">
          🧑‍🤝‍🧑 Sesión iniciada
        </span>
        <h1 className="animate-fade-up font-instrument text-3xl font-semibold text-black dark:text-white [animation-delay:100ms]">
          Hola, {firstName}! 👋
        </h1>
        <p className="animate-fade-up font-instrument text-black/60 dark:text-white/70 [animation-delay:150ms]">
          Bienvenido a <span className="font-semibold text-black dark:text-white">Safe Kids</span>. Tu plataforma
          de orientación y desplazamientos seguros. Explora el carrusel de herramientas para
          planificar tu ruta al colegio o de regreso a casa.
        </p>
        <div className="mt-2 flex animate-fade-up flex-wrap justify-center gap-4 [animation-delay:200ms]">
          <Link
            to="/how-it-works"
            className="rounded-2xl border border-hairline px-6 py-3 font-instrument font-semibold text-black shadow-sm transition-all duration-200 hover:scale-105 hover:border-brand hover:text-brand dark:text-white active:scale-95"
          >
            Cómo funciona
          </Link>
          <Link
            to="/dashboard"
            className="rounded-2xl bg-brand px-6 py-3 font-instrument font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
