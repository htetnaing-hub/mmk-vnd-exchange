import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'
import { CURRENCIES, RATE_UNIT, type Direction } from '../lib/direction'
import type { Conversion } from '../lib/exchange'
import { formatAmount, formatPercent, formatRate, formatUsdt, formatWhole } from '../lib/format'
import { CurrencyBadge } from './CurrencyBadge'
import { ArrowRightIcon, CheckIcon, CopyIcon } from './Icons'

interface ResultCardProps {
  result: Conversion | null
  direction: Direction
}

export function ResultCard({ result, direction }: ResultCardProps) {
  const { t } = useI18n()
  const { from, to } = CURRENCIES[direction]
  const unit = RATE_UNIT[from]
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(formatWhole(result.net))
      setCopied(true)
    } catch {
      /* clipboard unavailable (insecure context or denied) */
    }
  }

  return (
    <section className="result" aria-labelledby="result-label">
      <div className="result__top">
        <p className="result__label" id="result-label">
          {t.customerReceives}
        </p>
        <button type="button" className="icon-btn icon-btn--on-dark" onClick={copy} disabled={!result}>
          {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
          <span>{copied ? t.copied : t.copy}</span>
        </button>
      </div>

      <p className="result__amount" aria-live="polite">
        {result ? (
          <>
            {formatWhole(result.net)}
            <span className="result__currency">{to}</span>
          </>
        ) : (
          <span className="result__empty">{t.emptyResult}</span>
        )}
      </p>

      <p className="result__meta">
        {result && result.feePercent > 0
          ? t.profitAt(
              <strong>
                {formatWhole(result.fee)} {to}
              </strong>,
              formatPercent(result.feePercent),
            )
          : t.noFeeApplied}
      </p>

      <ol className="path" aria-label={t.conversionPath}>
        <li className="path__step">
          <CurrencyBadge currency={from} />
          <span className="path__value">{result ? formatAmount(result.sent) : '—'}</span>
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
          <CurrencyBadge currency={to} />
          <span className="path__value">{result ? formatWhole(result.gross) : '—'}</span>
        </li>
      </ol>

      <p className="result__rate">
        {result ? (
          <>
            {formatWhole(unit)} {from} ≈{' '}
            <strong>
              {formatAmount(result.rate * unit)} {to}
            </strong>
            <span className="dot" aria-hidden="true" />1 {from} ≈ {formatRate(result.rate)} {to}
          </>
        ) : (
          t.ratePlaceholder
        )}
      </p>
    </section>
  )
}
