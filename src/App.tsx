import { useRef } from 'react'
import { CurrencyBadge } from './components/CurrencyBadge'
import { FeeSelector, type FeeChoice } from './components/FeeSelector'
import { FeeTable } from './components/FeeTable'
import { GitHubIcon, MoonIcon, ResetIcon, SunIcon } from './components/Icons'
import { NumberField } from './components/NumberField'
import { ResultCard } from './components/ResultCard'
import { DEFAULTS, QUICK_AMOUNTS, REPO_URL } from './config'
import { usePersistentState, isString } from './hooks/usePersistentState'
import { useInView } from './hooks/useInView'
import { useTheme } from './hooks/useTheme'
import { FEE_TIERS, MAX_FEE_PERCENT, convertMmkToVnd, isValidFee, parseNumber, type Rates } from './lib/exchange'
import { formatCompact, formatRate, formatVnd } from './lib/format'

const isFeeChoice = (v: unknown): v is FeeChoice => v === 'custom' || (typeof v === 'number' && isValidFee(v))

function rateError(raw: string): string | undefined {
  return raw !== '' && !(parseNumber(raw) > 0) ? 'Rate must be greater than 0' : undefined
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const resultRef = useRef<HTMLDivElement>(null)
  const resultInView = useInView(resultRef)
  const [amount, setAmount] = usePersistentState('amount', DEFAULTS.amount, isString)
  const [mmkRate, setMmkRate] = usePersistentState('mmkPerUsdt', DEFAULTS.mmkPerUsdt, isString)
  const [vndRate, setVndRate] = usePersistentState('vndPerUsdt', DEFAULTS.vndPerUsdt, isString)
  const [fee, setFee] = usePersistentState<FeeChoice>('fee', 0, isFeeChoice)
  const [customFee, setCustomFee] = usePersistentState('customFee', '1', isString)

  const rates: Rates = { mmkPerUsdt: parseNumber(mmkRate), vndPerUsdt: parseNumber(vndRate) }
  const mmk = parseNumber(amount)
  const customFeeValue = parseNumber(customFee)
  const feePercent = fee === 'custom' ? customFeeValue : fee
  const customFeeError =
    fee === 'custom' && customFee !== '' && !isValidFee(customFeeValue)
      ? `Fee must be between 0 and ${MAX_FEE_PERCENT}%`
      : undefined

  const result = convertMmkToVnd(mmk, rates, feePercent)

  const tierFees: number[] = [...FEE_TIERS]
  if (fee === 'custom' && isValidFee(customFeeValue) && !tierFees.includes(customFeeValue)) {
    tierFees.push(customFeeValue)
    tierFees.sort((a, b) => a - b)
  }
  const tierRows = tierFees.map((f) => convertMmkToVnd(mmk, rates, f)).filter((r) => r !== null)

  function selectFee(f: number) {
    if ((FEE_TIERS as readonly number[]).includes(f)) setFee(f)
    else setFee('custom')
  }

  function reset() {
    setAmount(DEFAULTS.amount)
    setMmkRate(DEFAULTS.mmkPerUsdt)
    setVndRate(DEFAULTS.vndPerUsdt)
    setFee(0)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar__inner">
          <a className="brand" href="./" aria-label="MMK to VND Exchange home">
            <span className="brand__mark" aria-hidden="true">
              <span>K</span>
              <span>₫</span>
            </span>
            <span className="brand__name">
              Kyat<span className="brand__arrow">→</span>Dong
            </span>
          </a>
          <div className="topbar__actions">
            <a className="icon-btn" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="Source code on GitHub">
              <GitHubIcon />
            </a>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="container main">
        <div className="intro">
          <p className="eyebrow">Binance P2P calculator</p>
          <h1 className="title">Exchange MMK to VND</h1>
          <p className="lead">
            Convert Myanmar Kyat to Vietnamese Dong through USDT, then compare what your customer receives at each
            service fee.
          </p>
        </div>

        <div className="grid">
          <section className="card" aria-labelledby="inputs-title">
            <header className="card__header card__header--row">
              <div>
                <h2 className="card__title" id="inputs-title">
                  Convert
                </h2>
                <p className="card__subtitle">Values are saved on this device</p>
              </div>
              <button type="button" className="text-btn" onClick={reset}>
                <ResetIcon width={15} height={15} />
                Reset
              </button>
            </header>

            <div className="card__body">
              <NumberField
                id="amount"
                label="You send"
                size="lg"
                value={amount}
                onValueChange={setAmount}
                unit={<CurrencyBadge currency="MMK" />}
                maxFractionDigits={2}
              >
                <div className="quick" role="group" aria-label="Quick amounts">
                  {QUICK_AMOUNTS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="quick__btn"
                      aria-pressed={mmk === q}
                      onClick={() => setAmount(String(q))}
                    >
                      {formatCompact(q)}
                    </button>
                  ))}
                </div>
              </NumberField>

              <div className="section-label">
                <span>Binance P2P rates</span>
                <span className="section-label__note">price of 1 USDT</span>
              </div>

              <div className="row-2">
                <NumberField
                  id="mmk-rate"
                  label="MMK rate"
                  value={mmkRate}
                  onValueChange={setMmkRate}
                  unit={<CurrencyBadge currency="MMK" showCode={false} />}
                  maxFractionDigits={4}
                  error={rateError(mmkRate)}
                  hint={rates.mmkPerUsdt > 0 ? `1 USDT = ${formatRate(rates.mmkPerUsdt)} MMK` : 'Buy USDT with MMK'}
                />
                <NumberField
                  id="vnd-rate"
                  label="VND rate"
                  value={vndRate}
                  onValueChange={setVndRate}
                  unit={<CurrencyBadge currency="VND" showCode={false} />}
                  maxFractionDigits={4}
                  error={rateError(vndRate)}
                  hint={rates.vndPerUsdt > 0 ? `1 USDT = ${formatRate(rates.vndPerUsdt)} VND` : 'Sell USDT for VND'}
                />
              </div>

              <FeeSelector
                value={fee}
                onChange={setFee}
                customRaw={customFee}
                onCustomChange={setCustomFee}
                customError={customFeeError}
              />
            </div>
          </section>

          <div className="stack">
            <div ref={resultRef} id="result">
              <ResultCard result={result} />
            </div>
            {tierRows.length > 0 && (
              <FeeTable rows={tierRows} selectedFee={result ? result.feePercent : null} onSelect={selectFee} />
            )}
          </div>
        </div>
      </main>

      {/* Phone-only summary that appears while the result card is scrolled out of view. */}
      <div className="mobile-bar" data-visible={result !== null && !resultInView} aria-hidden={resultInView}>
        <div>
          <p className="mobile-bar__label">Customer receives</p>
          <p className="mobile-bar__value">{result ? `${formatVnd(result.netVnd)} VND` : '—'}</p>
        </div>
        <button
          type="button"
          className="mobile-bar__btn"
          tabIndex={resultInView ? -1 : 0}
          onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        >
          Details
        </button>
      </div>

      <footer className="footer">
        <div className="container footer__inner">
          <p>Rates are entered manually and may differ from live Binance P2P prices. Not financial advice.</p>
          <p>
            Built with React &amp; TypeScript ·{' '}
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              Open source on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
