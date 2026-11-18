# Brain Raid Visual 3.0 — integration record

## Completed source work

- Dedicated responsive premium horror-comedy visual shell at `assets/brain-raid-v3.css`.
- Existing `games/brain-raid.html` loads the new skin and art loader.
- All seven face outcomes are backed by original vector symbols; the game engine remains the authority for face results, rolls and scores.
- Recorded sound, bot logic, classic/Horde modes, local storage keys and Back to Lobby/Fullscreen integration are preserved.
- Roll flicker now uses vector dice art rather than emoji flashes.
- Bank/Risk control text is clearer and still maps to the original `stop`/`roll` actions.
- Runtime art integration is progressive: missing external raster files never hide the existing working UI.

## Approved illustrated artwork

The companion file `brain-raid-v3-approved-art-pack.zip` contains 25 optimised WebP images: the seven approved reference images plus separate live-use mascot expressions, dice icons, mode art, winner art and atmospheric backgrounds.

The archive cannot be committed through the text-only GitHub file edit interface in this session. **The raster images are not yet present in this repository.** Do not claim that the fully illustrated visual redesign is deployed until this directory is uploaded:

`assets/brain-raid-v3/`

The loader in `assets/brain-raid-v3-art.js` checks each file. Once present, artwork activates automatically; when absent, the premium CSS and vector visuals still work.

## Important artwork semantics

- `face-shot.webp` covers single shot and double shot (the double has an existing ×2 badge).
- `lucky` intentionally retains a green shield SVG; it must not be mistaken for the dangerous bomb.
- Horde/toxic icon sheets illustrate reference art; do not invent engine face types.
- Never use the full gameplay/winner mockups as live UI because they contain imaginary scores and player names.
- Player names, scores, dice, turns, timers and enabled buttons must always come from real game state.

## QA still required

- Run `npm test` or the repository's verified collection test command, plus full gameplay from first turn to winner in Classic and Horde.
- Test 320, 375, 390, 430px portrait phone widths; phone landscape; tablets; desktop; 1920×1080 TV.
- Validate resumed saved games, no clipped controls, zero duplicated fullscreen buttons, no confirmation when returning to lobby, working audio toggles, and reduced-motion.
- Verify all WebP images return HTTP 200 after upload and are visually aligned.
- Verify the deployed GitHub Pages or Render instance instead of assuming a commit equals a successful deployment.
