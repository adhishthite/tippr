# Tippr

> Ultra-minimal tip calculator web app

Fast, sleek, and reliable tip calculator with bill splitting and rounding features. Built with Next.js 16, React 19, and Tailwind CSS 4.

## Features

### Core

- **Bill Amount Input**: Clean, large input field for entering bill amounts
- **Tip Percentage Selection**: Quick preset buttons (15%, 18%, 20%, 25%) + custom input
- **Calculated Results**: Real-time display of tip amount and total

### Optional (Progressive Disclosure)

- **Split Bill**: Divide total among 2-50 people with penny distribution handling
- **Round Totals**: Round up or down to nearest dollar

## Edge Case Handling

This app handles all real-world edge cases:

- ✅ Micro-transactions ($0.01 bills)
- ✅ Large amounts ($10,000+ with warnings)
- ✅ Negative values (blocked)
- ✅ Zero amounts (graceful handling)
- ✅ Decimal precision (always 2 decimal places)
- ✅ Penny distribution when splitting (shows who pays extra cent)
- ✅ Split count constraints (min 1, max 50 people)
- ✅ Non-numeric input (sanitized)
- ✅ Rapid tapping prevention (debounced)

## Tech Stack

| Layer     | Technology           | Version |
| --------- | -------------------- | ------- |
| Framework | Next.js (App Router) | 16.1.1  |
| Language  | TypeScript           | 5.x     |
| Styling   | Tailwind CSS         | 4.x     |
| State     | React useState       | 19.2.3  |
| Build     | Static Export        | -       |

## Getting Started

### Prerequisites

- Node.js 20+ installed
- pnpm installed (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3010](http://localhost:3010) to view the app.

### Build for Production

```bash
# Create optimized production build
pnpm build

# The static export will be in the 'out' directory
```

### Deployment to Vercel

This app is optimized for Vercel deployment:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Or simply:

1. Push to GitHub
2. Import project in Vercel dashboard
3. Deploy (zero configuration needed)

## Project Structure

```text
tippr/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with metadata
│   │   ├── page.tsx            # Main calculator page
│   │   └── globals.css         # Tailwind styles + custom animations
│   ├── components/
│   │   ├── Calculator.tsx      # Main container + state management
│   │   ├── TipSelector.tsx     # Preset buttons + custom input
│   │   ├── SplitToggle.tsx     # Bill splitting feature
│   │   └── RoundToggle.tsx     # Rounding feature
│   └── lib/
│       └── calculations.ts     # Pure calculation functions
├── public/
├── next.config.ts              # Next.js config (static export)
├── tsconfig.json               # TypeScript config (strict mode)
├── postcss.config.mjs          # PostCSS config for Tailwind v4
├── package.json
└── README.md
```

## Design Philosophy

- **Typography-first**: Numbers are the hero
- **Minimal chrome**: No unnecessary borders, shadows, or decorations
- **High contrast**: Clear readability
- **Generous whitespace**: Clean, breathable interface
- **Subtle interactions**: Purposeful feedback, minimal animations
- **Progressive disclosure**: Features appear only when needed

## Development

### Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production (static export)
pnpm start      # Start production server
pnpm lint       # Run ESLint
pnpm format     # Format code with Prettier
```

### Code Quality

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Consistent formatting
- **Pure Functions**: All calculations are pure, testable functions

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-optimized with `inputMode="decimal"` for numeric keyboards
- Responsive design (works on all screen sizes)

## License

MIT

---

_Built with minimal dependencies and maximum care._
