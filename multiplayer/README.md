# Pocket Gamebox — seven-game TV multiplayer

## What is implemented

A separate, server-authoritative **TV and phone multiplayer** mode for all seven games:
Shut the Box, Gilded Five, Liar's Dice, Bust or Bank, Generala, Ten of a Kind and Brain Raid.

The original local/standalone games (solo, bots, shared device, original variants) remain unchanged on GitHub Pages.
The multiplayer edition reuses the six original HTML core rule reducers on the Node server, plus a Gilded Five adapter using the original scoring code; the server expands room player caps to eight **only in the multiplayer service**. Default gameplay modes are implemented. Advanced optional local modes are not yet migrated.

## Live

- Standalone: https://connex222.github.io/DICE-GAMES/
- TV multiplayer: https://pocket-gamebox-multiplayer.onrender.com/multiplayer-seven.html
- Existing free Render web service: `pocket-gamebox-multiplayer`, Frankfurt, single instance
- Current service deployment branch: `feature/tv-multiplayer-qr`

## How to play

1. Open the TV multiplayer URL on a large screen. Select **Host TV multiplayer**.
2. Choose one of seven games, then display the generated QR code and four-character room code.
3. Each player scans QR or enters the code and chooses a name on their own phone.
4. Once 2–8 people have joined, the host starts the game.
5. TV displays common board, scores, turn, music and effects. Phones display the individual game controls.
6. Liar's Dice hands are sent only to their owners, while challenges show the public reveal.
7. Reconnect after an ordinary refresh using the saved secret browser session.

## Test locally

```bash
npm install
npm test
npm start
```

Then visit http://localhost:3000/multiplayer-seven.html. For joining via QR on another device use a publicly accessible HTTPS host instead of `localhost`; this URL is embedded in the QR.

## Security and limitations

- Cryptographic dice and server-side validated actions, scorecard rules, turn ordering and outcomes
- No client-supplied dice faces, draws or clocks
- Per-player secret connection token, 4-letter QR room code, eight-player cap and ninth-player rejection
- Public TV view of Liar's Dice censors hidden dice; the owner receives only their own dice until the reveal
- Basic incoming message rate limit, JSON size limit and WebSocket origin check
- Host cannot roll / score for an active player, but can advance completed turns
- Music streams from existing Creative Claw CDN; original recorded FX files are served from the same server
- Browser autoplay restrictions may delay music until a tap/click
- **Rooms are stored in memory only:** service restarts, deploys or Render free-tier sleep can end active matches
- Only one server instance is supported. Production-grade horizontal scaling requires durable room state
- **Physical-device verification remains outstanding:** 2/8 actual phones, TV remote keyboard, Wi-Fi/cellular, rematches, browser compatibility and subjective music balance
- Other original optional game variants such as multi-round Shut the Box and race Ten of a Kind are not yet offered in TV multiplayer

## Verification

`npm test` includes:
- Existing initial QR multiplayer regression test
- Eight-player starts and rule actions for each of seven games
- Private Liar's Dice state tests
- Live WebSocket integration: all seven games, QR SVG endpoint, player authorisation, two phones per match, and an eight-phone room

## Deployment

The existing Render service deploys automatically when commits reach `feature/tv-multiplayer-qr`. Do **not** create extra Render services (current workspace has reached its service-count limit). `render.yaml` documents the free tier, but is not required to re-create the existing service.

After QA, merge changes to `main` for standalone lobby links and documentation; the Render service remains attached to its existing deploy branch.
