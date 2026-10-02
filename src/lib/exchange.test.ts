import { describe, expect, it } from 'vitest'
import { convertMmkToVnd, convertVndToMmk, parseNumber } from './exchange'

// Reference values come from the original "MMK to VND Exchange App.xlsx" sheet.
const rates = { mmkPerUsdt: 4445, vndPerUsdt: 26116 }

describe('convertMmkToVnd', () => {
  it('matches the spreadsheet with no fee', () => {
    const r = convertMmkToVnd(100_000, rates, 0)!
    expect(r.usdt).toBeCloseTo(22.497187851518561, 10)
    expect(r.grossVnd).toBeCloseTo(587536.55793025868, 6)
    expect(r.feeVnd).toBe(0)
    expect(r.netVnd).toBeCloseTo(587536.55793025868, 6)
  })

  it.each([
    [1.5, 8813.0483689538796, 578723.50956130482],
    [2, 11750.731158605175, 575785.82677165349],
    [2.5, 14688.413948256468, 572848.14398200216],
    [3, 17626.096737907759, 569910.46119235095],
  ])('matches the spreadsheet at %s%% fee', (fee, profit, received) => {
    const r = convertMmkToVnd(100_000, rates, fee)!
    expect(r.feeVnd).toBeCloseTo(profit, 6)
    expect(r.netVnd).toBeCloseTo(received, 6)
  })

  it('reports the effective cross rate', () => {
    expect(convertMmkToVnd(1, rates)!.vndPerMmk).toBeCloseTo(26116 / 4445, 12)
  })

  it('rejects invalid input', () => {
    expect(convertMmkToVnd(Number.NaN, rates)).toBeNull()
    expect(convertMmkToVnd(-1, rates)).toBeNull()
    expect(convertMmkToVnd(100, { ...rates, mmkPerUsdt: 0 })).toBeNull()
    expect(convertMmkToVnd(100, { ...rates, vndPerUsdt: Number.NaN })).toBeNull()
    expect(convertMmkToVnd(100, rates, -1)).toBeNull()
    expect(convertMmkToVnd(100, rates, 51)).toBeNull()
  })
})

describe('convertVndToMmk', () => {
  it('is the exact inverse of the forward conversion', () => {
    for (const fee of [0, 1.5, 2, 2.5, 3, 7.25]) {
      const forward = convertMmkToVnd(100_000, rates, fee)!
      const reverse = convertVndToMmk(forward.netVnd, rates, fee)!
      expect(reverse.mmk).toBeCloseTo(100_000, 6)
      expect(reverse.usdt).toBeCloseTo(forward.usdt, 10)
      expect(reverse.grossVnd).toBeCloseTo(forward.grossVnd, 6)
      expect(reverse.feeVnd).toBeCloseTo(forward.feeVnd, 6)
    }
  })

  it('matches the spreadsheet: receiving 575,785.83 VND at 2% costs 100,000 MMK', () => {
    const r = convertVndToMmk(575785.82677165349, rates, 2)!
    expect(r.mmk).toBeCloseTo(100_000, 6)
    expect(r.feeVnd).toBeCloseTo(11750.731158605175, 6)
  })

  it('rejects invalid input', () => {
    expect(convertVndToMmk(Number.NaN, rates)).toBeNull()
    expect(convertVndToMmk(-1, rates)).toBeNull()
    expect(convertVndToMmk(100, { ...rates, vndPerUsdt: 0 })).toBeNull()
    expect(convertVndToMmk(100, rates, 51)).toBeNull()
  })
})

describe('parseNumber', () => {
  it('treats empty and partial input as NaN', () => {
    expect(parseNumber('')).toBeNaN()
    expect(parseNumber('.')).toBeNaN()
  })
  it('parses plain numbers', () => {
    expect(parseNumber('4445.5')).toBe(4445.5)
    expect(parseNumber('12.')).toBe(12)
  })
})
