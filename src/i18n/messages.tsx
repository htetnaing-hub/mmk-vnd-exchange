import type { ReactNode } from 'react'

export type Language = 'en' | 'my'

export const LANGUAGES: Language[] = ['en', 'my']

const en = {
  brandHome: 'MMK to VND Exchange home',
  sourceCode: 'Source code on GitHub',
  toLightTheme: 'Switch to light theme',
  toDarkTheme: 'Switch to dark theme',
  /** Label on the language button: the language you switch TO. */
  otherLanguage: 'မြန်မာ',
  switchLanguage: 'Switch to Burmese',

  eyebrow: 'Binance P2P calculator',
  title: 'Exchange MMK ⇄ VND',
  lead: 'Convert between Myanmar Kyat and Vietnamese Dong through USDT, then compare what your customer receives at each service fee.',

  convert: 'Convert',
  savedOnDevice: 'Values are saved on this device',
  reset: 'Reset',
  direction: 'Conversion direction',

  customerSends: 'Customer sends',
  customerReceives: 'Customer receives',
  quickAmounts: 'Quick amounts',

  ratesTitle: 'Binance P2P rates',
  ratesNote: 'price of 1 USDT',
  mmkRate: 'MMK rate',
  vndRate: 'VND rate',
  mmkRateHint: 'Price of 1 USDT in MMK',
  vndRateHint: 'Price of 1 USDT in VND',
  rateError: 'Rate must be greater than 0',

  serviceFee: 'Service fee',
  noFee: 'No fee',
  custom: 'Custom',
  customFee: 'Custom fee',
  feeRange: (max: number) => `Between 0 and ${max}%`,
  feeError: (max: number) => `Fee must be between 0 and ${max}%`,

  copy: 'Copy',
  copied: 'Copied',
  emptyResult: 'Enter an amount and both rates',
  profitAt: (profit: ReactNode, fee: string): ReactNode => (
    <>
      Your profit {profit} at {fee} fee
    </>
  ),
  noFeeApplied: 'No service fee applied',
  conversionPath: 'Conversion path',
  ratePlaceholder: 'Effective rate appears here',

  feeComparison: 'Fee comparison',
  tapRow: 'Tap a row to apply that fee',
  fee: 'Fee',
  profit: 'Profit',

  details: 'Details',

  disclaimer: 'Rates are entered manually and may differ from live Binance P2P prices. Not financial advice.',
  builtWith: 'Built with React & TypeScript',
  openSource: 'Open source on GitHub',
}

export type Messages = typeof en

const my: Messages = {
  brandHome: 'MMK မှ VND ငွေလဲ ပင်မစာမျက်နှာ',
  sourceCode: 'GitHub ရှိ source code',
  toLightTheme: 'အလင်း theme သို့ ပြောင်းရန်',
  toDarkTheme: 'အမှောင် theme သို့ ပြောင်းရန်',
  otherLanguage: 'EN',
  switchLanguage: 'အင်္ဂလိပ်ဘာသာသို့ ပြောင်းရန်',

  eyebrow: 'Binance P2P ဂဏန်းတွက်စက်',
  title: 'MMK ⇄ VND ငွေလဲရန်',
  lead: 'မြန်မာကျပ်ငွေနှင့် ဗီယက်နမ်ဒေါင်ငွေကို USDT မှတစ်ဆင့် အပြန်အလှန် တွက်ချက်ပြီး ဝန်ဆောင်ခနှုန်းအလိုက် ဖောက်သည်ရရှိမည့်ငွေကို နှိုင်းယှဉ်ကြည့်ပါ။',

  convert: 'တွက်ချက်ရန်',
  savedOnDevice: 'ထည့်ထားသော တန်ဖိုးများကို ဤစက်တွင် သိမ်းထားပါသည်',
  reset: 'ပြန်စရန်',
  direction: 'ငွေလဲမည့် ဦးတည်ချက်',

  customerSends: 'ဖောက်သည် ပေးငွေ',
  customerReceives: 'ဖောက်သည် ရရှိငွေ',
  quickAmounts: 'အမြန်ရွေးရန် ပမာဏများ',

  ratesTitle: 'Binance P2P ဈေးနှုန်းများ',
  ratesNote: '1 USDT ၏ ဈေးနှုန်း',
  mmkRate: 'MMK ဈေးနှုန်း',
  vndRate: 'VND ဈေးနှုန်း',
  mmkRateHint: '1 USDT ၏ MMK ဈေး',
  vndRateHint: '1 USDT ၏ VND ဈေး',
  rateError: 'ဈေးနှုန်းသည် 0 ထက် ကြီးရပါမည်',

  serviceFee: 'ဝန်ဆောင်ခ',
  noFee: 'အခမဲ့',
  custom: 'စိတ်ကြိုက်',
  customFee: 'စိတ်ကြိုက် ဝန်ဆောင်ခ',
  feeRange: (max) => `0 မှ ${max}% အတွင်း`,
  feeError: (max) => `ဝန်ဆောင်ခသည် 0 မှ ${max}% အတွင်း ဖြစ်ရပါမည်`,

  copy: 'ကူးရန်',
  copied: 'ကူးပြီး',
  emptyResult: 'ပမာဏနှင့် ဈေးနှုန်းနှစ်ခုလုံး ထည့်ပါ',
  profitAt: (profit, fee) => (
    <>
      ဝန်ဆောင်ခ {fee} ဖြင့် သင့်အမြတ် {profit}
    </>
  ),
  noFeeApplied: 'ဝန်ဆောင်ခ မယူထားပါ',
  conversionPath: 'ငွေလဲလှယ်မှု အဆင့်များ',
  ratePlaceholder: 'လဲနှုန်းကို ဤနေရာတွင် ပြပါမည်',

  feeComparison: 'ဝန်ဆောင်ခ နှိုင်းယှဉ်ချက်',
  tapRow: 'ဝန်ဆောင်ခ ရွေးရန် အတန်းကို နှိပ်ပါ',
  fee: 'ဝန်ဆောင်ခ',
  profit: 'အမြတ်',

  details: 'အသေးစိတ်',

  disclaimer:
    'ဈေးနှုန်းများကို ကိုယ်တိုင်ထည့်ရသဖြင့် Binance P2P ၏ လက်ရှိဈေးနှင့် ကွာခြားနိုင်ပါသည်။ ငွေကြေးဆိုင်ရာ အကြံပြုချက် မဟုတ်ပါ။',
  builtWith: 'React နှင့် TypeScript ဖြင့် ရေးသားထားသည်',
  openSource: 'GitHub တွင် open source အဖြစ် ကြည့်ရန်',
}

export const MESSAGES: Record<Language, Messages> = { en, my }
