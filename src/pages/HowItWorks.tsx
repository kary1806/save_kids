import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import illustration from '../assets/how-it-works-illustration.jpg'

const STEPS = [
  {
    title: 'Busca una zona',
    description: 'Escribe una dirección o selecciona un punto',
  },
  {
    title: 'Consulta el contexto',
    description: 'Revisa reportes, tipo de situaciones y cuándo fue actualizada la información',
  },
  {
    title: 'Elige un horario',
    description: 'Selecciona mañana, tarde o noche para conocer las condiciones reportadas',
  },
  {
    title: 'Reporta una situación',
    description: 'Indica qué ocurrió, dónde y cuando. El reporte será revisado.',
  },
]

export default function HowItWorks() {
  const [active, setActive] = useState(0)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-[1296px] flex-1 flex-col gap-12 px-8 py-16 md:flex-row md:items-center md:gap-16">
        <div className="flex-1">
          <p className="animate-fade-up font-instrument text-sm font-bold tracking-widest text-brand">
            FÁCIL Y PREVENTIVO
          </p>
          <h1 className="mt-2 animate-fade-up font-instrument text-4xl font-semibold text-black [animation-delay:80ms]">
            ¿Cómo funciona Safe Kids?
          </h1>
          <p className="mt-3 max-w-xl animate-fade-up font-instrument text-black/60 [animation-delay:140ms]">
            Consulta información antes de desplazarte y aporta reportes que ayuden a la
            comunidad.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <button
                key={step.title}
                type="button"
                onClick={() => setActive(i)}
                style={{ animationDelay: `${200 + i * 80}ms` }}
                className={`animate-fade-up rounded-lg border px-6 py-4 text-left font-instrument transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${
                  active === i
                    ? 'border-brand bg-brand/5 shadow-md'
                    : 'border-black/20 bg-white'
                }`}
              >
                <span className="block text-lg font-medium text-black">{step.title}</span>
                <span className="mt-1 block text-black/60">{step.description}</span>
              </button>
            ))}
          </div>
        </div>

        <img
          src={illustration}
          alt="Adolescente consultando el mapa de Safe Kids en Cartagena"
          className="w-full max-w-md animate-fade-up self-center rounded-2xl [animation-delay:120ms] md:max-w-lg"
        />
      </main>

      <Footer />
    </div>
  )
}
