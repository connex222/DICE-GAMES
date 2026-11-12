/* Saved games stay in their original storage keys; no migration or engine mutation. */
(()=>{'use strict';
const gameKeys={
'gilded-five':'gildedFive.game.v2',
'shut-the-box':'shutthebox.v1.game',
'liars-dice':'liarsdice.v1.game',
'bust-or-bank':'bustorbank.v1.game',
'generala':'generala.v1.game',
'ten-of-a-kind':'tenofakind.v1.game',
'brain-raid':'brainraid.v2.game'
};
const recordKeys=['gildedFive.records.v1','shutthebox.v1.best','generala.v1.best','tenofakind.v1.best','brainraid.v2.best'];
function hasActiveGame(slug){
 try{
  const state=JSON.parse(localStorage.getItem(gameKeys[slug])||'null');
  return !!state&&(slug==='gilded-five'?state.phase==='play':state.status==='PLAYING');
 }catch(_){return false;}
}
function refresh(){
 for(const link of document.querySelectorAll('a[href^="play.html?game="]')){
  const slug=new URL(link.href,location.href).searchParams.get('game');
  if(!Object.hasOwn(gameKeys,slug))continue;
  const saved=hasActiveGame(slug);
  link.setAttribute('aria-label',(saved?'Continue saved game: ':'Play ')+slug.replaceAll('-',' '));
  if(link.classList.contains('mobile-card')){
   if(saved)link.dataset.progress='SAVED';else delete link.dataset.progress;
   const label=link.querySelector('.mobile-card-play');
   if(label)label.firstChild.textContent=saved?'CONTINUE ':'PLAY ';
  }
 }
}
function reset(){
 for(const k of Object.values(gameKeys).concat(recordKeys))localStorage.removeItem(k);
 refresh();
}
window.PocketGameboxProgress={refresh,reset,gameKeys};
refresh();
})();
