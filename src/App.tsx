import { useRef } from 'react'
import { CurrencyBadge } from './components/CurrencyBadge'
import { FeeSelector, type FeeChoice } from './components/FeeSelector'
import { FeeTable } from './components/FeeTable'
import { GitHubIcon, MoonIcon, ResetIcon, SunIcon } from './components/Icons'
import { NumberField } from './components/NumberField'
import { ResultCard } from './components/ResultCard'
import { DEFAULTS, QUICK_AMOUNTS, QUICK_AMOUNTS_VND, REPO_URL } from './config'
import { usePersistentState, isString } from './hooks/usePersistentState'
import { useInView } from './hooks/useInView'
import { useTheme } from './hooks/useTheme'
import { useI18n } from './i18n/context'
import { headline, isDirection, type Direction } from './lib/direction'
import {
  FEE_TIERS,
  MAX_FEE_PERCENT,
  convertMmkToVnd,
  convertVndToMmk,
  isValidFee,
  parseNumber,
  type Rates,
} from './lib/exchange'
import { formatCompact, formatRate } from './lib/format'

const isFeeChoice = (v: unknown): v is FeeChoice => v === 'custom' || (typeof v === 'number' && isValidFee(v))

const DIRECTIONS: { value: Direction; from: 'MMK' | 'VND'; to: 'MMK' | 'VND' }[] = [
  { value: 'mmk-vnd', from: 'MMK', to: 'VND' },
  { value: 'vnd-mmk', from: 'VND', to: 'MMK' },
]

export default function App() {
  const { lang, t, setLang } = useI18n()
  const [theme, toggleTheme] = useTheme()
  const resultRef = useRef<HTMLDivElement>(null)
  const resultInView = useInView(resultRef)
  const [direction, setDirection] = usePersistentState<Direction>('direction', 'mmk-vnd', isDirection)
  const [amount, setAmount] = usePersistentState('amount', DEFAULTS.amount, isString)
  const [vndAmount, setVndAmount] = usePersistentState('vndAmount', DEFAULTS.vndAmount, isString)
  const [mmkRate, setMmkRate] = usePersistentState('mmkPerUsdt', DEFAULTS.mmkPerUsdt, isString)
  const [vndRate, setVndRate] = usePersistentState('vndPerUsdt', DEFAULTS.vndPerUsdt, isString)
  const [fee, setFee] = usePersistentState<FeeChoice>('fee', 0, isFeeChoice)
  const [customFee, setCustomFee] = usePersistentState('customFee', '1', isString)

  const forward = direction === 'mmk-vnd'
  const input = forward
    ? { raw: amount, set: setAmount, currency: 'MMK' as const, quick: QUICK_AMOUNTS, convert: convertMmkToVnd }
    : { raw: vndAmount, set: setVndAmount, currency: 'VND' as const, quick: QUICK_AMOUNTS_VND, convert: convertVndToMmk }
  const inputValue = parseNumber(input.raw)

  const rates: Rates = { mmkPerUsdt: parseNumber(mmkRate), vndPerUsdt: parseNumber(vndRate) }
  const customFeeValue = parseNumber(customFee)
  const feePercent = fee === 'custom' ? customFeeValue : fee
  const customFeeError =
    fee === 'custom' && customFee !== '' && !isValidFee(customFeeValue) ? t.feeError(MAX_FEE_PERCENT) : undefined
  const rateError = (raw: string) => (raw !== '' && !(parseNumber(raw) > 0) ? t.rateError : undefined)

  const result = input.convert(inputValue, rates, feePercent)
  const main = result && headline(result, direction)

  const tierFees: number[] = [...FEE_TIERS]
  if (fee === 'custom' && isValidFee(customFeeValue) && !tierFees.includes(customFeeValue)) {
    tierFees.push(customFeeValue)
    tierFees.sort((a, b) => a - b)
  }
  const tierRows = tierFees.map((f) => input.convert(inputValue, rates, f)).filter((r) => r !== null)

  function selectFee(f: number) {
    if ((FEE_TIERS as readonly number[]).includes(f)) setFee(f)
    else setFee('custom')
  }

  function reset() {
    setAmount(DEFAULTS.amount)
    setVndAmount(DEFAULTS.vndAmount)
    setMmkRate(DEFAULTS.mmkPerUsdt)
    setVndRate(DEFAULTS.vndPerUsdt)
    setFee(0)
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar__inner">
          <a className="brand" href="./" aria-label={t.brandHome}>
            <span className="brand__mark" aria-hidden="true">
              <span>K</span>
              <span>₫</span>
            </span>
            <span className="brand__name">
              Kyat<span className="brand__arrow">→</span>Dong
            </span>
          </a>
          <div className="topbar__actions">
            <button
              type="button"
              className="icon-btn lang-btn"
              onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
              aria-label={t.switchLanguage}
              title={t.switchLanguage}
              lang={lang === 'en' ? 'my' : 'en'}
            >
              {t.otherLanguage}
            </button>
            <a className="icon-btn" href={REPO_URL} target="_blank" rel="noreferrer" aria-label={t.sourceCode}>
              <GitHubIcon />
            </a>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.toLightTheme : t.toDarkTheme}
              title={theme === 'dark' ? t.toLightTheme : t.toDarkTheme}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </header>

      <main className="container main">
        <div className="intro">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="title">{t.title}</h1>
          <p className="lead">{t.lead}</p>
        </div>

        <div className="grid">
          <section className="card" aria-labelledby="inputs-title">
            <header className="card__header card__header--row">
              <div>
                <h2 className="card__title" id="inputs-title">
                  {t.convert}
                </h2>
                <p className="card__subtitle">{t.savedOnDevice}</p>
              </div>
              <button type="button" className="text-btn" onClick={reset}>
                <ResetIcon width={15} height={15} />
                {t.reset}
              </button>
            </header>

            <div className="card__body">
              <div className="segmented" role="group" aria-label={t.direction}>
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    className="segmented__btn"
                    aria-pressed={direction === d.value}
                    onClick={() => setDirection(d.value)}
                  >
                    <CurrencyBadge currency={d.from} showCode={false} />
                    {d.from}
                    <span aria-hidden="true">→</span>
                    {d.to}
                  </button>
                ))}
              </div>

              <NumberField
                id="amount"
                key={direction}
                label={forward ? t.customerSends : t.customerReceives}
                size="lg"
                value={input.raw}
                onValueChange={input.set}
                unit={<CurrencyBadge currency={input.currency} />}
                maxFractionDigits={2}
              >
                <div className="quick" role="group" aria-label={t.quickAmounts}>
                  {input.quick.map((q) => (
                    <button
                      key={q}
                      type="button"
                      className="quick__btn"
                      aria-pressed={inputValue === q}
                      onClick={() => input.set(String(q))}
                    >
                      {formatCompact(q)}
                    </button>
                  ))}
                </div>
              </NumberField>

              <div className="section-label">
                <span>{t.ratesTitle}</span>
                <span className="section-label__note">{t.ratesNote}</span>
              </div>

              <div className="row-2">
                <NumberField
                  id="mmk-rate"
                  label={t.mmkRate}
                  value={mmkRate}
                  onValueChange={setMmkRate}
                  unit={<CurrencyBadge currency="MMK" showCode={false} />}
                  maxFractionDigits={4}
                  error={rateError(mmkRate)}
                  hint={rates.mmkPerUsdt > 0 ? `1 USDT = ${formatRate(rates.mmkPerUsdt)} MMK` : t.mmkRateHint}
                />
                <NumberField
                  id="vnd-rate"
                  label={t.vndRate}
                  value={vndRate}
                  onValueChange={setVndRate}
                  unit={<CurrencyBadge currency="VND" showCode={false} />}
                  maxFractionDigits={4}
                  error={rateError(vndRate)}
                  hint={rates.vndPerUsdt > 0 ? `1 USDT = ${formatRate(rates.vndPerUsdt)} VND` : t.vndRateHint}
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
              <ResultCard result={result} direction={direction} />
            </div>
            {tierRows.length > 0 && (
              <FeeTable
                rows={tierRows}
                direction={direction}
                selectedFee={result ? result.feePercent : null}
                onSelect={selectFee}
              />
            )}
          </div>
        </div>
      </main>

      {/* Phone-only summary that appears while the result card is scrolled out of view. */}
      <div className="mobile-bar" data-visible={result !== null && !resultInView} aria-hidden={resultInView}>
        <div>
          <p className="mobile-bar__label">{forward ? t.customerReceives : t.customerSends}</p>
          <p className="mobile-bar__value">{main ? `${main.amount} ${main.currency}` : '—'}</p>
        </div>
        <button
          type="button"
          className="mobile-bar__btn"
          tabIndex={resultInView ? -1 : 0}
          onClick={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        >
          {t.details}
        </button>
      </div>

      <footer className="footer">
        <div className="container footer__inner">
          <p>{t.disclaimer}</p>
          <p>
            {t.builtWith} ·{' '}
            <a href={REPO_URL} target="_blank" rel="noreferrer">
              {t.openSource}
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
