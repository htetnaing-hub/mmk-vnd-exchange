import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

const PREFIX = 'mmk-vnd:'

/**
 * `useState` that survives page reloads via localStorage. Storage failures
 * (private mode, blocked site data) silently fall back to in-memory state.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  isValid: (value: unknown) => value is T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(PREFIX + key)
      if (stored !== null) {
        const parsed: unknown = JSON.parse(stored)
        if (isValid(parsed)) return parsed
      }
    } catch {
      /* ignore */
    }
    return initial
  })

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch {
      /* ignore */
    }
  }, [key, value])

  return [value, setValue]
}

export const isString = (v: unknown): v is string => typeof v === 'string'
