# Visual Implementation Skill

## Purpose

Translate approved Stitch designs into high-fidelity Next.js UI.

## Primary Rule

Do not redesign while coding.

The approved Stitch screens are the visual source of truth.

## Implementation Priority

1. Layout
2. Typography
3. Spacing
4. Colors
5. Components
6. Card proportions
7. Responsive behavior
8. Interaction states
9. Animation

## Rules

- Use TypeScript.
- Do not use `any`.
- Use reusable React components.
- Use Tailwind CSS.
- Use Framer Motion only where animation provides meaningful value.
- Use Lucide React for interface icons.
- Avoid unnecessary dependencies.

## Component Reuse

Create reusable components instead of duplicating markup.

Examples:

- Button
- Card
- Badge
- Modal
- GameCard
- ScorePanel
- DifficultyCard
- AchievementCard
- LeaderboardRow

## Game Components

Game logic must not be embedded deeply inside presentational components.

Prefer:

Game engine
→ game state
→ UI components

## Visual Accuracy

Compare implementation against the Stitch design.

Check:

- Width
- Height
- Alignment
- Spacing
- Font size
- Font weight
- Border radius
- Color
- Shadows
- Icon size
- Card dimensions

## Avoid

- Generic dashboard templates
- Unnecessary component libraries
- Replacing designed elements with defaults
- Excessive CSS overrides
- Inline duplicated styles
- Hardcoded game logic inside JSX

## Responsive Implementation

Do not simply scale desktop.

Create intentional responsive layouts.

Test at:

- 320px
- 375px
- 768px
- 1024px
- 1440px

## Accessibility

Use:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible labels
- Appropriate ARIA only where necessary

Every important interaction must work without hover.