# Responsive Game UI Skill

## Purpose

Ensure Memory Grid works naturally across desktop, tablet, and mobile.

## Core Principle

The game board is always the highest priority.

Do not allow secondary UI to consume so much space that the game becomes difficult to play.

## Desktop

Use a centered composition.

Suggested hierarchy:

Header
→ Game information
→ Game board
→ Power-ups

Secondary information can sit beside the game when supported by the approved design.

## Tablet

Reduce:

- Padding
- Gaps
- Header height
- Secondary content

Keep cards large enough for touch.

## Mobile

Use a single-column composition.

Priority:

1. Header
2. Score/timer
3. Game grid
4. Combo
5. Power-ups

Avoid:

- Horizontal page scrolling
- Tiny cards
- Tiny buttons
- Overcrowded headers

## Touch Targets

Interactive elements should generally be at least 44 × 44px.

Cards should have sufficient spacing to prevent accidental taps.

## Grid

The grid must remain visually balanced.

Do not allow:

- Cards to overflow the viewport.
- Cards to become unusably small.
- Uneven card sizing.

## Orientation

Support both portrait and landscape where practical.

## Breakpoints

Use Tailwind breakpoints where appropriate, but prioritize the actual design rather than blindly applying every breakpoint.

## Testing

Check:

320px
375px
430px
768px
1024px
1440px

The interface must remain usable at every size.