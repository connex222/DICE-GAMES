/* Recorded-asset mixer, separate channels for rattle and consequence.
 * This runs in play.html, the sole owner of MP3 audio. It never changes dice outcomes.
 * Browser audio still requires user activation on some devices.
 */
(()=>{'use strict';
const BASE='assets/audio/';
const frame=document.getElementById('game');
const slug=new URLSearchParams(location.search).get('game');
const voiceButton=document.getElementById('listen');
const effectsButton=document.getElementById('effects');
const guideButton=document.getElementById('guide-toggle');
const guidePanel=document.getElementById('guide-panel');
const guideClose=document.getElementById('guide-close');
const audioStatus=document.getElementById('audio-status');
const VOICE={
'gilded-five':['gilded-new-game','gilded-jackpot','gilded-final-round','gilded-winner','gilded-record'],
'shut-the-box':['shut-start','shut-no-move','shut-victory'],
'liars-dice':['liar-start','liar-challenge','liar-reveal','liar-winner'],
'bust-or-bank':['bust-start','bust-big','bust-bust','bust-win'],
'generala':['gen-start','gen-combo','gen-generala','gen-serv','gen-win'],
'ten-of-a-kind':['ten-start','ten-perfect','ten-win'],
'brain-raid':['brain-genius','brain-bust','brain-last-round','brain-winner']
};
const FX=new Set(['dice','zombie','zombie-shotgun-fx','zombie-brain-fx','zombie-bust-fx','zombie-bank-fx','zombie-dice-fx','zombie-victory-fx',
'shut-dice-fx','shut-tile-fx','shut-victory-fx','liar-cup-fx','liar-slam-fx','liar-reveal-fx','liar-win-fx',
'bust-rocket-fx','bust-dice-fx','bust-tension-fx','bust-bank-fx','bust-bust-fx',
'gen-dice-fx','gen-hold-fx','gen-combo-fx','gen-victory-fx','ten-dice-fx','ten-lock-fx','ten-combo-fx','ten-perfect-fx']);
const ALT={'gilded-jackpot':['gilded-jackpot','gilded-jackpot-b','gilded-jackpot-c']};
const RULES={
'gilded-five':['Gilded Five','Roll five dice up to three times. Tap dice to hold them, then choose a scoring box. Fill the entire scorecard.','Signature moment: commit a five-of-a-kind or risk another roll for the right box. Upper-section totals earn their documented bonus. The scorecard shows points before you lock them in.'],
'shut-the-box':['Shut the Box','Roll the dice, then close any available tiles whose values add up to the roll. Repeat until you cannot close a valid combination.','Signature moment: close the final tile to shut the box. If tiles remain, their sum is your penalty; lowest score wins. One-die options depend on the selected rules.'],
'liars-dice':['Liar’s Dice','Your dice are hidden. Raise the current bid, or challenge it by calling Liar. A challenge reveals the cups and costs the losing player a die.','Signature moment: the challenge and reveal. Read the current bid and number of dice remaining. Ones may be wild depending on the chosen rules.'],
'bust-or-bank':['Bust or Bank','Roll scoring dice, select the scoring dice you want to keep, then roll the rest or bank the points. A roll with no scoring dice loses the unbanked turn total.','Signature moment: BANK or RISK. Ones, fives and eligible combinations score; use the in-game scoring table for exact values and minimum banking requirements.'],
'generala':['Generala','Roll five dice up to three times, hold useful dice between rolls and choose an available category on your scorecard.','Signature moment: a Generala or Generala servida. Straights, full houses and four/five of a kind have different scores; inspect the category preview before committing.'],
'ten-of-a-kind':['Ten of a Kind','Roll ten dice, lock the faces you want to keep and reroll the rest until all ten match. Choose turns or a timed race in setup.','Signature moment: the tenth matching die locks into place. In race mode the timer and pause state matter; in turns mode fewer rolls are better.'],
'brain-raid':['Brain Raid','Roll three zombie dice. Brains are points, footsteps can return on later rolls and shotgun blasts increase your danger.','Signature moment: bank the brains or push on. Three shotguns bust the turn. Some extra dice and modifiers are mode-specific; the game rules explain them.']
};
const voiceSet=new Set(VOICE[slug]||[]);
const lastFx=new Map(),lastVoiceByKey=new Map(),cycles={};
const channels={roll:null,event:null};
let voice=null,voiceOn=localStorage.getItem('pg-quiet-voice')==='on';
let effectsOn=localStorage.getItem('pg-effects-off')!=='yes';
let lastVoiceAt=0,lastRollAt=0,queuedVoice=0;
function audio(key){const a=new Audio(BASE+key+'.mp3');a.preload='auto';return a;}
function stop(a){if(a){try{a.pause();a.currentTime=0;}catch(_){}}}
function stopAll(){stop(voice);voice=null;stop(channels.roll);stop(channels.event);clearTimeout(queuedVoice);queuedVoice=0;}
function paint(){
 voiceButton.textContent='VO';voiceButton.title=voiceOn?'Voice on — tap to mute':'Voice off — tap to enable';
 voiceButton.setAttribute('aria-label',voiceOn?'Mute recorded narration':'Enable recorded narration');
 voiceButton.setAttribute('aria-pressed',String(voiceOn));
 effectsButton.textContent='FX';effectsButton.title=effectsOn?'Effects on — tap to mute':'Effects off — tap to enable';
 effectsButton.setAttribute('aria-label',effectsOn?'Mute sound effects':'Enable sound effects');
 effectsButton.setAttribute('aria-pressed',String(effectsOn));
}
function playFx(key){
 if(!FX.has(key)||!effectsOn||document.hidden)return;
 const now=Date.now(),old=lastFx.get(key)||0;
 if(now-old<200)return;
 lastFx.set(key,now);
 const kind=(key==='dice'||key.includes('dice-fx')||key.includes('cup-fx'))?'roll':'event';
 if(kind==='roll')lastRollAt=now;
 stop(channels[kind]);
 const sound=audio(key);
 sound.volume=kind==='roll'?.70:.62;
 channels[kind]=sound;
 sound.onended=()=>{if(channels[kind]===sound)channels[kind]=null;};
 sound.play().catch(()=>{if(channels[kind]===sound)channels[kind]=null;audioStatus.textContent='Sound needs a tap on this device. Use the sound-effects control to enable it.';});
}
function speak(key){
 if(!voiceOn||!voiceSet.has(key)||document.hidden)return;
 const now=Date.now();
 const minimum=(key==='shut-no-move')?30000:(key==='gen-combo'?13000:7000);
 if(now-(lastVoiceByKey.get(key)||0)<minimum)return;
 if(now-lastVoiceAt<2750)return;
 lastVoiceAt=now;lastVoiceByKey.set(key,now);
 clearTimeout(queuedVoice);
 const delay=Math.max(0,lastRollAt+1000-now);
 queuedVoice=setTimeout(()=>{
  if(!voiceOn||document.hidden)return;
  stop(voice);
  const variants=ALT[key];
  if(variants){const index=cycles[key]||0;cycles[key]=index+1;key=variants[index%variants.length];}
  voice=audio(key);voice.volume=.76;
  const current=voice;
  current.onended=()=>{if(voice===current)voice=null;};
  current.play().catch(()=>{if(voice===current)voice=null;});
 },delay);
}
voiceButton.addEventListener('click',()=>{
 voiceOn=!voiceOn;localStorage.setItem('pg-quiet-voice',voiceOn?'on':'off');
 if(!voiceOn){stop(voice);clearTimeout(queuedVoice);}paint();
});
effectsButton.addEventListener('click',()=>{
 effectsOn=!effectsOn;localStorage.setItem('pg-effects-off',effectsOn?'no':'yes');
 if(!effectsOn){stop(channels.roll);stop(channels.event);}else playFx('dice');
 paint();
});
window.addEventListener('storage',e=>{
 if(e.key==='pg-effects-off'){effectsOn=e.newValue!=='yes';if(!effectsOn){stop(channels.roll);stop(channels.event);}}
 if(e.key==='pg-quiet-voice'){voiceOn=e.newValue==='on';if(!voiceOn)stop(voice);}
 paint();
});
window.addEventListener('message',e=>{
 if(e.source!==frame.contentWindow||!e.data)return;
 if(e.data.type==='pocket-audio-pref'){
  if(typeof e.data.effects==='boolean'){effectsOn=e.data.effects;localStorage.setItem('pg-effects-off',effectsOn?'no':'yes');if(!effectsOn){stop(channels.roll);stop(channels.event);}}
  if(typeof e.data.voice==='boolean'){voiceOn=e.data.voice;localStorage.setItem('pg-quiet-voice',voiceOn?'on':'off');if(!voiceOn)stop(voice);}
  paint();return;
 }
 if(e.data.type!=='pocket-audio'||typeof e.data.key!=='string')return;
 const key=e.data.key;
 if(FX.has(key))playFx(key);
 else speak(key);
});
const guide=RULES[slug]||['Choose a game','Pick one of the seven games from the collection.',''];
document.getElementById('guide-title').textContent=guide[0]+' · Quick guide';
document.getElementById('guide-body').textContent=guide[1]+'\n\n'+guide[2]+'\n\nUse the ? button inside the game for its full rules and scoring table.';
function closeGuide(){guidePanel.classList.remove('open');guideButton.focus();}
guideButton.addEventListener('click',()=>{guidePanel.classList.add('open');guideClose.focus();});
guideClose.addEventListener('click',closeGuide);
guidePanel.addEventListener('click',e=>{if(e.target===guidePanel)closeGuide();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&guidePanel.classList.contains('open'))closeGuide();});
frame.addEventListener('load',stopAll);
window.addEventListener('pagehide',stopAll);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAll();});
paint();
})();
