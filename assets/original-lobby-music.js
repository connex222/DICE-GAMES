/* Original Creative Claw soundtrack: Seven Small Victories. Independent from voice and SFX. */
(()=>{'use strict';
const key='pocket-gamebox.lobby-music-enabled', url='https://cdn.creativeclaw.co/u/f3e7a3b1/audio/fbe4d919-5dc1-49ed-b230-5525d9b8a37f.mp3';
const audio=new Audio();audio.src=url;audio.loop=true;audio.preload='none';audio.volume=.24;
let enabled=localStorage.getItem(key)!=='false';
const btn=null;
function update(){if(btn){btn.textContent=enabled?'♫ Music on':'♫ Music off';btn.setAttribute('aria-pressed',String(enabled));btn.title='Seven Small Victories — toggle soundtrack';}
document.querySelectorAll('#music,[data-action="music"]').forEach(b=>{b.setAttribute('aria-pressed',String(enabled));if(b.id==='music'){const dot=document.getElementById('music-ind');if(dot){dot.textContent=enabled?'ON':'OFF';dot.classList.toggle('off',!enabled)}}else{const last=b.lastElementChild;if(last)last.textContent='Music '+(enabled?'ON':'OFF')}});}
async function play(){if(!enabled||document.hidden)return;try{await audio.play()}catch(e){if(e?.name!=='NotAllowedError')console.warn('Music unavailable:',e?.message||e)}update()}
function pause(){audio.pause()}
function toggle(){enabled=!enabled;localStorage.setItem(key,String(enabled));if(enabled)play();else pause();update();return enabled}
if(btn){btn.type='button';btn.id='original-lobby-music';btn.style.cssText='position:fixed;bottom:max(14px,env(safe-area-inset-bottom));right:max(14px,env(safe-area-inset-right));z-index:45;padding:8px 12px;min-height:40px;border:1px solid #c5a365;border-radius:999px;background:#14202de8;color:#fff7da;font:600 13px system-ui,sans-serif;box-shadow:0 4px 18px #0007;cursor:pointer';btn.addEventListener('click',toggle);document.body.appendChild(btn);}
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else play()});
window.addEventListener('pagehide',pause);
document.addEventListener('pointerdown',()=>{if(enabled&&audio.paused)play()},{passive:true});
document.addEventListener('keydown',()=>{if(enabled&&audio.paused)play()});
window.PocketGameboxMusic={toggle,isEnabled:()=>enabled,play,pause};
update();play();
})();
