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

**Deployment:** GitHub Pages publishes the contents of `main` at the Play link above. There is no Render service for this static collection. Do not create one as part of routine releases.

## For developers and AI assistants

See `CLAUDE.md` for the build rules.
