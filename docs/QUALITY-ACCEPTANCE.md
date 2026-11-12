# Pocket Gamebox — quality branch QA / acceptance gate
Date: 12 November 2026
Branch: improvement/pocket-gamebox-quality
Status: IN DEVELOPMENT — no merge, no deploy.

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

## Signature moment and end-to-end test matrix
Each item below remains UNVERIFIED until a complete game is played and evidence retained. Do not mark PASS based on static checks.

| Game | Signature moment | Complete game from start to results | Resume after refresh | Mute / re-enable and audio | Phone 320/375/390/430px | Score / tie / tap integrity |
|---|---|---|---|---|---|---|
| Gilded Five | Commit the strongest five-dice score | PENDING | PENDING | PENDING | PENDING | PENDING |
| Shut the Box | Close last tile or record blocked turn once | PENDING | PENDING | PENDING | PENDING | PENDING |
| Liar's Dice | Call Liar, reveal truth and lose a die | PENDING | PENDING | PENDING | PENDING | PENDING |
| Bust or Bank | Bank gains or bust and lose the unbanked turn | PENDING | PENDING | PENDING | PENDING | PENDING |
| Generala | Score a combination / servida | PENDING | PENDING | PENDING | PENDING | PENDING |
| Ten of a Kind | Lock tenth matching die; race/turns completion | PENDING | PENDING | PENDING | PENDING | PENDING |
| Brain Raid | Risk a third shotgun or bank brains | PENDING | PENDING | PENDING | PENDING | PENDING |

## Test procedure for every title
Open via both desktop and mobile collection card. Start a game; confirm short quick guide, game-specific full rules, accessible buttons and no horizontally clipped controls. Test every documented mode. Play an actual complete session with at least one human and, where offered, a bot; screenshot the final state. Start a second game and refresh mid-turn; verify the stored state, scoreboard and next legal move are intact. Tap roll/action buttons rapidly and ensure there is never a double score or a result differing from the landed faces. Check ties and invalid moves. With sound ON, listen to the roll at the start of animation, an event/reveal cue after the decisive result and no overlapping voice. Toggle effects OFF and voice OFF separately, then back ON; test after tab background/return. Repeat at 320, 375, 390 and 430 CSS pixels in portrait and landscape; check screen reader labels, 44px targets and reduced motion.

Run zero-dependency static/source checks:
node tests/verify-collection.mjs

## Audio policy
Recorded MP3 only; no synthetic fallback voice. Effects and spoken voice are separately gated, with independent roll and event effect channels. Announcer lines are restricted to meaningful moments with per-event cooldown; shut-no-move has a 30-second repeated-line guard. Mobile autoplay still requires a genuine activation gesture on some browsers; do not claim verified until measured on iOS Safari and Android Chrome.

## Release gate
A seven-of-seven completed-game matrix, matching audio and mobile evidence, peer QA, and explicit owner approval are REQUIRED before merging or deployment. Static source checks are not proof of these criteria.

## Automated reducer-session evidence
The Node test tests/engine-sessions.mjs exercises real production rules and complete reducer-state sessions, with one Gilded Five scorecard simulation. This does NOT certify completed browser playthroughs, sound playback, or phone usability. Those acceptance cells remain PENDING.

## Collection-level defect corrected
The old lobby Reset control only targeted pg-prefixed keys, while game saves use independent names. Reset now deletes the seven actual saved-game keys and five local record/best keys, retaining sound preferences. Existing game-level Lobby links open the actual collection rather than loading the lobby inside the game iframe; Brain Raid uses the fixed wrapper Games button.

The current Music preference in the original lobby has no confirmed soundtrack implementation. This remains an audio feature gap; it is not counted as a passing music test.

## Real browser action smoke checks
The separate Chromium workflow now verifies one actual first player action per game, requested dice-effect MP3 responses where applicable, and the saved-game tile after returning to the seven-game collection. These checks are distinct from the deterministic full reducer sessions and do not yet replace complete browser finish-to-results tests or listening tests on physical phones.
