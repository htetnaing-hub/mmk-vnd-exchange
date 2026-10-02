import type { Conversion } from '../lib/exchange'
import { formatPercent, formatVnd } from '../lib/format'

interface FeeTableProps {
  rows: Conversion[]
  selectedFee: number | null
  onSelect: (feePercent: number) => void
}

/** Side-by-side comparison of every fee tier, like the original spreadsheet. */
export function FeeTable({ rows, selectedFee, onSelect }: FeeTableProps) {
  return (
    <section className="card card--flush" aria-labelledby="fee-table-title">
      <header className="card__header">
        <h2 className="card__title" id="fee-table-title">
          Fee comparison
        </h2>
        <p className="card__subtitle">Tap a row to apply that fee</p>
      </header>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Fee</th>
              <th scope="col" className="num">
                Profit
              </th>
              <th scope="col" className="num">
                Customer receives
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
                  <td className="num muted">{r.feePercent === 0 ? '—' : formatVnd(r.feeVnd)}</td>
                  <td className="num strong">{formatVnd(r.netVnd)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
