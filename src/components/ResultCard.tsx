import { useEffect, useState } from 'react'
import type { Conversion } from '../lib/exchange'
import { formatMmk, formatPercent, formatRate, formatUsdt, formatVnd } from '../lib/format'
import { CurrencyBadge } from './CurrencyBadge'
import { ArrowRightIcon, CheckIcon, CopyIcon } from './Icons'

interface ResultCardProps {
  result: Conversion | null
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(formatVnd(result.netVnd))
      setCopied(true)
    } catch {
      /* clipboard unavailable (insecure context or denied) */
    }
  }

  return (
    <section className="result" aria-labelledby="result-label">
      <div className="result__top">
        <p className="result__label" id="result-label">
          Customer receives
        </p>
        <button type="button" className="icon-btn icon-btn--on-dark" onClick={copy} disabled={!result}>
          {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <p className="result__amount" aria-live="polite">
        {result ? (
          <>
            {formatVnd(result.netVnd)}
            <span className="result__currency">VND</span>
          </>
        ) : (
          <span className="result__empty">Enter an amount and both rates</span>
        )}
      </p>

      <p className="result__meta">
        {result && result.feePercent > 0 ? (
          <>
            Your profit <strong>{formatVnd(result.feeVnd)} VND</strong> at {formatPercent(result.feePercent)} fee
          </>
        ) : (
          'No service fee applied'
        )}
      </p>

      <ol className="path" aria-label="Conversion path">
        <li className="path__step">
          <CurrencyBadge currency="MMK" />
          <span className="path__value">{result ? formatMmk(result.mmk) : '—'}</span>
        </li>
        <li className="path__arrow" aria-hidden="true">
          <ArrowRightIcon width={16} height={16} />
        </li>
        <li className="path__step">
          <CurrencyBadge currency="USDT" />
          <span className="path__value">{result ? formatUsdt(result.usdt) : '—'}</span>
        </li>
        <li className="path__arrow" aria-hidden="true">
          <ArrowRightIcon width={16} height={16} />
        </li>
        <li className="path__step">
          <CurrencyBadge currency="VND" />
          <span className="path__value">{result ? formatVnd(result.grossVnd) : '—'}</span>
        </li>
      </ol>

      <p className="result__rate">
        {result ? (
          <>
            1,000 MMK ≈ <strong>{formatMmk(result.vndPerMmk * 1000)} VND</strong>
            <span className="dot" aria-hidden="true" />
            1 MMK ≈ {formatRate(result.vndPerMmk)} VND
          </>
        ) : (
          'Effective rate appears here'
        )}
      </p>
    </section>
  )
}
