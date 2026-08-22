import { Link } from 'react-router-dom'
import SimplePage from '../components/SimplePage'

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/how-it-works', label: 'Cómo funciona Safe Kids' },
  { to: '/login', label: 'Iniciar sesión' },
  { to: '/signup', label: 'Crear cuenta' },
  { to: '/home', label: 'Mi cuenta' },
  { to: '/about', label: 'Sobre nosotros' },
  { to: '/contact', label: 'Contáctanos' },
  { to: '/privacy', label: 'Política de privacidad' },
  { to: '/terms', label: 'Términos de uso' },
  { to: '/sitemap', label: 'Sitemap' },
]

export default function Sitemap() {
  return (
    <SimplePage title="Sitemap">
      <p>Esto es lo que tenemos construido por ahora:</p>
      <ul className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-brand underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </SimplePage>
  )
}
