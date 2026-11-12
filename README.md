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

**Play it:** https://connex222.github.io/DICE-GAMES/

## How to use it

1. Open the link above in Chrome or Edge. To show it on a TV, cast the browser tab.
2. Pick a game from the lobby.

To play from your own PC instead, download the repository and double-click `START-POCKET-GAMEBOX.bat`.

## Sound

All 94 sound files are included in `assets/audio`. If any go missing from a local copy, double-click `INSTALL-NEW-SOUNDS.bat` to download them again.

## Status

**Alpha quality release — 12 November 2026.** All seven games passed representative complete-browser playthroughs (start, game actions, visible final results, replay), production rules tests, 390px touch-emulated interaction, and collection save/refresh checks. This does **not** certify physical iOS/Android speaker playback, multi-device use, or every optional mode. These remain known acceptance risks.

- [Quality test and limitations](docs/QUALITY-ACCEPTANCE.md)
- [November release record](docs/RELEASE-2026-11-12.md)
- [Original alpha notes](docs/ALPHA-NOTES.md) and [historical notes](docs/history/)

**Deployment:** GitHub Pages publishes the contents of `main` at the Play link above. There is no Render service for this static collection. Do not create one as part of routine releases.

## For developers and AI assistants

See `CLAUDE.md` for the build rules.
