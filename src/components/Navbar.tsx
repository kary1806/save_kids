import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../lib/useSession'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const { session } = useSession()
  const isAuthenticated = !!session
  const navigate = useNavigate()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="flex h-[95px] w-full items-center justify-between border-b border-hairline px-8 md:px-16">
      <Link
        to={isAuthenticated ? '/home' : '/'}
        className="font-instrument text-2xl font-semibold text-brand-logo transition-transform duration-200 hover:scale-105 md:text-[32px]"
      >
        Logo
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <a
          href="#"
          className="font-instrument text-base text-black transition-colors duration-200 hover:text-brand"
        >
          Blog
        </a>
        <a
          href="#"
          className="font-instrument text-base text-black transition-colors duration-200 hover:text-brand"
        >
          Contac Us
        </a>
        <a
          href="#"
          className="font-instrument text-base text-black transition-colors duration-200 hover:text-brand"
        >
          About Us
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Toggle theme"
          className="hidden h-9 w-9 items-center justify-center rounded-full border border-hairline text-black transition-transform duration-200 hover:rotate-12 hover:scale-110 md:flex"
        >
          🌙
        </button>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-2xl bg-brand px-6 py-2 font-instrument text-sm text-white transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Cerrar sesión
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-2xl border border-hairline px-6 py-2 font-instrument text-sm text-black transition-all duration-200 hover:scale-105 hover:border-brand hover:text-brand active:scale-95"
            >
              login
            </Link>
            <Link
              to="/signup"
              className="rounded-2xl bg-brand px-6 py-2 font-instrument text-sm text-white transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
