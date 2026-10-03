import { describe, expect, it } from 'vitest'
import { convertMmkToVnd, convertVndToMmk, parseNumber } from './exchange'

// Reference values come from the "MMK to VND Exchange App.xlsx" sheet.
const rates = { mmkPerUsdt: 4480, vndPerUsdt: 26086 }

describe('convertMmkToVnd (sheet: MMK TO VND)', () => {
  it('matches the spreadsheet with no fee', () => {
    const r = convertMmkToVnd(1_000_000, rates, 0)!
    expect(r.usdt).toBeCloseTo(223.21428571428572, 10)
    expect(r.gross).toBeCloseTo(5822767.8571428573, 6)
    expect(r.fee).toBe(0)
    expect(r.net).toBeCloseTo(5822767.8571428573, 6)
  })

  it.each([
    [1.5, 87341.517857142855, 5735426.3392857146],
    [2, 116455.35714285714, 5706312.5],
    [2.5, 145569.19642857145, 5677198.6607142854],
    [3, 174683.03571428571, 5648084.8214285718],
    [5, 291138.3928571429, 5531629.4642857146],
  ])('matches the spreadsheet at %s%% fee', (fee, profit, received) => {
    const r = convertMmkToVnd(1_000_000, rates, fee)!
    expect(r.fee).toBeCloseTo(profit, 6)
    expect(r.net).toBeCloseTo(received, 6)
  })

  it('reports VND per 1 MMK', () => {
    expect(convertMmkToVnd(1, rates)!.rate).toBeCloseTo(26086 / 4480, 12)
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

describe('convertVndToMmk (sheet: VND TO MMK)', () => {
  it('matches the spreadsheet with no fee', () => {
    const r = convertVndToMmk(1_000_000, rates, 0)!
    expect(r.usdt).toBeCloseTo(38.334738940427819, 10)
    expect(r.gross).toBeCloseTo(171739.63045311664, 6)
    expect(r.fee).toBe(0)
    expect(r.net).toBeCloseTo(171739.63045311664, 6)
  })

  it.each([
    [1.5, 2576.0944567967495, 169163.5359963199],
    [2, 3434.7926090623328, 168304.8378440543],
    [2.5, 4293.4907613279165, 167446.13969178873],
    [3, 5152.1889135934989, 166587.44153952313],
    [5, 8586.981522655833, 163152.6489304608],
  ])('matches the spreadsheet at %s%% fee', (fee, profit, received) => {
    const r = convertVndToMmk(1_000_000, rates, fee)!
    expect(r.fee).toBeCloseTo(profit, 6)
    expect(r.net).toBeCloseTo(received, 6)
  })

  it('reports MMK per 1 VND', () => {
    expect(convertVndToMmk(1, rates)!.rate).toBeCloseTo(4480 / 26086, 12)
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
