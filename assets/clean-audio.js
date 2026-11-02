/* Pocket Gamebox Alpha: enforce a persistent narration preference and block legacy browser TTS. */
(()=>{try{
 const synth=window.speechSynthesis;
 if(synth&&typeof synth.speak==='function'){
  synth.cancel();
  synth.speak=function(){return undefined;};
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)try{synth?.cancel()}catch(_){}});
 window.addEventListener('storage',e=>{if(e.key==='pg-quiet-voice'&&e.newValue!=='on')try{synth?.cancel()}catch(_){}});
}catch(_){}})();
(()=>{'use strict';const game=location.pathname.split('/').pop().replace('.html','');const fx={dice:'dice',zombie:'zombie'};const send=k=>{try{window.parent.postMessage({type:'pocket-audio',key:k},'*')}catch(_){}};window.PocketVoice={enabled:()=>localStorage.getItem('pg-quiet-voice')==='on',announce:()=>{send(game);return true},say:()=>true,match:()=>null,stop:()=>{},hasRecordedEvent:()=>false};window.PocketMixer={enabled:()=>localStorage.getItem('pg-quiet-voice')==='on',volume:()=>0.8,play:()=>null};window.PocketCreativeFX={play:key=>{send(fx[key]||key);return true}};})();