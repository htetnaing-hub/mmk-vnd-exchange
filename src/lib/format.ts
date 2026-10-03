const cache = new Map<string, Intl.NumberFormat>()

function nf(min: number, max: number): Intl.NumberFormat {
  const key = `${min}:${max}`
  let f = cache.get(key)
  if (!f) {
    f = new Intl.NumberFormat('en-US', { minimumFractionDigits: min, maximumFractionDigits: max })
    cache.set(key, f)
  }
  return f
}

/** Whole units: what people actually hand over (neither MMK nor VND uses minor units day to day). */
export const formatWhole = (n: number) => nf(0, 0).format(Math.round(n))
export const formatAmount = (n: number) => nf(0, 2).format(n)
export const formatUsdt = (n: number) => nf(2, 4).format(n)
export const formatRate = (n: number) => nf(0, 4).format(n)
export const formatPercent = (n: number) => `${nf(0, 2).format(n)}%`

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

/** 100000 → "100K", 1500000 → "1.5M" */
export const formatCompact = (n: number) => compact.format(n)

/**
 * Strip everything except digits and one decimal point, drop redundant leading
 * zeros and cap the fraction length. The result is the "raw" value we store.
 */
export function sanitizeNumberInput(input: string, maxFractionDigits: number): string {
  let s = input.replace(/[^\d.]/g, '')
  const dot = s.indexOf('.')
  if (dot !== -1) {
    s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '')
  }
  const [rawInt, frac] = s.split('.') as [string, string | undefined]
  let int = rawInt.replace(/^0+(?=\d)/, '')
  if (frac === undefined || maxFractionDigits <= 0) return int
  if (int === '') int = '0'
  return `${int}.${frac.slice(0, maxFractionDigits)}`
}

/** Add thousands separators to a raw value, preserving a trailing "." or fraction zeros. */
export function formatRawNumber(raw: string): string {
  if (raw === '') return ''
  const [int, frac] = raw.split('.') as [string, string | undefined]
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return frac === undefined ? grouped : `${grouped}.${frac}`
}
