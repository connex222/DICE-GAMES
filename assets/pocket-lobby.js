/* Reflect existing save files without changing or migrating game state. */
(()=>{'use strict';
const keys={'gilded-five':'gildedFive.game.v2','shut-the-box':'shutthebox.v1.game','liars-dice':'liarsdice.v1.game','bust-or-bank':'bustorbank.v1.game','generala':'generala.v1.game','ten-of-a-kind':'tenofakind.v1.game','brain-raid':'brainraid.v2.game'};
function hasActiveGame(slug){
 try{
  const state=JSON.parse(localStorage.getItem(keys[slug])||'null');
  return !!state&&(slug==='gilded-five'?state.phase==='play':state.status==='PLAYING');
 }catch(_){return false;}
}
for(const link of document.querySelectorAll('a[href^="play.html?game="]')){
 const slug=new URL(link.href,location.href).searchParams.get('game');
 if(!Object.hasOwn(keys,slug))continue;
 const saved=hasActiveGame(slug);
 if(saved){
  link.setAttribute('aria-label','Open '+slug.replaceAll('-',' ')+' — saved game available');
  if(link.classList.contains('mobile-card')){
   link.dataset.progress='SAVED';
   const label=link.querySelector('.mobile-card-play');
   if(label)label.firstChild.textContent='CONTINUE ';
  }
 }
}
})();
