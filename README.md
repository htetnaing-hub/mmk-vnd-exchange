# MMK → VND Exchange

A fast, mobile-friendly calculator that converts **Myanmar Kyat (MMK)** to **Vietnamese Dong (VND)** through **USDT**, using the Binance P2P rates you enter, and shows how much the customer receives at each service-fee tier.

<p>
  <a href="https://htetnaing-hub.github.io/mmk-vnd-exchange/"><img alt="Open live demo" src="https://img.shields.io/badge/Live_demo-Open_app-0f766e?style=for-the-badge"></a>
  <a href="https://github.com/htetnaing-hub/mmk-vnd-exchange/actions/workflows/deploy.yml"><img alt="Deploy status" src="https://github.com/htetnaing-hub/mmk-vnd-exchange/actions/workflows/deploy.yml/badge.svg"></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-blue"></a>
</p>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/screenshot-dark.png">
  <img alt="Screenshot of the MMK to VND Exchange app" src="docs/screenshot-light.png">
</picture>

## How it works

You enter three values. Both rates are the price of **1 USDT**.

| Input | Example |
| --- | --- |
| Amount to send (MMK) | 100,000 |
| Binance MMK rate (1 USDT = ? MMK) | 4,445 |
| Binance VND rate (1 USDT = ? VND) | 26,116 |

```
USDT              = MMK ÷ MMK rate
VND               = USDT × VND rate
Profit            = VND × fee% ÷ 100
Customer receives = VND − Profit
```

With the example values, 100,000 MMK → 22.4972 USDT → **587,537 VND**. At a 2% fee the profit is 11,751 VND and the customer receives 575,786 VND.

**VND → MMK mode** works backwards: enter how much VND the customer should receive, and the app shows how much MMK they need to send (rounded up to the next kyat).

```
VND before fee = VND received ÷ (1 − fee% ÷ 100)
USDT           = VND before fee ÷ VND rate
MMK to send    = USDT × MMK rate
```

## Features

- Two directions: **MMK → VND** and **VND → MMK**
- **English and Burmese (မြန်မာ)** interface, picked from the browser's language on the first visit
- Live conversion with thousands separators as you type
- Quick amount buttons for each direction
- Fee presets (0%, 1.5%, 2%, 2.5%, 3%) plus a custom fee
- Fee comparison table; tap a row to apply that fee
- MMK → USDT → VND breakdown and effective cross rate
- One-tap copy of the result
- Light and dark themes (follows the system setting by default)
- Inputs are remembered on the device (localStorage)
- Responsive layout with a sticky result bar on phones
- Keyboard and screen-reader friendly

## Tech stack

All open source and widely used, chosen for long-term maintenance:

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) for development and builds
- [Vitest](https://vitest.dev) for unit tests
- [ESLint](https://eslint.org) with `typescript-eslint`
- Plain CSS with design tokens (no UI framework to upgrade)
- GitHub Actions + GitHub Pages for free hosting

## Getting started

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run unit tests |
| `npm run lint` | Lint the code |

## Deploy to GitHub Pages

1. Create a new repository on GitHub, e.g. `mmk-vnd-exchange`.
2. Push this project to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/htetnaing-hub/mmk-vnd-exchange.git
   git push -u origin main
   ```
3. On GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` lints, tests, builds and deploys on every push to `main`. Your site appears at `https://htetnaing-hub.github.io/mmk-vnd-exchange/`.

The build uses relative asset paths, so it works under any repository name.

## Customising

- **GitHub link and defaults:** edit [`src/config.ts`](src/config.ts) to set your repository URL, starting values and quick amounts.
- **Fee tiers:** edit `FEE_TIERS` in [`src/lib/exchange.ts`](src/lib/exchange.ts).
- **Translations:** all interface text lives in [`src/i18n/messages.tsx`](src/i18n/messages.tsx). Edit the `my` section to adjust the Burmese wording.
- **Colours:** every colour is a CSS variable at the top of [`src/index.css`](src/index.css), for both light and dark themes.

## Project structure

```
src/
├── App.tsx                 Page layout and state
├── config.ts               Repo URL, default values, quick amounts
├── index.css               Design tokens and styles
├── components/
│   ├── NumberField.tsx     Formatted number input (keeps the caret in place)
│   ├── FeeSelector.tsx     Fee chips + custom fee
│   ├── ResultCard.tsx      Result, breakdown and copy button
│   ├── FeeTable.tsx        Fee tier comparison
│   ├── CurrencyBadge.tsx
│   └── Icons.tsx
├── hooks/
│   ├── usePersistentState.ts
│   ├── useInView.ts
│   └── useTheme.ts
├── i18n/
│   ├── messages.tsx        English and Burmese text
│   ├── context.ts          useI18n() hook
│   └── I18nProvider.tsx    Language state and detection
└── lib/
    ├── exchange.ts         Conversion logic, both directions (pure, unit-tested)
    ├── direction.ts        MMK → VND / VND → MMK helpers
    └── format.ts           Number formatting helpers
```

## Disclaimer

Rates are entered manually and may differ from live Binance P2P prices. This tool is for calculation only and is not financial advice.

## License

[MIT](LICENSE)
