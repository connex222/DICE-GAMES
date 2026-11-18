/* Premium lobby behaviours. Native links remain authoritative.
 * Cards open on click; large Play opens the most recently highlighted card.
 * No game logic, score data, audio or RNG is touched.
 */
(() => {
 'use strict';
 const cards=[...document.querySelectorAll('.desktop .aaa-card')];
 const play=document.getElementById('desktop-play');
 const caption=document.getElementById('desktop-play-title');
 if(!cards.length||!play||!caption)return;
 let selected=cards[0];
 function pick(card){
  if(!card||!cards.includes(card))return;
  selected=card;
  for(const item of cards){
   if(item===card)item.dataset.selected='true';
   else delete item.dataset.selected;
  }
  const title=card.querySelector('.aaa-card-name')?.textContent?.trim()||'GAME';
  caption.textContent='PLAY '+title.toUpperCase();
  play.setAttribute('aria-label','Play '+title);
 }
 for(let i=0;i<cards.length;i++){
  const card=cards[i];
  card.addEventListener('pointerenter',()=>pick(card));
  card.addEventListener('focus',()=>pick(card));
  card.addEventListener('keydown',e=>{
   if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
   e.preventDefault();
   const next=(i+(e.key==='ArrowRight'?1:cards.length-1))%cards.length;
   cards[next].focus();
  });
 }
 play.addEventListener('click',()=>{
  const href=selected?.getAttribute('href');
  if(href&&href.startsWith('play.html?game='))location.assign(href);
 });
 pick(cards[0]);
})();
