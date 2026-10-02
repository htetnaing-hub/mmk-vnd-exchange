import { useRef, useState, type KeyboardEvent } from 'react'
import { FEE_TIERS, MAX_FEE_PERCENT } from '../lib/exchange'
import { formatPercent } from '../lib/format'
import { NumberField } from './NumberField'

export type FeeChoice = number | 'custom'

interface FeeSelectorProps {
  value: FeeChoice
  onChange: (value: FeeChoice) => void
  customRaw: string
  onCustomChange: (raw: string) => void
  customError?: string
}

const OPTIONS: FeeChoice[] = [...FEE_TIERS, 'custom']

const optionLabel = (o: FeeChoice) => (o === 'custom' ? 'Custom' : o === 0 ? 'No fee' : formatPercent(o))

/** Radio group of fee chips with roving focus (arrow keys), plus a custom % field. */
export function FeeSelector({ value, onChange, customRaw, onCustomChange, customError }: FeeSelectorProps) {
  const groupRef = useRef<HTMLDivElement>(null)
  // Focus the custom input only when the user picks "Custom" by clicking, not on page load.
  const [focusCustom, setFocusCustom] = useState(false)
  const selectedIndex = Math.max(0, OPTIONS.indexOf(value))

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
    if (!delta) return
    e.preventDefault()
    const next = (selectedIndex + delta + OPTIONS.length) % OPTIONS.length
    setFocusCustom(false)
    onChange(OPTIONS[next])
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus()
  }

  return (
    <fieldset className="fee">
      <legend className="field__label">Service fee</legend>
      <div ref={groupRef} className="chips" role="radiogroup" aria-label="Service fee" onKeyDown={handleKeyDown}>
        {OPTIONS.map((o, i) => {
          const checked = i === selectedIndex
          return (
            <button
              key={String(o)}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              className="chip"
              onClick={() => {
                setFocusCustom(o === 'custom')
                onChange(o)
              }}
            >
              {optionLabel(o)}
            </button>
          )
        })}
      </div>
      {value === 'custom' && (
        <NumberField
          id="custom-fee"
          label="Custom fee"
          value={customRaw}
          onValueChange={onCustomChange}
          unit="%"
          maxFractionDigits={2}
          autoFocus={focusCustom}
          error={customError}
          hint={`Between 0 and ${MAX_FEE_PERCENT}%`}
        />
      )}
    </fieldset>
  )
}
