import { Component, type ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'

export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error('Unhandled error caught by ErrorBoundary:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-white px-6 text-center">
          <ShieldAlert className="h-12 w-12 text-brand" />
          <p className="font-instrument text-lg font-semibold text-black">
            Algo salió mal cargando la página
          </p>
          <p className="font-instrument text-sm text-black/60">
            Intenta recargar. Si el problema sigue, revisa tu conexión a internet.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-brand px-6 py-2.5 font-instrument font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Recargar
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
