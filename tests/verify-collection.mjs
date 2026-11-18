/* Zero-dependency contract checks, not a substitute for physical phone playtesting. */
import {readFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const games=['gilded-five','shut-the-box','liars-dice','bust-or-bank','generala','ten-of-a-kind','brain-raid'];
const index=read('index.html'),play=read('play.html'),mixer=read('assets/pocket-quality.js'),css=read('assets/pocket-premium.css');
const score=read('assets/game-music.js'),shell=read('assets/pocket-shell.css');
assert.equal(readdirSync(new URL('../games/',import.meta.url)).filter(n=>n.endsWith('.html')).length,7,'exactly seven actual game pages');
for(const slug of games){
 const g=read('games/'+slug+'.html');
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
assert.ok(index.includes('PocketGameboxProgress?.reset()'),'reset clears actual game state, not only lobby prefs');
assert.equal((play.match(/'games\/[^']+\.html'/g)||[]).length,7,'seven wrapper entries');
for(const file of ['pocket-quality.js','pocket-lobby.js','clean-audio.js']){
 new vm.Script(read('assets/'+file),{filename:file});
}
assert.ok(mixer.includes('channels={roll:null,event:null}'),'independent dice/effect channels');
assert.ok(mixer.includes("key==='shut-no-move'"),'Shut the Box repetition guard');
assert.ok(css.includes('prefers-reduced-motion'),'reduced motion covered');
assert.ok(play.includes('id="bgm"')&&play.includes('assets/game-music.js'),'game wrapper loads dedicated music toggle');
assert.ok(play.includes('aria-label="Back to Pocket Gamebox Lobby"'),'every game wrapper exposes clear Back to Lobby navigation');
assert.ok(play.includes('id="quit" class="quit">Back to Lobby</button>'),'the return confirmation clearly names the lobby');
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
