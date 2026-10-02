import { useLayoutEffect, useRef, type ChangeEvent, type ReactNode } from 'react'
import { formatRawNumber, sanitizeNumberInput } from '../lib/format'

interface NumberFieldProps {
  id: string
  label: ReactNode
  /** Raw value without separators, e.g. "100000.5". */
  value: string
  onValueChange: (raw: string) => void
  /** Currency badge shown inside the field. */
  unit?: ReactNode
  hint?: ReactNode
  error?: string
  maxFractionDigits?: number
  size?: 'md' | 'lg'
  placeholder?: string
  autoFocus?: boolean
  children?: ReactNode
}

const isSignificant = (ch: string) => (ch >= '0' && ch <= '9') || ch === '.'

/**
 * Text input that shows thousands separators while typing and keeps the caret
 * in the right place as commas appear and disappear.
 */
export function NumberField({
  id,
  label,
  value,
  onValueChange,
  unit,
  hint,
  error,
  maxFractionDigits = 2,
  size = 'md',
  placeholder = '0',
  autoFocus,
  children,
}: NumberFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  // Number of digits/dots that should sit left of the caret after re-render.
  const pendingCaret = useRef<number | null>(null)
  const display = formatRawNumber(value)

  useLayoutEffect(() => {
    const el = inputRef.current
    const target = pendingCaret.current
    pendingCaret.current = null
    if (!el || target === null || document.activeElement !== el) return
    let pos = 0
    for (let seen = 0; pos < display.length && seen < target; pos++) {
      if (isSignificant(display[pos])) seen++
    }
    el.setSelectionRange(pos, pos)
  })

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const typed = e.target.value
    const caret = e.target.selectionStart ?? typed.length
    pendingCaret.current = [...typed.slice(0, caret)].filter(isSignificant).length
    onValueChange(sanitizeNumberInput(typed, maxFractionDigits))
  }

  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ')

  return (
    <div className={`field field--${size}`} data-invalid={error ? '' : undefined}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="field__control">
        <input
          ref={inputRef}
          id={id}
          className="field__input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          autoFocus={autoFocus}
          value={display}
          onChange={handleChange}
          onFocus={(e) => e.currentTarget.select()}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
        />
        {unit && <span className="field__unit">{unit}</span>}
      </div>
      {error ? (
        <p className="field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p className="field__hint" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
      {children}
    </div>
  )
}
