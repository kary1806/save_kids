import { useState } from 'react'
import slideMap from '../assets/hero-illustration.jpg'
import slideSearch from '../assets/carousel-search.jpg'
import slideTablet from '../assets/carousel-tablet.jpg'
import slideSchedule from '../assets/carousel-schedule.jpg'
import slideReport from '../assets/carousel-report.jpg'

const SLIDES = [
  { src: slideMap, alt: 'Adolescentes revisando su ruta en el mapa' },
  { src: slideSearch, alt: 'Adolescente buscando una zona segura' },
  { src: slideTablet, alt: 'Adolescente consultando el contexto de su ruta' },
  { src: slideSchedule, alt: 'Adolescente eligiendo un horario para desplazarse' },
  { src: slideReport, alt: 'Adolescente reportando una situación' },
]

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)

  function go(delta: number) {
    setIndex((i) => (i + delta + SLIDES.length) % SLIDES.length)
  }

  return (
    <div className="group w-full max-w-[602px] animate-fade-up">
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-lg">
        {SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Anterior"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black opacity-0 shadow transition-all duration-200 hover:scale-110 group-hover:opacity-100"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Siguiente"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-black opacity-0 shadow transition-all duration-200 hover:scale-110 group-hover:opacity-100"
        >
          ›
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === index ? 'w-6 bg-brand' : 'w-2 bg-divider hover:bg-brand/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
