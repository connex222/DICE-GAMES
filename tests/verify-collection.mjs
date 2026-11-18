/* Zero-dependency contract checks, not a substitute for physical phone playtesting. */
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const games=['gilded-five','shut-the-box','liars-dice','bust-or-bank','generala','ten-of-a-kind','brain-raid'];
const index=read('index.html'),play=read('play.html'),mixer=read('assets/pocket-quality.js'),css=read('assets/pocket-premium.css');
const aaaLobby=read('assets/pocket-aaa-lobby.js'),aaaCss=read('assets/pocket-aaa-lobby.css'),aaaGameCss=read('assets/pocket-aaa-gameplay.css');
const score=read('assets/game-music.js'),shell=read('assets/pocket-shell.css');
assert.equal(readdirSync(new URL('../games/',import.meta.url)).filter(n=>n.endsWith('.html')).length,7,'exactly seven actual game pages');
for(const slug of games){
 const g=read('games/'+slug+'.html');
 assert.ok(g.includes('pocket-aaa-gameplay.css'),'AAA common cosmetic layer loaded in '+slug);
 assert.ok(aaaGameCss.includes('data-pocket-game="'+slug+'"'),'distinct visual identity is styled for '+slug);
 assert.equal((index.match(new RegExp('href="play\\.html\\?game='+slug+'"','g'))||[]).length,2,slug+' desktop + phone tile');
 assert.ok(play.includes("'"+slug+"'")||play.includes('"'+slug+'"'),slug+' wrapper mapping');
 assert.ok(g.includes('../assets/pocket-premium.css'),slug+' uses shared premium layer');
 if(slug!=='brain-raid')assert.ok(g.includes('href="../index.html" target="_top"'),slug+' exits iframe to actual lobby');
 assert.ok(g.includes('clean-audio.js'),slug+' recorded-asset bridge');
 assert.ok(g.includes('localStorage'),slug+' saves progress');
 assert.ok(g.includes('btnRules')||g.includes('id="rules"'),slug+' rules entry');
 const scripts=[...g.matchAll(/<script(?:\s+type="module")?>([\s\S]*?)<\/script>/g)];
 assert.ok(scripts.length>0,slug+' inline game logic');
 scripts.forEach(match=>new vm.Script(match[1],{filename:slug+'.js'}));
 console.log('PASS',slug,'route, source syntax, save, help and premium layer');
}
assert.ok(!index.includes('index(6).html'),'legacy index is not a game');
assert.ok(!index.includes('<main class="desktop"><img'),'desktop lobby must never be a static image map');
assert.equal((index.match(/class="aaa-card hot"/g)||[]).length,7,'seven real premium desktop cards');
assert.ok(index.includes('id="desktop-play"'),'real large Play button is available');
assert.ok(index.includes('pocket-aaa-lobby.css')&&index.includes('pocket-aaa-lobby.js'),'responsive premium art CSS + interaction present');
assert.ok(aaaCss.includes('grid-template-columns:repeat(7')&&aaaCss.includes('repeat(4')&&aaaCss.includes('max-width:720px'),'7/4/mobile responsive card layout');
assert.ok(aaaCss.includes('prefers-reduced-motion'),'reduced motion in AAA lobby');
assert.ok(aaaGameCss.includes('.tile-face')&&aaaGameCss.includes('.tile-back'),'wood and brass shut-the-box skin applied');
assert.ok(aaaGameCss.includes('Gameplay polish pass'),'shared action/score polish loaded');
const brainV3=read('assets/brain-raid-v3.css'),brainLoader=read('assets/brain-raid-v3-art.js');
const brainSource=read('games/brain-raid.html');
assert.ok(brainSource.includes('brain-raid-v3.css')&&brainSource.includes('brain-raid-v3-art.js'),'Brain Raid Visual 3.0 assets are wired');
assert.ok(brainSource.includes('const FACE_ART = Object.fromEntries'),'Brain Raid uses original vector dice faces');
assert.ok(brainSource.includes('data-face="${face}"'),'Brain Raid retains actual authoritative face keys');
for(const face of ['brain','feet','shot','genius','double','bomb','lucky']){
 assert.ok(brainSource.includes(face+': '),'custom icon shape available for '+face);
}
assert.ok(brainLoader.includes('picture.onerror=()=>{}'),'missing art leaves the functional vector fallback');
assert.ok(brainV3.includes('Approved visual art slots'),'approved images are progressively enabled');
assert.ok(brainV3.includes('prefers-reduced-motion:reduce'),'Brain Raid Visual 3.0 respects reduced motion');
assert.ok(brainSource.includes('Engine.createState')&&brainSource.includes('function renderSlots')&&brainSource.includes('function renderDock'),'visual rebuild retains live gameplay engine');
new vm.Script(brainLoader,{filename:'brain-raid-v3-art.js'});

assert.ok(aaaGameCss.includes('Turn-by-turn tactile clarity'),'dice selection uses grounded state treatments');
for(const [game,state] of [['bust-or-bank','data-valid="false"'],['generala','data-state="held"'],['shut-the-box','.tile.sel'],['ten-of-a-kind','.dbtn.locked']]){
 assert.ok(aaaGameCss.includes('data-pocket-game="'+game+'"]') && aaaGameCss.includes(state),'visible held/selected states for '+game);
}
assert.ok(read('games/bust-or-bank.html').includes('selection not yet valid'),'invalid held dice have explanatory screen-reader label');
assert.ok(read('games/bust-or-bank.html').includes("', tap to ' + (d.state === 'held' ? 'release' : 'keep')"),'available dice actions are announced');

const shutGame=read('games/shut-the-box.html'),bustGame=read('games/bust-or-bank.html'),brainGame=read('games/brain-raid.html');
assert.ok(shutGame.includes('const ROLL_MS = reduceMotion ? 150 : 720;'),'Shut the Box uses responsive 720ms physical roll');
assert.ok(bustGame.includes('const ROLL_MS = reduceMotion ? 150 : 780;'),'Bust or Bank uses responsive 780ms physical roll');
assert.ok(shutGame.includes('if (window.parent === window) Sound.rattle(idx.length, ROLL_MS);'),'Shut the Box does not duplicate recorded rattle in iframe');
assert.ok(bustGame.includes('if (window.parent === window) Sound.rattle(action.rolled.length, ROLL_MS);'),'Bust or Bank does not duplicate recorded rattle in iframe');
assert.ok(brainGame.includes('if (window.parent === window) Sound.shake();'),'Brain Raid uses recorded rattle when embedded');
assert.ok(!brainGame.includes("case 'START_GAME':\n      zombieAnnounce('roll');"),'Brain Raid does not sound a false dice roll on game start');
assert.ok(brainGame.includes('}, 105);'),'Brain Raid face flicker is slower and easier to follow');

assert.ok(aaaGameCss.includes('Signature result feedback'),'actual victory and danger states receive premium styling');
assert.ok(aaaGameCss.includes('.stamp[data-tone="success"] span'),'winning result uses the game-engine outcome tone');
assert.ok(aaaGameCss.includes('.stamp[data-tone="danger"] span'),'losing result uses the game-engine outcome tone');
assert.ok(aaaGameCss.includes('.winner-name'),'winner reveal is styled without modifying scoring');
assert.ok(aaaGameCss.includes('prefers-reduced-motion:no-preference')&&aaaGameCss.includes('animation:none!important'),'celebrations honour reduced-motion preferences');

assert.ok(aaaGameCss.includes(':focus-visible')&&aaaGameCss.includes('outline-offset:3px'),'keyboard users receive visible focus');
assert.ok(aaaGameCss.includes('font-variant-numeric:tabular-nums'),'score figures stay aligned');
assert.ok(read('assets/collection-fullscreen.js').includes('if (window.parent !== window) return;'),'embedded games never create a duplicate fullscreen overlay');
assert.ok(score.includes('track.volume = volume();'),'music adjusts playback volume when ducked for voice and effects');
for(const slug of games){
 const art='assets/aaa-cards/'+slug+'.webp';
 assert.equal(index.split('src="'+art+'"').length-1,2,slug+' approved art appears on TV/desktop and phone');
 const f=new URL('../'+art,import.meta.url);
 assert.ok(existsSync(f)&&statSync(f).size>20000,slug+' approved art is actually bundled, not broken');
}
assert.ok(aaaCss.includes("url('aaa-lobby.webp')"),'approved lobby ambience is referenced');
assert.ok(existsSync(new URL('../assets/aaa-lobby.webp',import.meta.url)),'approved lobby image is bundled');
new vm.Script(aaaLobby,{filename:'pocket-aaa-lobby.js'});
console.log('PASS premium collection semantic cards, responsive gallery, controls and seven unique gameplay treatments');
assert.ok(index.includes('PocketGameboxProgress?.reset()'),'reset clears actual game state, not only lobby prefs');
assert.equal((play.match(/'games\/[^']+\.html'/g)||[]).length,7,'seven wrapper entries');
for(const file of ['pocket-quality.js','pocket-lobby.js','clean-audio.js']){
 new vm.Script(read('assets/'+file),{filename:file});
}
assert.ok(mixer.includes('channels={roll:null,event:null}'),'independent dice/effect channels');
assert.ok(mixer.includes("key==='shut-no-move'"),'Shut the Box repetition guard');
assert.ok(mixer.includes('const important=/(?:winner|victory|perfect|record|reveal|bust|win)$/.test(key)'),'finale and reveal narration bypass routine global throttle');
assert.ok(mixer.includes('if(!important&&now-lastVoiceAt<2750)return;'),'routine narration remains paced');
assert.ok(!mixer.includes("else playFx('dice');"),'enabling effects must not cause a fake dice roll');
assert.ok(mixer.includes('current.onerror=()=>'),'failed narration releases music ducking');
assert.ok(mixer.includes('channels.roll=null;channels.event=null'),'clearing audio stops stale channels');
assert.ok(css.includes('prefers-reduced-motion'),'reduced motion covered');
assert.ok(play.includes('id="bgm"')&&play.includes('assets/game-music.js'),'game wrapper loads dedicated music toggle');
assert.ok(play.includes('aria-label="Back to Pocket Gamebox Lobby"'),'every game wrapper exposes clear Back to Lobby navigation');
assert.ok(!play.includes('id="confirm"')&&!play.includes('id="stay"')&&!play.includes('id="quit"'),'no unwanted return-to-lobby confirmation modal');
assert.ok(play.includes("document.getElementById('home').addEventListener('click',()=>location.assign('index.html'))"),'Back to Lobby is one-click navigation');
assert.equal((play.match(/id="expand"/g)||[]).length,1,'game wrapper has one fullscreen toggle');
assert.ok(!play.includes('assets/collection-fullscreen.js'),'wrapper must not mount a second floating fullscreen control');
assert.ok(!index.includes('assets/collection-fullscreen.js'),'lobby must not mount a duplicate floating fullscreen control');
assert.equal((index.match(/id="full"/g)||[]).length,1,'desktop lobby has one fullscreen control');
assert.equal((index.match(/data-action="full"/g)||[]).length,1,'mobile lobby has one fullscreen control');
assert.ok(shell.includes('min-width:521px')&&shell.includes('max-width:820px'),'compact tablets keep navigation inside a two-row toolbar');
assert.ok(shell.includes('max-width:520px')&&shell.includes('flex-wrap:wrap'),'compact phones reserve an in-flow audio toolbar');
new vm.Script(score,{filename:'game-music.js'});
for(const slug of games){
 assert.ok(score.includes("'"+slug+"': 'https://cdn.creativeclaw.co/"),slug+' has a distinct original soundtrack');
}
const urls=[...score.matchAll(/https:\/\/cdn\.creativeclaw\.co\/[^\s']+\.mp3/g)].map(m=>m[0]);
assert.equal(urls.length,7,'exactly seven original game music URLs');
assert.equal(new Set(urls).size,7,'each game has a unique music track');
assert.ok(score.includes('pocket-gamebox.lobby-music-enabled'),'game music follows the existing lobby preference');
assert.ok(score.includes('document.hidden')&&score.includes("pagehide"),'music stops off-screen');
assert.ok(score.includes('voiceFactor')&&score.includes('fxFactor'),'game music yields to spoken audio and dice');
assert.ok(mixer.includes('PocketGameboxGameMusic?.setVoiceActive(true)'),'narration ducks the score');
assert.ok(mixer.includes('PocketGameboxGameMusic?.duckFor'),'dice and outcome FX duck the score');
console.log('PASS seven distinct original music themes, saved mute preference, voice/FX mix and in-flow controls');
const audioFiles=readdirSync(new URL('../assets/audio/',import.meta.url)).filter(n=>n.endsWith('.mp3'));
assert.ok(audioFiles.length>=90,'approved local recordings present');
for(const key of ['dice','shut-dice-fx','shut-no-move','liar-cup-fx','liar-reveal-fx','bust-dice-fx','bust-bank-fx','gen-dice-fx','ten-dice-fx','zombie-dice-fx']){
 const f=new URL('../assets/audio/'+key+'.mp3',import.meta.url);
 assert.ok(existsSync(f)&&statSync(f).size>1000,key+' recorded audio exists');
}
console.log('PASS seven-game catalogue, audio assets, source compilation and shared controls');
console.log('NOT CERTIFIED: real sound playback, seven completed games, and 320/375/390/430px physical device testing');
