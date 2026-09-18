---
name: Cybernetic Grid UI
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353943'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#181b25'
  surface-container: '#1c1f29'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2ef'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#dfe2ef'
  inverse-on-surface: '#2c303a'
  outline: '#849495'
  outline-variant: '#3b494b'
  surface-tint: '#00dbe9'
  primary: '#dbfcff'
  on-primary: '#00363a'
  primary-container: '#00f0ff'
  on-primary-container: '#006970'
  inverse-primary: '#006970'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#daffde'
  on-tertiary: '#003919'
  tertiary-container: '#00f985'
  on-tertiary-container: '#006d37'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#7df4ff'
  primary-fixed-dim: '#00dbe9'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#60ff99'
  tertiary-fixed-dim: '#00e479'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#0f131c'
  on-background: '#dfe2ef'
  surface-variant: '#31353f'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  display-md:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: 0em
  headline-md:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Outfit
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a sleek, high-precision arcade interface built for browser-based memory puzzle gaming. The aesthetic merges the sharp, luminous visual language of cybernetic sci-fi with modern, accessible web usability. It avoids clunky retro tropes in favor of clean geometric layouts, deep space contrast, and calibrated neon accents.

### Visual Identity & Voice
- **Tone:** Focused, electric, responsive, and tactile.
- **Target Audience:** Casual-to-competitive puzzle gamers who appreciate crisp modern digital aesthetics, fluid micro-interactions, and premium tactile feedback.
- **Emotional Response:** Sharp mental engagement, visual clarity under time pressure, and rewarding feedback for precision play.

### Aesthetic Pillars
- **Deep Slate Canvas:** Deep obsidian and cold navy backdrops eliminate glare and direct total focus to interactive nodes and game tiles.
- **High-Contrast Luminescence:** Electric cyan functions as the primary visual guide and interactive marker, balanced by neon purple system tiers and neon emerald match validations.
- **Tactile Micro-Elevation:** Subtle translucent layering, hairline glowing borders, and restrained bloom effects simulate physical glass-and-circuit interfaces without cluttering cognitive load.

## Colors

The palette operates on a strict functional hierarchy optimized for dark mode. Light is treated as an active state: deep values recede, while saturated emissive hues denote interaction, game state shifts, and mechanical feedback.

### Color Roles & Distribution
- **Backgrounds:**
  - Base canvas: `#0A0E17` (Deep Obsidian Void)
  - Surface tier 1: `#101726` (Sub-surface cards and HUD panels)
  - Surface tier 2: `#162035` (Active game board grid background, floating modals)
  - Surface tier 3 / Hover: `#1E2C48` (Elevated interactive tile base)
- **Primary Accent (`#00F0FF`):**
  - Primary interactive state, standard focus rings, active timer gauges, and primary call-to-action indicators.
  - Secondary blue companion: `#0080FF` for dimensional depth, active state gradients, and hover transitions.
- **Secondary Accent (`#8B5CF6` / `#A855F7`):**
  - Player progression bars, special power-up mechanics, rare collectible indicators, and XP meters.
- **Feedback & Gameplay Accents:**
  - Success / Match: `#00FF88` (Emissive emerald for confirmed memory pairs and stage clears)
  - Combo / Multiplier: `#F59E0B` to `#FF5500` (Amber-orange fire states for streaks, critical countdowns, and warning alerts)
- **Typography & Neutrals:**
  - High-emphasis text: `#FFFFFF` (Headers, match labels, primary metrics)
  - Medium-emphasis text: `#94A3B8` (Descriptions, secondary stats, standard grid coordinates)
  - Low-emphasis borders: `rgba(148, 163, 184, 0.12)`

## Typography

The typographic system utilizes `Outfit` for energetic, geometric headers, telemetry, and numerical score counters, paired with `Inter` for micro-legibility in dense dashboard controls, tooltips, and procedural rules.

### Rules & Formatting
- **Scores, Timers & Telemetry:** Always render in `Outfit` with uppercase tracking (`letter-spacing: 0.05em` or higher) and tabular figure alignments (`font-variant-numeric: tabular-nums`) to prevent jitter during real-time score updates.
- **Visual Weight:** Keep body text at standard regular weight (`400`) to maximize contrast against glowing outlines. Use bold weights (`700`) strictly on display titles, combo multipliers, and primary status tags.

## Layout & Spacing

Layout adheres to an 8px architectural grid. The game stage uses a constrained fixed-ratio viewport centered on desktop devices, shifting to a fluid grid on compact screens.

### Grid & Breakpoints
- **Mobile (< 768px):** 4-column layout, 16px margins, 12px tile gutters. HUD stacks vertically into header counters and bottom thumb-action trays.
- **Tablet (768px - 1024px):** 8-column layout, 24px margins, 16px gutters. Board occupies the center 6 columns, with sidebar telemetry flanking right.
- **Desktop (> 1024px):** 12-column layout max-width centered at 1280px. Main board matrix locked to an aspect ratio container (e.g., 4x4, 6x6) with persistent HUD panels occupying balanced lateral positions.

## Elevation & Depth

Visual depth is achieved through high-contrast borders and emissive ambient backlights rather than heavy opaque drop-shadows.

### Layer Tiers
- **Tier 0 (Base Board):** `#0A0E17` with a subtle geometric dot-matrix overlay (`opacity: 0.04`).
- **Tier 1 (Surface Containers):** Background `#101726` with `1px solid rgba(148, 163, 184, 0.12)`.
- **Tier 2 (Elevated Tiles & Cards):** Background `#162035` backed by `box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.7)`.
- **Tier 3 (Interactive Active & Hover):** Hairline cyan boundary `1px solid #00F0FF`, accompanied by an exterior neon bloom `box-shadow: 0 0 16px rgba(0, 240, 255, 0.35)`.
- **Tier 4 (Success / Matched Pair):** Emissive green boundary `1px solid #00FF88` with localized radiance `box-shadow: 0 0 20px rgba(0, 255, 136, 0.45)`.
- **Modals & Overlays:** Background `#101726` with 80% alpha and `backdrop-filter: blur(12px)`.

## Shapes

The design uses roundedness level `2`, producing structural corners that feel technical rather than bubbly or toy-like.

### Token Applications
- Standard UI Cards & Tiles: `0.5rem` (`rounded`, base radius)
- Interactive Large Panels & Playfield Board: `1rem` (`rounded-lg`)
- Victory Overlays & System Modals: `1.5rem` (`rounded-xl`)
- Badges, Chips & Progress Pills: Fully rounded (`9999px`)

## Components

### Buttons
- **Primary Cyber Button:**
  - Surface: Linear gradient (`#00F0FF` to `#0080FF`).
  - Text: `#0A0E17`, `label-lg`, uppercase, font weight 700.
  - Border: None.
  - Hover: Brightness boost (`110%`), glowing bloom `box-shadow: 0 0 16px rgba(0, 240, 255, 0.5)`.
  - Active: Scaled down (`0.98`).
- **Secondary Ghost Button:**
  - Surface: `rgba(16, 23, 38, 0.6)`.
  - Text: `#00F0FF`, `label-lg`.
  - Border: `1px solid rgba(0, 240, 255, 0.4)`.
  - Hover: Surface shifts to `rgba(0, 240, 255, 0.1)`, border resolves to pure `#00F0FF`.

### Memory Tiles (Core Gameplay Component)
- **Face-Down State:** Surface `#162035`, border `1px solid rgba(148, 163, 184, 0.15)`. Centered with a low-opacity geometric grid glyph.
- **Hover State:** Border transitions to `#00F0FF`, subtle lift via `transform: translateY(-2px)`.
- **Revealed State:** Smooth 3D flip transform. Surface `#1E2C48`, border `1px solid #0080FF`. Symbol rendered in high-contrast neon glyph.
- **Matched Pair State:** Pulsing green glow `box-shadow: 0 0 24px rgba(0, 255, 136, 0.6)`, border `#00FF88`, lingering particle burst.

### Chips & Gaming Badges
- **Status / Multiplier Badges:** Height 24px, pill-shaped radius, background `rgba(245, 158, 11, 0.15)`, text `#F59E0B`, border `1px solid rgba(245, 158, 11, 0.3)`.
- **Difficulty Tag:** Background `rgba(139, 92, 246, 0.15)`, text `#A855F7`, uppercase `label-sm`.

### Form Controls & Text Inputs
- **Inputs:** Background `#101726`, text `#FFFFFF`, border `1px solid rgba(148, 163, 184, 0.2)`. Focus brings border to `#00F0FF` with a zero-spread 2px ring: `box-shadow: 0 0 0 2px rgba(0, 240, 255, 0.25)`.
- **Checkboxes & Toggles:** Square frames with 4px border radius. Checked state fills with `#00F0FF`, checkmark glyph in `#0A0E17`.

### HUD Panels & Score Cards
- **Score Header Panel:** Dark frosted backdrop (`rgba(16, 23, 38, 0.8)` with blur), border bottom `1px solid rgba(148, 163, 184, 0.1)`. Numerical readouts in `Outfit` bold tabular numerals.
- **Combo Meter:** Horizontal bar gauge, background `#162035`, filled with energetic linear gradient from `#F59E0B` to `#FF5500`, pulsating at 4x streaks.