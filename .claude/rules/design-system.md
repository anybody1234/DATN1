---
description: Visual design system — dark theme tokens, typography, spacing, component conventions for NihongoFlow UI
alwaysApply: false
globs:
  - "frontend/**/*.tsx"
  - "frontend/**/*.css"
  - "frontend/**/globals.css"
  - "*.html"
  - "*.css"
---

# Design System

**Design reference:** Resend.com — dark, minimal, professional.
Reference image: `resend.com_ (1).png` in project root.

## Color Tokens

```css
--bg:     #0a0a0a   /* page background */
--s1:     #111111   /* card / surface */
--s2:     #161616   /* nested surface */
--b1:     #1f1f1f   /* border default */
--b2:     #2a2a2a   /* border emphasis */
--t1:     #ededed   /* text primary */
--t2:     #a1a1a1   /* text secondary */
--t3:     #555555   /* text muted */
--acc:    #e94560   /* accent — CTAs, progress, highlights */
```

Use **one accent color only**. Never introduce a second accent.

## Typography

- Font: Inter (Latin) + Noto Sans JP (Japanese text)
- Line-height: 1.6 for body, 1.05–1.1 for headings
- Letter-spacing: `-0.04em` to `-0.05em` for large headings
- Japanese text: minimum `14px`, `font-weight: 500` or higher

## Spacing

- 8px grid — all spacing values are multiples of 4 or 8
- Generous whitespace between sections (80px vertical padding)
- Section max-width: `1120px`, centered

## Core Principles

1. **Dark first** — every component starts from `--bg`, lifts to `--s1` on hover
2. **Single accent** — `--acc` for one purposeful element per section; never decorative
3. **No gradients or shadows** unless purposeful (e.g., the hero glow)
4. **Borders over shadows** — use `1px solid var(--b1)` to separate surfaces
5. **Minimalism** — if removing an element doesn't hurt clarity, remove it

## Component Conventions

- All shadcn/ui components restyled to match dark theme via `globals.css` CSS variables
- Custom components:
  - `VideoPlayer` — wraps Video.js, handles HLS + progress auto-save
  - `QuizCard` — question + 4 options + result reveal
  - `ProgressRing` — circular completion indicator
  - `LessonCard`, `CourseCard` — with hover lift state (`translateY(-2px)`)
- Hover states: `border-color` → `--acc-bd` + subtle radial glow via `::after` pseudo

## Do Not

- No inline `style=""` attributes
- No hardcoded color values outside `globals.css` tokens
- No `box-shadow` for card elevation — use `border` instead
- No font-size below `12px`
- No emojis in UI unless they carry semantic meaning (e.g., 🔥 for streak)
