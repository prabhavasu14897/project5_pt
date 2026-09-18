# Game Interaction Skill

## Purpose

Implement responsive and reliable game interactions.

## Card Interaction

Cards should feel physical and responsive.

Use:

- Flip animation
- Press feedback
- Match feedback
- Mismatch feedback

Do not make animations so long that they interfere with gameplay.

## Animation

Use Framer Motion for meaningful UI/game transitions.

Prefer short animations.

Respect:

`prefers-reduced-motion`

When reduced motion is enabled:

- Remove unnecessary movement.
- Keep state changes visually clear.
- Preserve functionality.

## Input

Support:

- Mouse
- Touch
- Keyboard where practical

Never rely on hover to reveal essential information.

## Prevent Invalid Actions

Disable or ignore card selection when:

- Card is already matched.
- Card is already selected.
- Two cards are currently being evaluated.
- Game is paused.
- Game is complete.

## Timer

Do not use a continuously incrementing counter as the authoritative timer.

Use timestamps to calculate elapsed time.

Timer must:

- Start correctly.
- Pause correctly.
- Resume correctly.
- Stop correctly.
- Reset correctly.

## Restart

Restart must completely reset:

- Cards
- Score
- Moves
- Timer
- Matches
- Combo
- Power-ups
- Game status

Do not leave old timers or animation loops running.

## Game Completion

Completion should happen exactly once.

Prevent duplicate victory events.

## Power-Ups

Every power-up must have a clear state.

Do not show an interactive power-up if it cannot currently be used.

## Feedback

Important actions should produce immediate feedback:

Match:
- Card remains open.
- Score updates.
- Combo updates.

Mismatch:
- Cards visibly indicate mismatch.
- Cards return to hidden state.

Victory:
- Stop gameplay.
- Display final results.

## State Management

Use Zustand for shared game state.

Keep pure game calculations outside React components where possible.

## Local Persistence

Use localStorage for prototype-level persistent data.

Handle unavailable or malformed stored data gracefully.

Never allow malformed localStorage data to break the game.