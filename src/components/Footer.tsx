import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto flex h-[151px] w-full items-center border-t border-hairline dark:border-white/10">
      <div className="mx-auto flex w-full max-w-[1296px] flex-col items-center justify-between gap-4 px-8 md:flex-row">
        <div />
        <div className="flex flex-col items-center gap-4 md:items-end">
          <div className="flex gap-4 text-black dark:text-white">
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="GitHub">⌥</a>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 font-instrument text-sm text-black dark:text-white">
            <Link to="/about" className="transition-colors duration-200 hover:text-brand">
              About us
            </Link>
            <Link to="/contact" className="transition-colors duration-200 hover:text-brand">
              Contact
            </Link>
            <Link to="/privacy" className="transition-colors duration-200 hover:text-brand">
              Privacy policy
            </Link>
            <Link to="/sitemap" className="transition-colors duration-200 hover:text-brand">
              Sitemap
            </Link>
            <Link to="/terms" className="transition-colors duration-200 hover:text-brand">
              Terms of Use
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
