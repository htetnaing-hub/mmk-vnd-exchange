/** Running as an installed home-screen app rather than in a browser tab. */
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari's non-standard flag
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

/** iPhone, iPod or iPad (iPadOS reports itself as a Mac with touch). */
export function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
}
