POCKET GAMEBOX v12.0 — Stage 8 responsive consolidation

1. Extract the entire ZIP. Open index.html to start.
2. Use the seven tiles to launch games; the lobby image remains the approved artwork.
3. For installed offline/PWA operation, serve the folder through HTTPS or localhost (service workers do not work on file://).
4. Stage 8 adds a shared responsive/accessibility stylesheet to all seven games, viewport-safe wrapper and lobby layout corrections, mobile touch targets, scrolling, and reduced-motion support.
5. Original game rules and game JavaScript are not changed in Stage 8. Previous game-specific Stage 1–7 styling retained.
6. See STAGE-8-QA.json for the actual checks/results and limitations.
Note: CSS adaptation cannot guarantee identical rendering on every physical device; check real tablets/phones and game mid-round states before release.

Browser automation was attempted across five viewports but was blocked by Chromium administrator policy. Stage 8 does not claim actual on-device acceptance.
