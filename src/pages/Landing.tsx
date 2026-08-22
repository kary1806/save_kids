import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import heroIllustration from '../assets/hero-illustration.jpg'
import iconTeens from '../assets/icon-teens.svg'
import iconParent from '../assets/icon-parent.svg'
import iconRocket from '../assets/icon-rocket.svg'

const options = [
  { label: 'Soy adolescente', icon: iconTeens, to: '/signup?role=adolescente' },
  { label: 'Soy acudiente', icon: iconParent, to: '/signup?role=acudiente' },
  { label: 'Ya tengo cuenta', icon: iconRocket, to: '/login' },
]

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1296px] flex-1 flex-col items-center gap-12 px-8 py-16 md:flex-row md:justify-center md:gap-24">
        <img
          src={heroIllustration}
          alt="Adolescentes usando Safe Kids para ubicarse en su ciudad"
          className="h-auto w-full max-w-[602px] animate-fade-up rounded-lg border-l transition-transform duration-500 hover:-rotate-1 hover:scale-[1.02] md:border-hairline object-cover md:border-r md:pr-12"
        />

        <div className="flex flex-col items-center gap-8 text-center md:items-start md:text-left">
          <div className="animate-fade-up [animation-delay:150ms]">
            <h1 className="font-instrument text-5xl font-semibold tracking-wide text-black">
              HOLA!
            </h1>
            <p className="mt-2 font-cormorant text-3xl text-black">
              ¿Cómo utilizarás Safe Kids?
            </p>
          </div>

          <nav className="flex flex-col gap-6">
            {options.map((option, i) => (
              <Link
                key={option.to}
                to={option.to}
                style={{ animationDelay: `${250 + i * 100}ms` }}
                className="group flex animate-fade-up items-center gap-4 font-instrument text-2xl text-black transition-colors duration-200 hover:text-brand"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  {option.label}
                </span>
                <img
                  src={option.icon}
                  alt=""
                  className="h-9 w-9 transition-transform duration-200 group-hover:scale-125 group-hover:animate-wiggle-hover"
                />
              </Link>
            ))}
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  )
}
