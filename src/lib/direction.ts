import type { Conversion } from './exchange'
import { formatVnd } from './format'

/** `mmk-vnd`: enter MMK sent. `vnd-mmk`: enter VND the customer should receive. */
export type Direction = 'mmk-vnd' | 'vnd-mmk'

export const isDirection = (v: unknown): v is Direction => v === 'mmk-vnd' || v === 'vnd-mmk'

/** The headline number: VND received (forward) or MMK to send (reverse). */
export function headline(result: Conversion, direction: Direction): { amount: string; currency: 'VND' | 'MMK' } {
  return direction === 'mmk-vnd'
    ? { amount: formatVnd(result.netVnd), currency: 'VND' }
    : // Round up so the customer always sends enough.
      { amount: formatVnd(Math.ceil(result.mmk)), currency: 'MMK' }
}
