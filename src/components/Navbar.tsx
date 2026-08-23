import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { useSession } from '../lib/useSession'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/useTheme'

export default function Navbar() {
  const { session } = useSession()
  const isAuthenticated = !!session
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="flex h-[95px] w-full items-center justify-between border-b border-hairline px-8 dark:border-white/10 md:px-16">
      <Link
        to={isAuthenticated ? '/home' : '/'}
        className="font-instrument text-2xl font-semibold text-brand-logo transition-transform duration-200 hover:scale-105 dark:text-white md:text-[32px]"
      >
        Logo
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        <a
          href="#"
          className="font-instrument text-base text-black transition-colors duration-200 hover:text-brand dark:text-white"
        >
          Blog
        </a>
        <Link
          to="/contact"
          className="font-instrument text-base text-black transition-colors duration-200 hover:text-brand dark:text-white"
        >
          Contac Us
        </Link>
        <Link
          to="/about"
          className="font-instrument text-base text-black transition-colors duration-200 hover:text-brand dark:text-white"
        >
          About Us
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
          className="hidden h-9 w-9 items-center justify-center rounded-full border border-hairline text-black transition-transform duration-200 hover:rotate-12 hover:scale-110 dark:border-white/20 dark:text-white md:flex"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-2xl bg-brand px-6 py-2.5 font-instrument text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Log out
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-2xl border border-hairline px-6 py-2.5 font-instrument text-sm font-semibold text-black shadow-sm transition-all duration-200 hover:scale-105 hover:border-brand hover:text-brand dark:text-white active:scale-95"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-2xl bg-brand px-6 py-2.5 font-instrument text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
