/* Browser-free soundtrack lifecycle test; not a substitute for speakers. */
import {readFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import vm from 'node:vm';
const code=readFileSync(new URL('../assets/game-music.js',import.meta.url),'utf8');
const slugs=['gilded-five','shut-the-box','liars-dice','bust-or-bank','generala','ten-of-a-kind','brain-raid'];
const urls=new Set();
for(const slug of slugs){
 const buttonEvents={},documentEvents={},windowEvents={};
 const button={attributes:{},dataset:{},addEventListener(k,fn){buttonEvents[k]=fn;},setAttribute(k,v){this.attributes[k]=v;}};
 const document={hidden:false,getElementById:id=>id==='bgm'?button:null,addEventListener(k,fn){documentEvents[k]=fn;}};
 const window={addEventListener(k,fn){windowEvents[k]=fn;}};
 const preferences=new Map();
 const localStorage={getItem:k=>preferences.get(k)??null,setItem(k,v){preferences.set(k,String(v));}};
 const audios=[];
 class Audio{
  constructor(src){this.src=src;this.paused=true;this.volume=0;this.events={};audios.push(this);}
  play(){this.paused=false;return Promise.resolve();}
  pause(){this.paused=true;}
  addEventListener(k,fn){this.events[k]=fn;}
 }
 vm.runInNewContext(code,{document,window,localStorage,location:{search:'?game='+slug},
   Audio,URLSearchParams,Date,setTimeout:()=>1,clearTimeout:()=>{}},{filename:'game-music.js'});
 assert.equal(audios.length,1,slug+' gets exactly one music player');
 const audio=audios[0],mixer=window.PocketGameboxGameMusic;
 assert.match(audio.src,/^https:\/\/cdn\.creativeclaw\.co\//);
 assert.equal(audio.loop,true);
 assert.equal(audio.volume,.14);
 assert.equal(button.attributes['aria-pressed'],'true');
 urls.add(audio.src);
 mixer.setVoiceActive(true);
 assert.ok(audio.volume<.03,slug+' ducks narration');
 mixer.setVoiceActive(false);
 assert.equal(audio.volume,.14);
 mixer.duckFor(900);
 assert.ok(audio.volume<.08,slug+' ducks dice and effects');
 buttonEvents.click();
 assert.equal(audio.paused,true,slug+' toggled OFF');
 assert.equal(preferences.get('pocket-gamebox.lobby-music-enabled'),'false');
 assert.equal(button.attributes['aria-pressed'],'false');
 document.hidden=true;documentEvents.visibilitychange();
 assert.equal(audio.paused,true,slug+' background pause');
 document.hidden=false;buttonEvents.click();
 assert.equal(preferences.get('pocket-gamebox.lobby-music-enabled'),'true');
 assert.equal(button.attributes['aria-pressed'],'true');
 windowEvents.pagehide();
 assert.equal(audio.paused,true,slug+' page exit');
 console.log('PASS',slug,'stream, voice/FX duck, mute memory and lifecycle');
}
assert.equal(urls.size,7,'all seven soundtrack files are distinct');
console.log('PASS seven individual original musical themes');
