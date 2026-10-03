import { defineConfig } from '@vite-pwa/assets-generator/config'

// Regenerate the app icons from public/app-icon.svg with `npm run generate-icons`.
// The source is already a full-bleed square, so no extra padding is added.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    transparent: { sizes: [64, 192, 512], padding: 0, favicons: [[48, 'favicon.ico']] },
    maskable: { sizes: [512], padding: 0 },
    apple: { sizes: [180], padding: 0 },
  },
  images: ['public/app-icon.svg'],
})
