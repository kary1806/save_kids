import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [firstName, setFirstName] = useState('de nuevo')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return

      if (!data.session) {
        navigate('/login')
        return
      }

      const fullName = data.session.user.user_metadata.full_name as string | undefined
      setFirstName(fullName?.split(' ')[0] ?? 'de nuevo')
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [navigate])

  if (loading) return null

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <Link
          to="/how-it-works"
          className="animate-fade-up rounded-full bg-brand/10 px-4 py-1.5 font-instrument text-sm text-brand transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          🧑‍🤝‍🧑 Sesión iniciada
        </Link>
        <h1 className="animate-fade-up font-instrument text-3xl font-semibold text-black [animation-delay:100ms]">
          Hola, {firstName}! 👋
        </h1>
        <p className="animate-fade-up font-instrument text-black/60 [animation-delay:150ms]">
          Bienvenido a <span className="font-semibold text-black">Safe Kids</span>. Tu plataforma
          de orientación y desplazamientos seguros. Explora el carrusel de herramientas para
          planificar tu ruta al colegio o de regreso a casa.
        </p>
      </main>
    </div>
  )
}
