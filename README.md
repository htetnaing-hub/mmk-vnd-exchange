# MMK → VND Exchange

A fast, mobile-friendly calculator that converts **Myanmar Kyat (MMK)** to **Vietnamese Dong (VND)** through **USDT**, using the Binance P2P rates you enter, and shows how much the customer receives at each service-fee tier.

**Live demo:** `https://htetnaing-hub.github.io/mmk-vnd-exchange/`

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

## Features

- Live conversion with thousands separators as you type
- Quick amount buttons (100K, 500K, 1M, 5M, 10M)
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
└── lib/
    ├── exchange.ts         Conversion logic (pure, unit-tested)
    └── format.ts           Number formatting helpers
```

## Disclaimer

Rates are entered manually and may differ from live Binance P2P prices. This tool is for calculation only and is not financial advice.

## License

[MIT](LICENSE)
