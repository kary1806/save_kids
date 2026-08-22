import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import GoogleButton from '../components/GoogleButton'
import OrDivider from '../components/OrDivider'
import { supabase } from '../lib/supabase'

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

    navigate('/home')
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-hairline bg-white p-8 shadow-lg">
        <h1 className="font-instrument text-2xl font-semibold text-black">Inicia sesión</h1>
        <p className="mt-1 font-instrument text-sm text-black/60">
          Bienvenido de vuelta a Safe Kids.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            required
            placeholder="tunombre@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordField
            label="Contraseña"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="font-instrument text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-brand px-6 py-3 font-instrument text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <OrDivider />

          <GoogleButton />
        </form>

        <p className="mt-6 text-center font-instrument text-sm text-black/60">
          ¿No tienes cuenta?{' '}
          <Link
            to="/"
            className="text-brand underline transition-opacity duration-200 hover:opacity-70"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
