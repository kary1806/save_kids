import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'
import { INPUT_CLASS } from '../lib/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-8 py-16">
        <h1 className="animate-fade-up font-instrument text-3xl font-semibold text-black">Iniciar sesión</h1>

        <form
          onSubmit={handleSubmit}
          className="flex animate-fade-up flex-col gap-4 [animation-delay:100ms]"
        >
          <input
            type="email"
            required
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLASS}
          />
          <input
            type="password"
            required
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={INPUT_CLASS}
          />

          {error && <p className="font-instrument text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-brand px-6 py-3 font-instrument text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="animate-fade-up text-center font-instrument text-sm text-black/60 [animation-delay:150ms]">
          ¿No tienes cuenta?{' '}
          <Link
            to="/"
            className="text-brand underline transition-opacity duration-200 hover:opacity-70"
          >
            Vuelve al inicio
          </Link>
        </p>
      </main>
    </div>
  )
}
