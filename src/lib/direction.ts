/** `mmk-vnd`: customer sends MMK, receives VND. `vnd-mmk`: customer sends VND, receives MMK. */
export type Direction = 'mmk-vnd' | 'vnd-mmk'

export type Fiat = 'MMK' | 'VND'

export const isDirection = (v: unknown): v is Direction => v === 'mmk-vnd' || v === 'vnd-mmk'

export const CURRENCIES: Record<Direction, { from: Fiat; to: Fiat }> = {
  'mmk-vnd': { from: 'MMK', to: 'VND' },
  'vnd-mmk': { from: 'VND', to: 'MMK' },
}

/** A round amount of the sent currency for the "≈" rate line, e.g. 1,000 MMK or 10,000 VND. */
export const RATE_UNIT: Record<Fiat, number> = { MMK: 1_000, VND: 10_000 }
