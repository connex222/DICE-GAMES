/* Seven original Creative Claw instrumentals, one per Pocket Gamebox title.
 * Player-side only: never changes dice, scoring, saves, voice or FX.
 * Shares the collection's Music setting and yields politely to narration.
 */
(() => {
  'use strict';
  const SONGS = Object.freeze({
    'gilded-five': 'assets/audio/music-gilded-five.mp3',
    'shut-the-box': 'assets/audio/music-shut-the-box.mp3',
    'liars-dice': 'assets/audio/music-liars-dice.mp3',
    'bust-or-bank': 'assets/audio/music-bust-or-bank.mp3',
    'generala': 'assets/audio/music-generala.mp3',
    'ten-of-a-kind': 'assets/audio/music-ten-of-a-kind.mp3',
    'brain-raid': 'assets/audio/music-brain-raid.mp3'
  });
  const TITLES = Object.freeze({
    'gilded-five': 'Gilded Five',
    'shut-the-box': 'Shut the Box',
    'liars-dice': "Liar's Dice",
    'bust-or-bank': 'Bust or Bank',
    'generala': 'Generala',
    'ten-of-a-kind': 'Ten of a Kind',
    'brain-raid': 'Brain Raid'
  });
  const slug = new URLSearchParams(location.search).get('game');
  const button = document.getElementById('bgm');
  const source = Object.hasOwn(SONGS, slug) ? SONGS[slug] : null;
  if (!button || !source) return;
  const KEY = 'pocket-gamebox.lobby-music-enabled';
  const BASE = 0.14;
  const track = new Audio(source);
  track.loop = true;
  track.preload = 'none'; // Avoid decoding the whole 65-second track on a phone.
  let enabled = localStorage.getItem(KEY) !== 'false';
  let voiceActive = false;
  let duckUntil = 0;
  let duckTimer = null;
  let pendingPlay = false;
  let unavailable = false;

  function volume() {
    if (!enabled || document.hidden) return 0;
    const voiceFactor = voiceActive ? 0.15 : 1;
    const fxFactor = Date.now() < duckUntil ? 0.48 : 1;
    return BASE * voiceFactor * fxFactor;
  }
  function paint() {
    track.volume = volume();
    button.textContent = enabled ? '♫ Music' : '♫ Off';
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-label', (enabled ? 'Mute' : 'Play') + ' ' + TITLES[slug] + ' background music');
    button.title = unavailable
      ? 'Local soundtrack unavailable'
      : TITLES[slug] + ' original soundtrack — ' + (enabled ? 'on' : 'off');
    button.dataset.music = enabled ? 'on' : 'off';
  }
  async function play() {
    if (!enabled || !track.paused || document.hidden || pendingPlay || unavailable) return;
    pendingPlay = true;
    track.volume = volume();
    try {
      await track.play();
      if (!enabled || document.hidden) track.pause();
    } catch (e) {
      // Most mobile/TV browsers prohibit playback until the first real click.
      // Do not lie to the user or mark ordinary autoplay rejection as broken.
      if (e && e.name !== 'NotAllowedError' && e.name !== 'AbortError') unavailable = true;
    } finally {
      pendingPlay = false;
      paint();
    }
  }
  function setEnabled(value) {
    enabled = !!value;
    localStorage.setItem(KEY, String(enabled));
    if (!enabled) track.pause();
    unavailable = false;
    paint();
    if (enabled) void play();
  }
  button.addEventListener('click', () => setEnabled(!enabled));
  document.addEventListener('pointerdown', () => {
    if (enabled && track.paused) void play();
  }, {passive: true});
  document.addEventListener('keydown', () => {
    if (enabled && track.paused) void play();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) track.pause();
    else void play();
  });
  window.addEventListener('pagehide', () => {
    clearTimeout(duckTimer);
    track.pause();
  });
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    enabled = e.newValue !== 'false';
    if (!enabled) track.pause();
    paint();
    if (enabled) void play();
  });
  track.addEventListener('error', () => {
    if (!enabled) return;
    unavailable = true;
    track.pause();
    paint();
  });
  const mixer = {
    setVoiceActive(active) {
      voiceActive = !!active;
      paint();
    },
    duckFor(ms) {
      duckUntil = Math.max(duckUntil, Date.now() + Math.max(0, Number(ms) || 0));
      clearTimeout(duckTimer);
      paint();
      duckTimer = setTimeout(paint, Math.max(0, duckUntil - Date.now()) + 25);
    },
    isEnabled() { return enabled; },
    source: source
  };
  window.PocketGameboxGameMusic = mixer;
  paint();
  void play();
})();