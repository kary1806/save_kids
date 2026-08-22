import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'
import { INPUT_CLASS } from '../lib/ui'

const ROLE_LABEL: Record<string, string> = {
  adolescente: 'Adolescente',
  acudiente: 'Acudiente',
}

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
      navigate('/')
    } else {
      setNeedsConfirmation(true)
    }
  }

  if (needsConfirmation) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <h1 className="font-instrument text-3xl font-semibold text-black">Revisa tu correo</h1>
          <p className="font-instrument text-black/60">
            Te enviamos un link de confirmación a {email}.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-8 py-16">
        <div className="animate-fade-up">
          <h1 className="font-instrument text-3xl font-semibold text-black">Crear cuenta</h1>
          <p className="mt-1 font-instrument text-xl font-normal text-black/60">
            Registrándote como {ROLE_LABEL[role]}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex animate-fade-up flex-col gap-4 [animation-delay:100ms]"
        >
          <input
            type="text"
            required
            placeholder="Nombre completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={INPUT_CLASS}
          />
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
            minLength={6}
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="animate-fade-up text-center font-instrument text-sm text-black/60 [animation-delay:150ms]">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand underline transition-opacity duration-200 hover:opacity-70">
            Inicia sesión
          </Link>
        </p>
      </main>
    </div>
  )
}
