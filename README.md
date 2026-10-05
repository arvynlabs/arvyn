# ARVYN — Agents. Intelligence. Execution.

AI agent infrastructure on Robinhood Chain. Next.js 14 + TypeScript + Tailwind + Framer Motion.

## Run

Requires Node.js 18+.

```bash
cd arvyn
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

```
app/
  layout.tsx        # fonts, navbar, footer
  page.tsx          # landing
  agents/           # agent classes + coordination
  protocol/         # runtime / execution / data layers
  ecosystem/        # ecosystem map flow
  docs/             # developer docs
  token/            # $ARVN dashboard
components/
  Navbar.tsx Footer.tsx Logo.tsx Hero.tsx
  ArvynSymbol.tsx   # canvas network animation
  Reveal.tsx SectionHeading.tsx CTA.tsx
lib/site.ts         # nav + content data
```

## Design

- bg `#070707`, panel `#111111`, accent `#FF5A00`, ink `#F5F5F5`, muted `#8A8A8A`
- Inter + JetBrains Mono, thin `white/8` borders, grid backdrops
- Subtle motion only: fade/slide via `Reveal`, hover lifts, canvas drift
