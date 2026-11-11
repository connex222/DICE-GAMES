# CLAUDE.md - Pocket Gamebox (DICE-GAMES)

Instructions for AI assistants working in this repository.

## What this is

Pocket Gamebox is a collection of seven dice games in a casino-style lobby, played in one browser and castable to a TV: Gilded Five, Shut the Box, Liar's Dice, Bust or Bank, Generala, Ten of a Kind and Brain Raid.

- Live: https://connex222.github.io/DICE-GAMES/ (GitHub Pages, updates automatically from `main`)
- Status: Alpha (2 November 2026). See `docs/ALPHA-NOTES.md`.

## Architecture

| Part | Location |
|---|---|
| Lobby | `index.html` |
| Game shell / back-to-lobby dialog | `play.html` |
| One file per game | `games/*.html` |
| Artwork and shared CSS/JS | `assets/` |
| 94 sound files | `assets/audio/` (list in `REQUIRED-AUDIO-FILES.txt`) |
| Windows helpers | `START-POCKET-GAMEBOX.bat`, `INSTALL-NEW-SOUNDS.*`, `UPLOAD-EVERYTHING-TO-GITHUB.bat` |

## Project rules

- No network requests while playing. Sounds and art load from `assets/`; never link to files on the internet.
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
