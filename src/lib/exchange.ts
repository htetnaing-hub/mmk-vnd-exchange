/** Binance P2P rates, both quoted as the price of 1 USDT. */
export interface Rates {
  /** How many MMK buys 1 USDT. */
  mmkPerUsdt: number
  /** How many VND 1 USDT sells for. */
  vndPerUsdt: number
}

export interface Conversion {
  mmk: number
  usdt: number
  /** VND before any service fee is taken. */
  grossVnd: number
  feePercent: number
  /** The exchanger's profit, taken from the gross VND. */
  feeVnd: number
  /** What the customer actually receives. */
  netVnd: number
  /** Effective cross rate: VND per 1 MMK. */
  vndPerMmk: number
}

/** Fee tiers offered by default (percent). */
export const FEE_TIERS = [0, 1.5, 2, 2.5, 3] as const

export const MAX_FEE_PERCENT = 50

export function isValidFee(feePercent: number): boolean {
  return Number.isFinite(feePercent) && feePercent >= 0 && feePercent <= MAX_FEE_PERCENT
}

/**
 * MMK → USDT → VND, then deduct the service fee.
 * Returns `null` when any input is missing or out of range.
 */
export function convertMmkToVnd(mmk: number, rates: Rates, feePercent = 0): Conversion | null {
  const { mmkPerUsdt, vndPerUsdt } = rates
  if (!Number.isFinite(mmk) || mmk < 0) return null
  if (!Number.isFinite(mmkPerUsdt) || mmkPerUsdt <= 0) return null
  if (!Number.isFinite(vndPerUsdt) || vndPerUsdt <= 0) return null
  if (!isValidFee(feePercent)) return null

  const usdt = mmk / mmkPerUsdt
  const grossVnd = usdt * vndPerUsdt
  const feeVnd = (feePercent / 100) * grossVnd

  return {
    mmk,
    usdt,
    grossVnd,
    feePercent,
    feeVnd,
    netVnd: grossVnd - feeVnd,
    vndPerMmk: vndPerUsdt / mmkPerUsdt,
  }
}

/** Parse a raw input string (no thousands separators). Empty or partial input yields NaN. */
export function parseNumber(raw: string): number {
  if (raw.trim() === '' || raw === '.') return Number.NaN
  return Number(raw)
}
