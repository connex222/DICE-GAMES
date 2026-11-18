# Pocket Gamebox

Seven dice games in one place, castable to a TV:

| Game | What it is |
|---|---|
| Gilded Five | Casino-style five-dice scoring game |
| Shut the Box | Classic pub dice game |
| Liar's Dice | Bluffing game |
| Bust or Bank | Push-your-luck 10,000 game |
| Generala | Latin American five-dice classic |
| Ten of a Kind | Race to roll ten the same |
| Brain Raid | Zombie push-your-luck game |

**Standalone (solo / bots / pass-and-play):** https://connex222.github.io/DICE-GAMES/

**TV multiplayer (2–8 phones, seven games):** https://pocket-gamebox-multiplayer.onrender.com/multiplayer-seven.html

### TV multiplayer, 18 November 2026

Open the multiplayer URL on the TV or PC, choose **Host TV multiplayer**, choose one of the seven games, and display the generated QR code. Guests scan it from their own phone (or enter the four-letter room code), type their name, and wait for the host to start. The TV displays public information, the scores and current turn; phones provide individual controls. The original standalone version remains unchanged. Server rolls dice and validates moves. Liar's Dice keeps each person's secret cup private until a challenge reveal.

This is the first seven-game TV implementation using each game's original core rules in default modes. Original optional variants, hardware audio quality and full physical eight-phone gameplay remain outstanding acceptance checks. Rooms live in server memory and are lost across service restarts or deploys; players can reconnect after a simple browser refresh while the room survives.



## How to use it

1. Open the link above in Chrome or Edge. To show it on a TV, cast the browser tab.
2. Pick a game from the lobby.

To play from your own PC instead, download the repository and double-click `START-POCKET-GAMEBOX.bat`.

## Premium Edition visuals — 18 November 2026

The lobby is now a **real responsive seven-game gallery**, not a single static image with invisible hitboxes. Each game has individual ChatGPT-generated premium artwork bundled locally as WebP (the casino dice, wooden tiles, bluffing cups, jackpot risk, Generala scorecard, ten matching dice and comic zombies). A separate lounge backdrop adds atmosphere without replacing accessible controls.

All seven active games use one shared visual system, with distinctly themed surfaces. **Shut the Box** features a wood-and-brass box treatment while preserving the actual interactive tiles and dice. Back to Lobby, fullscreen, voice/effects/music, saved progress, rules and every existing game engine are unchanged.

The visual overhaul is not yet a physical-device quality certificate: review the updated browser QA matrix at 320/375/390/430/768/1024/1366/1920 px and test on actual phones and televisions before marking a production release.

## Sound

All 94 approved game-effect and narrator recordings are included in `assets/audio`. If any go missing from a local copy, double-click `INSTALL-NEW-SOUNDS.bat` to download them again.

The collection has its own original lobby track, **Seven Small Victories**. As of 18 November 2026, each of the seven games also has a **distinct original Creative Claw instrumental theme**:

- **Gilded Five:** elegant art-deco casino jazz.
- **Shut the Box:** light-hearted traditional British pub piano.
- **Liar's Dice:** sly, low-key jazz-noir suspense.
- **Bust or Bank:** playful funk-and-brass risk music.
- **Generala:** relaxed Latin jazz with guitar and piano.
- **Ten of a Kind:** optimistic rhythmic mallets and synth textures.
- **Brain Raid:** quirky, comic monster-caper orchestration.

Each in-game music control uses the same saved **Music ON/OFF** preference as the collection lobby. The soundtrack starts when the browser allows it, or after a real interaction where autoplay is restricted. It stays very quiet, dips under voice lines and dice effects, and pauses when the page is hidden.

**Important:** the seven new themes stream from permanent Creative Claw-hosted URLs and therefore require internet access. The original local game audio and rules are unchanged; games remain playable without streamed music. The new music has passed source and mock audio checks, but it has not been certified on every physical phone, TV or speaker.

## Status

**Alpha quality release — 12 November 2026.** All seven games passed representative complete-browser playthroughs (start, game actions, visible final results, replay), production rules tests, 390px touch-emulated interaction, and collection save/refresh checks. This does **not** certify physical iOS/Android speaker playback, multi-device use, or every optional mode. These remain known acceptance risks.

- [Quality test and limitations](docs/QUALITY-ACCEPTANCE.md)
- [November release record](docs/RELEASE-2026-11-12.md)
- [Original alpha notes](docs/ALPHA-NOTES.md) and [historical notes](docs/history/)

**Deployment:** GitHub Pages serves the standalone collection from `main`. The separate WebSocket-based TV multiplayer runs on the existing free Render service `pocket-gamebox-multiplayer` (deploy branch `feature/tv-multiplayer-qr`). No additional paid service is required. See `multiplayer/README.md` for limitations and operations.

## For developers and AI assistants

See `CLAUDE.md` for the build rules.

## Connection resilience and Render operations (18 November 2026)

- The multiplayer server sends WebSocket pings every **25 seconds**. A phone that does not pong before the next heartbeat is terminated and marked offline through the normal disconnect handler; its original seat and token remain available for rejoining.
- On **SIGTERM**, the server stops accepting connections, sends `serverRestarting` to TV and phone clients, closes their sockets with WebSocket **1012 (Service Restart)**, and exits within 10 seconds.
- Both TV and phone show a reconnect overlay and retry automatically with **1, 2, 4, 8, then 10-second** delays (capped at 10 seconds). A saved room token is used to reclaim the existing host/player seat. A missing room prompts a return to the lobby.
- **Important limitation:** disconnect/rejoin works while the original process remains alive. Rooms are **in memory**; a Render restart or free-tier sleep destroys the room and live game state. Automatic WebSocket reconnection cannot restore a match across that process restart.
- `GET /health` returns JSON: `{"ok":true,"rooms":0,"uptime":123}` (uptime is seconds, room count varies). Render checks `/health`.
- `npm start` now starts the Node server directly. `npm test` runs node:test integration and engine tests, including the heartbeat, rejoin, health and SIGTERM regressions. Tests run at **build time**, not every cold start.
- **Lockfile caveat:** this repository has no committed npm lockfile yet. The Render build bootstraps one with `npm install --package-lock-only` before `npm ci --omit=dev && npm test`. Commit a generated `package-lock.json` to remove the bootstrap step in a later change.
- The existing Render service currently deploys from `feature/tv-multiplayer-qr`; merging the PR into that branch is necessary to reach that service. If the Render dashboard ignores `render.yaml`, update its Build Command to match the YAML. Opening this PR alone does not deploy.
