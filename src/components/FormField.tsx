import type { InputHTMLAttributes } from 'react'
import { INPUT_CLASS } from '../lib/ui'

type Props = InputHTMLAttributes<HTMLInputElement> & { label: string }

export default function FormField({ label, id, ...props }: Props) {
  const fieldId = id ?? props.name
  return (
    <label htmlFor={fieldId} className="flex flex-col gap-1.5 text-left">
      <span className="font-instrument text-sm font-medium text-black">{label}</span>
      <input id={fieldId} {...props} className={INPUT_CLASS} />
    </label>
  )
}
