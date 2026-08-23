import { Link } from 'react-router-dom'
import { X, HelpCircle, Mail } from 'lucide-react'

const FAQS = [
  {
    question: '¿Cómo reporto una situación?',
    answer: 'Ve a "Reportar Situación" en el menú, elige una o más situaciones y envía el reporte.',
  },
  {
    question: '¿Mis datos personales quedan visibles?',
    answer: 'No. Los reportes son anónimos para el resto de la comunidad.',
  },
  {
    question: '¿Cómo consulto el riesgo de una zona?',
    answer: 'Entra a "Mapa", elige un horario y revisa las condiciones reportadas.',
  },
]

export default function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8 sm:items-center">
      <div className="animate-fade-up relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-brand" />
          <h2 className="font-instrument text-xl font-semibold text-black">Ayuda</h2>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {FAQS.map((faq) => (
            <div key={faq.question} className="rounded-xl bg-brand/5 p-3">
              <p className="font-instrument text-sm font-semibold text-black">{faq.question}</p>
              <p className="mt-1 font-instrument text-sm text-black/60">{faq.answer}</p>
            </div>
          ))}
        </div>

        <Link
          to="/contact"
          onClick={onClose}
          className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-hairline px-6 py-3 font-instrument font-semibold text-black transition-all duration-200 hover:scale-[1.02] hover:border-brand hover:text-brand active:scale-95"
        >
          <Mail className="h-4 w-4" />
          Contactar soporte
        </Link>
      </div>
    </div>
  )
}
