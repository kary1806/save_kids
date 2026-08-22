import { useState, type InputHTMLAttributes } from 'react'
import { INPUT_CLASS } from '../lib/ui'

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string }

export default function PasswordField({ label, id, ...props }: Props) {
  const [visible, setVisible] = useState(false)
  const fieldId = id ?? props.name

  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1.5 text-left">
      <span className="font-instrument text-sm font-medium text-black">{label}</span>
      <div className="relative">
        <input
          id={fieldId}
          {...props}
          type={visible ? 'text' : 'password'}
          className={`${INPUT_CLASS} w-full pr-11`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          className="absolute inset-y-0 right-3 flex items-center text-black/50 transition-colors duration-200 hover:text-black"
        >
          {visible ? '🙈' : '👁️'}
        </button>
      </div>
    </label>
  )
}
