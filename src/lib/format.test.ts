import { describe, expect, it } from 'vitest'
import { formatRawNumber, formatVnd, sanitizeNumberInput } from './format'

describe('sanitizeNumberInput', () => {
  it('removes separators and junk', () => {
    expect(sanitizeNumberInput('1,234,567', 2)).toBe('1234567')
    expect(sanitizeNumberInput('12a3 ks', 2)).toBe('123')
  })
  it('keeps a single decimal point and caps fraction digits', () => {
    expect(sanitizeNumberInput('1.2.3', 4)).toBe('1.23')
    expect(sanitizeNumberInput('1.23456', 2)).toBe('1.23')
    expect(sanitizeNumberInput('.5', 2)).toBe('0.5')
    expect(sanitizeNumberInput('12.5', 0)).toBe('12')
  })
  it('drops redundant leading zeros', () => {
    expect(sanitizeNumberInput('000123', 2)).toBe('123')
    expect(sanitizeNumberInput('0', 2)).toBe('0')
    expect(sanitizeNumberInput('00.5', 2)).toBe('0.5')
  })
})

describe('formatRawNumber', () => {
  it('groups thousands', () => {
    expect(formatRawNumber('1234567')).toBe('1,234,567')
    expect(formatRawNumber('1234.50')).toBe('1,234.50')
    expect(formatRawNumber('1234.')).toBe('1,234.')
    expect(formatRawNumber('')).toBe('')
  })
})

describe('formatVnd', () => {
  it('rounds to whole dong', () => {
    expect(formatVnd(587536.557)).toBe('587,537')
  })
})
