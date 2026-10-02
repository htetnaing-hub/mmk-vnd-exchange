export type Currency = 'MMK' | 'USDT' | 'VND'

const SYMBOL: Record<Currency, string> = { MMK: 'K', USDT: '₮', VND: '₫' }

export function CurrencyBadge({ currency, showCode = true }: { currency: Currency; showCode?: boolean }) {
  return (
    <span className="badge" data-currency={currency}>
      <span className="badge__symbol" aria-hidden="true">
        {SYMBOL[currency]}
      </span>
      {showCode && <span className="badge__code">{currency}</span>}
    </span>
  )
}
