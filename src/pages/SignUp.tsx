import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormField from '../components/FormField'
import PasswordField from '../components/PasswordField'
import GoogleButton from '../components/GoogleButton'
import OrDivider from '../components/OrDivider'
import { supabase } from '../lib/supabase'

export default function SignUp() {
  const [searchParams] = useSearchParams()
  const role = searchParams.get('role') === 'acudiente' ? 'acudiente' : 'adolescente'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role,
        full_name: fullName,
      })
      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }
    }

    setLoading(false)

    if (data.session) {
      navigate('/home')
    } else {
      setNeedsConfirmation(true)
    }
  }

  if (needsConfirmation) {
    return (
      <AuthLayout>
        <div className="animate-fade-up rounded-2xl border border-hairline bg-white p-8 text-center shadow-lg">
          <h1 className="font-instrument text-2xl font-semibold text-black">Revisa tu correo</h1>
          <p className="mt-2 font-instrument text-black/60">
            Te enviamos un link de confirmación a {email}.
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="rounded-2xl border border-hairline bg-white p-8 shadow-lg">
        <h1 className="font-instrument text-2xl font-semibold text-black">Crea tu cuenta</h1>
        <p className="mt-1 font-instrument text-sm text-black/60">
          Únete a Safe Kids y empieza a proteger tus recorridos.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <FormField
            label="Nombre completo"
            name="fullName"
            type="text"
            required
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="font-instrument text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-brand px-6 py-3 font-instrument text-white transition-transform duration-200 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <OrDivider />

          <GoogleButton />
        </form>

        <p className="mt-6 text-center font-instrument text-sm text-black/60">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-brand underline transition-opacity duration-200 hover:opacity-70"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
