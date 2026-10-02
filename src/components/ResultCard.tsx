import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'
import type { Conversion } from '../lib/exchange'
import { formatMmk, formatPercent, formatRate, formatUsdt, formatVnd } from '../lib/format'
import { headline, type Direction } from '../lib/direction'
import { CurrencyBadge } from './CurrencyBadge'
import { ArrowRightIcon, CheckIcon, CopyIcon } from './Icons'

interface ResultCardProps {
  result: Conversion | null
  direction: Direction
}

export function ResultCard({ result, direction }: ResultCardProps) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const main = result && headline(result, direction)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    if (!main) return
    try {
      await navigator.clipboard.writeText(main.amount)
      setCopied(true)
    } catch {
      /* clipboard unavailable (insecure context or denied) */
    }
  }

  return (
    <section className="result" aria-labelledby="result-label">
      <div className="result__top">
        <p className="result__label" id="result-label">
          {direction === 'mmk-vnd' ? t.customerReceives : t.customerSends}
        </p>
        <button type="button" className="icon-btn icon-btn--on-dark" onClick={copy} disabled={!result}>
          {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
          <span>{copied ? t.copied : t.copy}</span>
        </button>
      </div>

      <p className="result__amount" aria-live="polite">
        {main ? (
          <>
            {main.amount}
            <span className="result__currency">{main.currency}</span>
          </>
        ) : (
          <span className="result__empty">{t.emptyResult}</span>
        )}
      </p>

      <p className="result__meta">
        {result && result.feePercent > 0
          ? t.profitAt(<strong>{formatVnd(result.feeVnd)} VND</strong>, formatPercent(result.feePercent))
          : t.noFeeApplied}
      </p>

      <ol className="path" aria-label={t.conversionPath}>
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
            <span className="dot" aria-hidden="true" />1 MMK ≈ {formatRate(result.vndPerMmk)} VND
          </>
        ) : (
          t.ratePlaceholder
        )}
      </p>
    </section>
  )
}
