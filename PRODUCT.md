# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: casual-to-competitive puzzle players evaluating a portfolio/demo build of a browser memory-matching game. There are no real end users yet — this is a showcase implementation of the approved Stitch designs, built to demonstrate a working, polished brain-training arcade game rather than to serve a live audience.

Secondary (product's intended eventual audience, per the design system and reference screens): casual daily brain-trainers who want quick memory workouts and care about streaks/daily challenges, and competitive score-chasers who care about ranked divisions, leaderboards, and optimizing combo/accuracy.

## Product Purpose

Memory Grid is a pair-matching memory game ("flip two tiles, find the match, clear the grid") wrapped in a cybernetic-arcade progression shell: difficulty-scaled grids (4×4 through 10×10), a combo/accuracy/speed scoring system, four tactical power-ups (Peek, Freeze, Shuffle, Hint), daily challenges, streaks, XP/leveling, unlockable "Neural Sigil" badges, and a competitive leaderboard/division system. Success for this build means the core game loop is fully functional and correct, not just visually represented.

## Positioning

Differentiates from generic memory-match games via: (1) a tactical layer — limited-charge power-ups and a combo-multiplier scoring model reward skilled, fast play rather than just eventual completion; (2) a progression/competitive layer — XP levels, streaks, ranked divisions, and a global leaderboard give repeat sessions a reason to continue; (3) a cohesive "cybernetic grid" visual identity (neon sigil card art, dark obsidian surfaces, calibrated glow) rather than generic flat-card templates.

## Operating Context

Played solo, in-browser, across desktop/tablet/mobile viewports, in short sessions (a single grid clear is the core unit of play, ~30s–3min depending on difficulty). No account/login system or multiplayer sync exists; all progress (best scores/times, streak, XP, achievements, settings) is local to the browser via localStorage.

## Capabilities and Constraints

- Client-only: no backend or database. All persistence is localStorage; this is a deliberate constraint for this build, not a gap to fill.
- Four difficulties: Beginner 4×4, Normal 6×6, Expert 8×8, Master 10×10, each with its own time limit and XP reward.
- Four card themes ("Cyber Beasts", "Cosmic Space", "Solar Relics", "Neon Flora"), each drawing from the fixed image set in `/images` — the app does not generate or fetch placeholder art.
- Game state must be explicit (ready/playing/paused/checking/completed/failed) and card state must be explicit (hidden/revealing/revealed/matched/hiding/disabled); the timer is timestamp-derived (elapsed = now − start − paused), not a blindly incrementing counter.
- Accessibility is a stated requirement from the project's own skill docs: keyboard-operable cards, accessible card labels ("Hidden card 12" / "Card 12: Moon"), state must never depend on color alone, and `prefers-reduced-motion` must be respected.
- Open/undecided: whether this ever grows a real backend (for true cross-device sync or a real competitive leaderboard) is explicitly out of scope unless a future request changes it.

## Brand Commitments

- Product name: **Memory Grid**, tagline "Brain Training Arcade." In-app copyright line reads "© Quantum Cognitive Labs" (2024/2025 depending on screen) — a flavor/lore attribution, not a real company to represent as authoritative.
- Approved visual source of truth: the Stitch-generated screens in `/screens` (home, play/difficulty-select, gameplay, how-to-play, profile, edit-profile, settings) and the fixed art set in `/images`. These are not to be redesigned; screens/states with no direct Stitch reference (pause, victory/results, daily challenge, leaderboard, mobile gameplay) extend the same system rather than introducing a new visual language.
- Internal design-system codename: "Cybernetic Grid UI" (dark obsidian surfaces, electric-cyan primary, violet secondary, emissive-green success, amber/orange combo-warning).

## Evidence on Hand

- `/screens/*.png` — seven approved reference comps (home, play_screen1 = difficulty/mode select, play_screen2 = live gameplay, how_to_play, profile, edit_profile, settings).
- `/images/*.png` — eleven fixed art assets (wolf, fox, planet, orbital rings, neon amethyst, dragon-fruit sigil, apple, strawberry, lotus, blossom, and a "gamer_character" avatar portrait) that must be reused as card art/avatars, never replaced with placeholders.
- `.impeccable/context/*.md` and `.impeccable/skills/*.md` — project-authored specs for the design system, game rules, interaction rules, responsive rules, and a pre-ship quality checklist. Treat these as binding implementation detail, not as this file's product truth.
- No user research, analytics, testimonials, or real player data exist; none should be fabricated.

## Product Principles

1. Functional correctness of the game loop (matching, scoring, combo, timer, pause/resume, restart, completion) outranks covering every listed screen — confirmed priority for this build.
2. Reuse the fixed `/images` art and the approved `/screens` layouts as-is; extend their established system (don't invent a new visual language) for any screen without a direct comp.
3. Everything stays client-side and honest about it — no backend/login is simulated, and no fake multiplayer/social data is presented as real.
4. Progression and competition mechanics (XP, streak, combo, leaderboard, achievements) exist to make repeat solo sessions rewarding, not to imply a live multiplayer service.
5. Accessibility (keyboard play, non-color state cues, reduced-motion) is a first-class constraint from the project's own specs, not an afterthought pass at the end.

## Accessibility & Inclusion

Explicit project requirement (from `.impeccable/skills/game-interaction.md` and `.impeccable/context/game-design.md`): full keyboard operability for card selection, descriptive accessible labels for hidden vs. revealed/matched cards, game state communicated without relying on color alone, and `prefers-reduced-motion` honored throughout (remove non-essential motion, keep state changes clear, preserve functionality).
