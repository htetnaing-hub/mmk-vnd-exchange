import { useEffect, useState } from 'react'
import { isStandalone } from '../lib/platform'

export type Theme = 'light' | 'dark'

const KEY = 'mmk-vnd:theme'

function initialTheme(): Theme {
  // index.html sets data-theme before first paint to avoid a flash; trust it.
  const attr = document.documentElement.dataset.theme
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    // In app mode the top bar is always dark (see index.css), so the system bar matches it.
    const color = isStandalone() ? '#0f2a2c' : theme === 'dark' ? '#0b1020' : '#f3f5f8'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* ignore */
    }
  }

  return [theme, toggle]
}
