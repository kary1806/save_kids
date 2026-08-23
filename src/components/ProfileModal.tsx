import { X, Mail, ShieldCheck } from 'lucide-react'

export default function ProfileModal({
  displayName,
  email,
  role,
  onClose,
}: {
  displayName: string
  email: string
  role: string | undefined
  onClose: () => void
}) {
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="fixed inset-0 z-[3000] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8 sm:items-center">
      <div className="animate-fade-up relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 text-black transition-colors duration-200 hover:text-black/60"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand font-instrument text-2xl font-semibold text-white shadow-md">
          {initial}
        </span>

        <h2 className="mt-4 font-instrument text-xl font-semibold text-black">{displayName}</h2>

        {role && (
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 font-instrument text-xs font-medium capitalize text-brand">
            <ShieldCheck className="h-3.5 w-3.5" />
            {role}
          </span>
        )}

        <div className="mt-6 flex items-center gap-2 rounded-xl border border-hairline px-4 py-3 text-left">
          <Mail className="h-4 w-4 flex-shrink-0 text-black/40" />
          <span className="truncate font-instrument text-sm text-black">{email}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-brand px-6 py-3 font-instrument font-semibold text-white shadow-md transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
