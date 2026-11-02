POCKET GAMEBOX v1.0 — 7 GAME PHONE COLLECTION

IMPORTANT: The accidentally uploaded index(6).html Game Night homepage has been EXCLUDED.
This pack has its own brand-new index.html menu; it is NOT the uploaded index(6).html.

INCLUDED GAMES
1. Gilded Five
2. Shut the Box
3. Liar's Dice
4. Bust or Bank
5. Generala
6. Ten of a Kind
7. Brain Raid

HOW TO PLAY
1. Extract the ZIP in full. Keep all folders together.
2. Open index.html in a browser, or upload the whole extracted folder to any static HTTPS web host.
3. Tap any game card, then use the Games button to return.
4. For maximum playing area, tap the full-screen icon in the game header; tap the floating menu icon to show the header again.
5. Install on a phone: open the HTTPS-hosted site in Safari/Chrome, then use Add to Home Screen or Install App.
6. After a successful online load, the service worker caches the whole pack for offline use (on HTTPS or localhost).

GAMEPLAY AND SAVES
- The seven original playable HTML files have been copied unchanged into games/.
- Saves, settings, game rules and built-in local/solo/bot features remain controlled by each game.
- No server is included. Separate-device multiplayer is NOT enabled.
- When leaving a game, make sure it saves/resumes as intended; the pack does not override original save logic.
- Saving to localStorage works best when hosted at a stable HTTPS address; local file behaviour varies between browsers.

FILES
index.html            New original pack launcher (not the mistakenly attached index(6).html)
play.html             Navigation and game viewer
games/                The seven original self-contained games
assets/               Installed-app icons
manifest.webmanifest  Installable phone app metadata
service-worker.js     Offline caching on HTTPS/localhost

DEPLOYMENT NOTE
If using a web host, keep index.html at the site's root and upload the rest of the pack alongside it.
GitHub Pages and Render Static Sites can host this project. No server code is required.
