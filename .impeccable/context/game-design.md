# Memory Grid — Game Design Rules

## Core Gameplay

Memory Grid is a pair-matching game.

The player selects two face-down cards.

If the cards match:

- Keep both cards face-up.
- Increase match count.
- Increase score.
- Increase combo.

If the cards do not match:

- Show both cards briefly.
- Flip them back.
- Reset or reduce combo according to the scoring rules.

## Game State

The game should have explicit states:

- Ready
- Playing
- Paused
- Checking Match
- Completed
- Failed / Time Expired

Do not rely on scattered boolean flags when a clear state model is more appropriate.

## Card State

Each card can be:

- Hidden
- Revealing
- Revealed
- Matched
- Hiding
- Disabled

## Card Interaction

A card must not be selectable when:

- It is already matched.
- It is currently being animated.
- Two cards are already being evaluated.
- The game is paused.
- The game is completed.

## Score

Score can consider:

- Successful matches
- Speed
- Combo
- Remaining time
- Difficulty

The scoring algorithm should be isolated from the UI.

## Combo

Successful consecutive matches increase the combo.

Example:

Match 1 → ×1

Match 2 → ×2

Match 3 → ×3

Match 4 → ×4

A mismatch can reset the combo.

## Timer

Timer begins when gameplay begins.

Timer pauses when the game is paused.

Timer stops when the game is completed.

Avoid timer drift by calculating elapsed time rather than relying only on repeated increments.

## Moves

One move consists of selecting two cards.

Display:

`Moves: 18`

## Matches

Display:

`7 / 18`

## Accuracy

Accuracy can be calculated from successful matches relative to attempted pairs.

Do not display misleading values such as NaN or Infinity.

## Power-Ups

### Peek

Temporarily reveal unmatched cards.

### Freeze

Temporarily pause the timer.

### Shuffle

Shuffle unmatched cards.

### Hint

Highlight a valid matching pair.

Power-ups must have:

- Available state
- Active state
- Used state
- Disabled state

## Difficulty

Beginner:
4 × 4

Normal:
6 × 6

Expert:
8 × 8

Master:
10 × 10

The game engine should receive the difficulty configuration rather than hardcoding difficulty behavior throughout components.

## Game Completion

When every pair is matched:

1. Stop timer.
2. Calculate final score.
3. Calculate accuracy.
4. Compare against personal best.
5. Update progression.
6. Show victory state.

If the score is a personal best, show:

`NEW PERSONAL BEST!`

## Randomization

Cards must be shuffled fairly.

Do not create predictable layouts.

The randomization logic should be isolated and testable.

## Persistence

Prototype persistence uses localStorage.

Persist:

- Best score
- Best time
- Games played
- Games won
- Achievements
- Streak
- Settings

Never persist active game state unless explicitly required.

## Accessibility

Keyboard users should be able to interact with the game.

Cards should have accessible labels.

Example:

`Hidden card 12`

When revealed:

`Card 12: Moon`

Matched cards should communicate their state.

Do not depend exclusively on color to communicate game state.