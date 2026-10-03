/** Binance P2P rates, both quoted as the price of 1 USDT. */
export interface Rates {
  /** How many MMK buys 1 USDT. */
  mmkPerUsdt: number
  /** How many VND 1 USDT sells for. */
  vndPerUsdt: number
}

/**
 * One exchange in either direction: the customer sends one currency, it goes
 * through USDT, and they receive the other currency minus the service fee.
 */
export interface Conversion {
  /** Amount the customer sends. */
  sent: number
  usdt: number
  /** Amount in the target currency before the fee. */
  gross: number
  feePercent: number
  /** The exchanger's profit, in the target currency. */
  fee: number
  /** What the customer actually receives, in the target currency. */
  net: number
  /** Target currency per 1 unit of the sent currency. */
  rate: number
}

/** Fee tiers offered by default (percent), as in the original spreadsheet. */
export const FEE_TIERS = [0, 1.5, 2, 2.5, 3, 5] as const

export const MAX_FEE_PERCENT = 50

export function isValidFee(feePercent: number): boolean {
  return Number.isFinite(feePercent) && feePercent >= 0 && feePercent <= MAX_FEE_PERCENT
}

/**
 * sent → USDT → target, then deduct the service fee from the target amount.
 * Returns `null` when any input is missing or out of range.
 */
function exchange(sent: number, sentPerUsdt: number, targetPerUsdt: number, feePercent: number): Conversion | null {
  if (!Number.isFinite(sent) || sent < 0) return null
  if (!Number.isFinite(sentPerUsdt) || sentPerUsdt <= 0) return null
  if (!Number.isFinite(targetPerUsdt) || targetPerUsdt <= 0) return null
  if (!isValidFee(feePercent)) return null

  const usdt = sent / sentPerUsdt
  const gross = usdt * targetPerUsdt
  const fee = (feePercent / 100) * gross

  return { sent, usdt, gross, feePercent, fee, net: gross - fee, rate: targetPerUsdt / sentPerUsdt }
}

/** Customer sends MMK and receives VND. */
export const convertMmkToVnd = (mmk: number, rates: Rates, feePercent = 0) =>
  exchange(mmk, rates.mmkPerUsdt, rates.vndPerUsdt, feePercent)

/** Customer sends VND and receives MMK. */
export const convertVndToMmk = (vnd: number, rates: Rates, feePercent = 0) =>
  exchange(vnd, rates.vndPerUsdt, rates.mmkPerUsdt, feePercent)

/** Parse a raw input string (no thousands separators). Empty or partial input yields NaN. */
export function parseNumber(raw: string): number {
  if (raw.trim() === '' || raw === '.') return Number.NaN
  return Number(raw)
}
