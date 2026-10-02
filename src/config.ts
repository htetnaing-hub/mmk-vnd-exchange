/** Link shown in the header and footer. Set this to your repository after pushing. */
export const REPO_URL = 'https://github.com/htetnaing-hub/mmk-vnd-exchange'

/** Starting values (taken from the original spreadsheet). */
export const DEFAULTS = {
  amount: '100000',
  mmkPerUsdt: '4445',
  vndPerUsdt: '26116',
} as const

export const QUICK_AMOUNTS = [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000] as const
