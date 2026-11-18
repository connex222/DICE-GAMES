# CLAUDE.md - Pocket Gamebox (DICE-GAMES)

Instructions for AI assistants working in this repository.

## What this is

Pocket Gamebox is a collection of seven dice games in a casino-style lobby, played in one browser and castable to a TV: Gilded Five, Shut the Box, Liar's Dice, Bust or Bank, Generala, Ten of a Kind and Brain Raid.

- Standalone: https://connex222.github.io/DICE-GAMES/ (GitHub Pages, updates automatically from `main`)
- TV multiplayer: https://pocket-gamebox-multiplayer.onrender.com/multiplayer-seven.html (existing free Render service, tracked separately)
- Status: Alpha quality release (12 November 2026). See `docs/RELEASE-2026-11-12.md` and `docs/QUALITY-ACCEPTANCE.md`; the 2 November notes are historical.

## Architecture

| Part | Location |
|---|---|
| Lobby | `index.html` |
| Game shell / back-to-lobby dialog | `play.html` |
| TV multiplayer lobby and phone controls | `multiplayer-seven.html` |
| Seven-game server / engine adapters | `multiplayer/server-v2.mjs`, `multiplayer/engines.mjs` |
| One file per game | `games/*.html` |
| Artwork and shared CSS/JS | `assets/` |
| 94 sound files | `assets/audio/` (list in `REQUIRED-AUDIO-FILES.txt`) |
| Windows helpers | `START-POCKET-GAMEBOX.bat`, `INSTALL-NEW-SOUNDS.*`, `UPLOAD-EVERYTHING-TO-GITHUB.bat` |

## Project rules

- **Standalone mode:** preserve offline/local gameplay. Original audio files and artwork load from `assets/`; separate Creative Claw hosted background music may stream when online.
- **TV multiplayer:** the new `multiplayer/server-v2.mjs` WebSocket service supplies authoritative state to `multiplayer-seven.html`; it requires an internet/network connection. Server-side `multiplayer/engines.mjs` reuses original game reducer code from `games/*.html` and sanitises moves. QR codes come from the `/qr` endpoint. Protect hidden Liar's Dice cups and reconnect tokens.
- Do not replace the existing local game engine or remove solo/bot/pass-and-play. Multiplayer currently targets default game modes. Test on real hardware before production sign-off.
- `REQUIRED-AUDIO-FILES.txt` is read by `DEPLOY-ALL-TO-GITHUB.ps1`; keep it in the root and keep it accurate.
- Keep the casino look (green felt and gold) consistent across all seven games.
- Text and dice must be readable on a TV from a sofa.
- Shaun uploads with `UPLOAD-EVERYTHING-TO-GITHUB.bat` from his PC. Remind him to run `git pull` in that folder first if GitHub has changed since his last upload.

## Working with Shaun (the owner)

- Shaun is not a programmer. Explain every step in plain English, in order, and assume no prior knowledge.
- Always return complete files, never partial snippets or "..." placeholders.
- Use UK English.
- Never delete files to tidy up; move old notes into `docs/` instead.
- Never force-push, rewrite history or rename the repository.
