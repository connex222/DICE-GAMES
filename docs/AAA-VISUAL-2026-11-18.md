# Pocket Gamebox — Premium visual overhaul
18 November 2026 · `improvement/pocket-gamebox-aaa-art-ui`

## Scope and preservation
This is a visual-only facelift for the seven existing titles. The real dice, score calculation, saved states, NPC logic, game progression, original effects and narrator recordings remain authoritative and unchanged. The approval reference was the ChatGPT-created **Pocket Gamebox Premium Edition** lobby and eight independently generated illustrations (seven cover cards and an aspirational Shut the Box screen).

Never use an AI image of a fixed game state as an active gameplay surface. It would display an inaccurate score, tile state and dice pips. The playable wooden tiles, dice and live score must remain real DOM/CSS components connected to the existing game engines.

## Implemented
- The desktop lobby is rendered as **seven real, labelled, keyboard-focusable card links**, replacing a single static clickable image-map. The large Play action launches the selected game.
- The existing mobile game cards are retained as semantic links, with an upgraded premium responsive shell. The seven game links remain available in both layouts.
- The shared colour/typographic/button treatment is refined in `assets/pocket-aaa-lobby.css`, `assets/pocket-aaa-shell.css` and `assets/pocket-aaa-gameplay.css`.
- Shut the Box has a polished wood-and-brass box, tactile wooden tiles, green felt, readable dice readout and strongly differentiated selected/closed tiles. No changes to tile state transitions or scoring.
- Distinct per-title accents are maintained for the remaining six games, while menus, scoreboard framing and button semantics are consistent.
- Existing lobby Sound FX, Voice, Music, Fullscreen, How to Play, Settings and Reset handlers retain their original IDs and working JS.
- Existing game music/voice ducking and Back to Lobby are untouched.
- `prefers-reduced-motion`, desktop 7-column, tablet 4-column and phone 2-column card layouts are supported.

## Approved art assets
The original images were generated in ChatGPT and optimised from PNG into local WebP, with no third-party assets. Their source design includes:
- `assets/aaa-cards/gilded-five.webp` — five dice, not gold bars
- `assets/aaa-cards/shut-the-box.webp` — wooden tiles and dice
- `assets/aaa-cards/liars-dice.webp` — dice and cups
- `assets/aaa-cards/bust-or-bank.webp` — dice and risk meter
- `assets/aaa-cards/generala.webp` — dice and scorecard
- `assets/aaa-cards/ten-of-a-kind.webp` — ten matching dice, not playing cards
- `assets/aaa-cards/brain-raid.webp` — cartoon zombie and brain dice
- `assets/aaa-lobby.webp` — a cinematic games-room scene, used **only** as a subtle atmospheric backdrop, **not** as clickable UI

## QA and open acceptance
The basic source/route assertions and scripted state preservation checks are in `tests/verify-collection.mjs`. The existing `tests/browser-quality.mjs` covers viewport geometry and game workflows. All seven original game logic scripts should be compared against the prior commit to ensure only a CSS link was added. The generated concept art must not be counted as proof of gameplay UI quality.

Do not certify true AAA until: browser screenshots at 320/375/390/430/768/1024/1366/1920 CSS pixels have been reviewed; the 7 card routes, saved game continuation, fullscreen controls, audio mixing and exit/return are demonstrated on live devices; and a human checks the numbers, tile states, dice faces and actual scores in play.

Deployment remains GitHub Pages from `main`; **no Render service required**.
