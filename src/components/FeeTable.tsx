import { useI18n } from '../i18n/context'
import { CURRENCIES, type Direction } from '../lib/direction'
import type { Conversion } from '../lib/exchange'
import { formatPercent, formatWhole } from '../lib/format'

interface FeeTableProps {
  rows: Conversion[]
  direction: Direction
  selectedFee: number | null
  onSelect: (feePercent: number) => void
}

/** Side-by-side comparison of every fee tier, like the original spreadsheet. */
export function FeeTable({ rows, direction, selectedFee, onSelect }: FeeTableProps) {
  const { t } = useI18n()
  const { to } = CURRENCIES[direction]

  return (
    <section className="card card--flush" aria-labelledby="fee-table-title">
      <header className="card__header">
        <h2 className="card__title" id="fee-table-title">
          {t.feeComparison}
        </h2>
        <p className="card__subtitle">{t.tapRow}</p>
      </header>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">{t.fee}</th>
              <th scope="col" className="num">
                {t.profit} ({to})
              </th>
              <th scope="col" className="num">
                {t.customerReceives} ({to})
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const selected = r.feePercent === selectedFee
              return (
                <tr
                  key={r.feePercent}
                  className={selected ? 'is-selected' : undefined}
                  onClick={() => onSelect(r.feePercent)}
                >
                  <th scope="row">
                    <button
                      type="button"
                      className="row-btn"
                      aria-pressed={selected}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(r.feePercent)
                      }}
                    >
                      {formatPercent(r.feePercent)}
                    </button>
                  </th>
                  <td className="num muted">{r.feePercent === 0 ? '—' : formatWhole(r.fee)}</td>
                  <td className="num strong">{formatWhole(r.net)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
