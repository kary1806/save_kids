import SimplePage from '../components/SimplePage'

export default function ContactUs() {
  return (
    <SimplePage title="Contáctanos">
      <p>¿Tienes preguntas, comentarios o quieres reportar un problema? Escríbenos.</p>
      <p>
        <a href="mailto:hola@safekids.app" className="text-brand underline">
          hola@safekids.app
        </a>
      </p>
    </SimplePage>
  )
}
