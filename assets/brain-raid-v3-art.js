/* Brain Raid Art 3.0: progressive enhancement for approved optional assets.
 * No gameplay event interception. Broken/missing images preserve SVG/CSS fallback. */
(() => {
 'use strict';
 const root=document.documentElement;
 const script=document.currentScript;
 const base=new URL('brain-raid-v3/',script.src);
 const load=(filename,klass)=>{
  const picture=new Image();
  picture.onload=()=>root.classList.add(klass);
  picture.onerror=()=>{}; // Keep the existing interactive vector fallback.
  picture.src=new URL(filename,base).href;
 };
 load('lobby-hero.webp','br-art-lobby');
 load('graveyard-atmosphere.webp','br-art-scene');
 load('roll-tray-atmosphere.webp','br-art-tray');
 load('winner-mascot.webp','br-art-winner');
 for(const name of ['horde','classic'])load('mode-'+name+'.webp','br-art-mode-'+name);
 for(const name of ['brain','feet','shot','genius','bomb','horde','toxic'])
  load('face-'+name+'.webp','br-face-'+name);
 for(const name of ['idle','happy','scared','dizzy','triumphant'])
  load('mascot-'+name+'.webp','br-mascot-'+name);
 const mascot=document.getElementById('mascot');
 if(!mascot)return;
 const syncMood=()=>{
  const svg=mascot.querySelector('svg[data-mood]');
  const mood=svg?.getAttribute('data-mood')||'idle';
  mascot.dataset.brMood=({party:'triumphant',hurt:'scared',sick:'dizzy'})[mood]||mood;
 };
 new MutationObserver(syncMood).observe(mascot,{subtree:true,childList:true,attributes:true,attributeFilter:['data-mood']});
 syncMood();
})();
