/** Link shown in the header and footer. */
export const REPO_URL = 'https://github.com/htetnaing-hub/mmk-vnd-exchange'

/** Starting values (taken from the original spreadsheet). */
export const DEFAULTS = {
  amount: '1000000',
  vndAmount: '1000000',
  mmkPerUsdt: '4480',
  vndPerUsdt: '26086',
} as const

/** Quick-pick amounts the customer sends in MMK (MMK → VND mode). */
export const QUICK_AMOUNTS = [100_000, 500_000, 1_000_000, 5_000_000, 10_000_000] as const

/** Quick-pick amounts the customer sends in VND (VND → MMK mode). */
export const QUICK_AMOUNTS_VND = [500_000, 1_000_000, 5_000_000, 10_000_000, 20_000_000] as const
