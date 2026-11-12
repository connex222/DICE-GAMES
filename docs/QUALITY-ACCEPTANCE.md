# Pocket Gamebox — quality branch QA / acceptance gate
Date: 12 November 2026
Branch: improvement/pocket-gamebox-quality
Status: Owner authorised merge and deployment of the alpha quality release on 12 November 2026. Automated checks are green. Physical-device sound and full optional-mode coverage remain unverified.

## Confirmed architecture
The ONLY seven game pages are:
1. Gilded Five — games/gilded-five.html
2. Shut the Box — games/shut-the-box.html
3. Liar's Dice — games/liars-dice.html
4. Bust or Bank — games/bust-or-bank.html
5. Generala — games/generala.html
6. Ten of a Kind — games/ten-of-a-kind.html
7. Brain Raid — games/brain-raid.html

index.html is the seven-tile lobby. play.html is a wrapper with the navigation and recorded-audio mixer. Neither is game eight. Pre-existing artwork, voices, scoring and RNG remain unchanged.

## Automated acceptance evidence (12 November 2026)
**Seven of seven representative end-to-end browser sessions have completed successfully with real UI clicks, visible final results and working rematches.** This is not seven-of-seven *physical-device* acceptance.

- Complete-browser run: https://github.com/connex222/DICE-GAMES/actions/runs/43248048509 — **PASS: 7 completed / 0 failed**; result screenshots and a JSON report uploaded as `pocket-completed-ui-games`.
- Earlier browser smoke / refresh / navigation / audio-request run: https://github.com/connex222/DICE-GAMES/actions/runs/43243571263 — **PASS: 0 failures**. Tests use a simulated touch-capable Chromium viewport, not a physical telephone.
- Production-rule reducer sessions and static contract checks: https://github.com/connex222/DICE-GAMES/actions/runs/43247487298 — **PASS**.
- The complete-browser suite overrides Crypto.getRandomValues **in the isolated QA browser only** to provide predictable dice, while running the actual production UI, controller, scoring and result display. Production RNG is not modified.

| Game | Complete browser game / visible result / replay | Browser saved-state refresh | Recorded audio | Touch/phone and special rules still outstanding |
|---|---|---|---|---|
| Gilded Five | **PASS** — classic solo, all 13 scoring categories, 170-point winner and rematch | **PASS** | Bundled dice asset requested; audible timing pending | Physical phones, multiplayer and Triple Gilded |
| Shut the Box | **PASS** — solo 9-tile blocked roll, score 43 and rematch | **PASS** | Bundled dice asset requested; listening pending | Full shut, 12 tiles, 3/5 rounds, bot and multi-person play |
| Liar's Dice | **PASS** — 2 human players, standard bidding, five revealed challenges, winner and rematch | **PASS** | Recorded-effect infrastructure checked; physical listening pending | Perudo rules, multi-bot opponents and handoff privacy on shared hardware |
| Bust or Bank | **PASS** — solo 12,000 points, banking to win and rematch | **PASS** | Bundled dice asset requested; listening pending | Bust outcomes, bots, contested finish and physical tap handling |
| Generala | **PASS** — solo 10-category scorecard, 145-point result and rematch | **PASS** | Bundled dice asset requested; listening pending | Servida instant win, multiplayer and alternate Ace High setting |
| Ten of a Kind | **PASS** — solo turns-mode match, 2-roll result and rematch | **PASS**; timed race restores paused | Bundled dice asset requested; listening pending | Full race-mode finish on device, bot timings and multi-touch competition |
| Brain Raid | **PASS** — solo Classic, 15 brains in 5 turns and rematch | **PASS** | Bundled rattle and bank effects requested; listening pending | Horde complete-browser run, shots/bombs, multiplayer and voice mixing |

**Viewport scope:** The collection was checked at 320/375/390/430 CSS pixels without horizontal overflow. Individual game flows were executed at a 390-pixel touch-emulated viewport. Actual iOS Safari/Android Chrome, landscape layouts, keyboard and screen-reader audits, speaker playback, and exhaustive mode/outcome testing remain unverified.

**Release decision:** Owner explicitly authorised merging and deploying on 12 November 2026 despite the remaining manual QA gaps. Treat this as an **alpha release with known risks**, not physical-device sign-off. Never describe untested sound, multiple devices, or optional modes as certified.

## Test procedure for every title
Open via both desktop and mobile collection card. Start a game; confirm short quick guide, game-specific full rules, accessible buttons and no horizontally clipped controls. Test every documented mode. Play an actual complete session with at least one human and, where offered, a bot; screenshot the final state. Start a second game and refresh mid-turn; verify the stored state, scoreboard and next legal move are intact. Tap roll/action buttons rapidly and ensure there is never a double score or a result differing from the landed faces. Check ties and invalid moves. With sound ON, listen to the roll at the start of animation, an event/reveal cue after the decisive result and no overlapping voice. Toggle effects OFF and voice OFF separately, then back ON; test after tab background/return. Repeat at 320, 375, 390 and 430 CSS pixels in portrait and landscape; check screen reader labels, 44px targets and reduced motion.

Run zero-dependency static/source checks:
node tests/verify-collection.mjs

## Audio policy
Recorded MP3 only; no synthetic fallback voice. Effects and spoken voice are separately gated, with independent roll and event effect channels. Announcer lines are restricted to meaningful moments with per-event cooldown; shut-no-move has a 30-second repeated-line guard. Mobile autoplay still requires a genuine activation gesture on some browsers; do not claim verified until measured on iOS Safari and Android Chrome.

## Release gate
Seven representative complete browser games have passed and the owner authorised this alpha deployment. Full mode/outcome coverage, audible physical-phone testing and independent acceptance remain REQUIRED before claiming production-level certification. Source and browser tests do not certify physical-device sound or UX.

## Automated reducer-session evidence
The Node test tests/engine-sessions.mjs exercises real production rules and complete reducer-state sessions, with one Gilded Five scorecard simulation. This reducer suite alone does not certify browser UX, sound playback or phone usability. Full representative browser UI sessions were separately verified in the workflow listed above. Physical phone listening and remaining mode coverage are still PENDING.

## Collection-level defect corrected
The old lobby Reset control only targeted pg-prefixed keys, while game saves use independent names. Reset now deletes the seven actual saved-game keys and five local record/best keys, retaining sound preferences. Existing game-level Lobby links open the actual collection rather than loading the lobby inside the game iframe; Brain Raid uses the fixed wrapper Games button.

The current Music preference in the original lobby has no confirmed soundtrack implementation. This remains an audio feature gap; it is not counted as a passing music test.

## Real browser action smoke checks
The separate Chromium workflow now verifies one actual first player action per game, requested dice-effect MP3 responses where applicable, and the saved-game tile after returning to the seven-game collection. These checks are distinct from the deterministic full reducer sessions. Full representative browser finish-to-results tests are now covered by tests/browser-finish.mjs; listening tests on physical phones are still pending.
