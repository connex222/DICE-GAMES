/* Run real seven-game UI sessions through the finished results screen.
 * Deterministic dice are injected ONLY in this Playwright process. No production
 * RNG, rule reducer, or game storage format is changed.
 * On-device sound listening is still a separate manual acceptance gate.
 */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const ROOT='http://127.0.0.1:8765/';
const SAVE={
  'gilded-five':'gildedFive.game.v2',
  'shut-the-box':'shutthebox.v1.game',
  'liars-dice':'liarsdice.v1.game',
  'bust-or-bank':'bustorbank.v1.game',
  'generala':'generala.v1.game',
  'ten-of-a-kind':'tenofakind.v1.game',
  'brain-raid':'brainraid.v2.game'
};
const ONE={name:'Test Player',isBot:false};
const configs={
 'shut-the-box':{key:'shutthebox.v1.setup',value:{tiles:9,rounds:1,botSkill:'expert',oneDie:false,shutWins:false,roster:[ONE]}},
 'liars-dice':{key:'liarsdice.v1.setup',value:{aceRule:'standard',roster:[ONE,{name:'Opponent',isBot:false}]}},
 'bust-or-bank':{key:'bustorbank.v1.roster',value:[ONE]},
 'generala':{key:'generala.v1.setup',value:{servidaWin:false,aceHigh:false,roster:[ONE]}},
 'ten-of-a-kind':{key:'tenofakind.v1.setup',value:{mode:'turns',limit:45,speed:'medium',roster:[ONE]}},
 'brain-raid':{key:'brainraid.v2.setup',value:{mode:'classic',botStyle:'careful',roster:[ONE]}}
};
const report={created:new Date().toISOString(),purpose:'Full real-browser button-to-results game sessions, replay and corrupt saved-state recovery',cases:[],failures:[]};
mkdirSync('qa-evidence/finished',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
async function begin(slug){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const cfg=configs[slug]||null;
 await context.addInitScript(({cfg,slug})=>{
   if(cfg&&location.pathname.endsWith('/play.html'))localStorage.setItem(cfg.key,JSON.stringify(cfg.value));
   // Explicitly fake dice only in the isolated test browser, never the app itself.
   const orig=window.crypto.getRandomValues.bind(window.crypto);
   Object.defineProperty(window.crypto,'getRandomValues',{configurable:true,value(a){
     if(a instanceof Uint32Array){a.fill(slug==='liars-dice'?1:0);return a;}
     return orig(a);
   }});
   const originalPlay=HTMLMediaElement.prototype.play;
   window.__qaAudio=[];
   HTMLMediaElement.prototype.play=function(...args){
     window.__qaAudio.push({source:(this.currentSrc||this.src||'').split('/').pop(),t:performance.now()});
     return originalPlay.apply(this,args);
   };
 },{cfg,slug});
 const page=await context.newPage();
 page.setDefaultTimeout(8500);
 const errors=[],net=[];
 page.on('pageerror',e=>errors.push(String(e.message)));
 page.on('response',r=>{
   if(r.url().includes('/assets/audio/'))net.push({asset:r.url().split('/').pop(),status:r.status()});
 });
 await page.goto(ROOT+'play.html?game='+slug,{waitUntil:'domcontentloaded'});
 const frame=page.frameLocator('#game');
 await frame.locator('body').waitFor({timeout:15000});
 const random=await frame.locator('body').evaluate(()=>{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]});
 assert.equal(random,slug==='liars-dice'?1:0,'Deterministic test dice active');
 await frame.locator(slug==='gilded-five'?'#btnStart':'#btnB[data-act="start"]').click();
 return {context,page,frame,errors,net};
}
const state=async(page,slug)=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)||'null'),SAVE[slug]);
const act=async(frame,action)=>frame.locator('#btnB[data-act="'+action+'"], #btnA[data-act="'+action+'"]').first().click({timeout:12500});
const done=s=>s?.status==='GAME_OVER'||s?.phase==='over';
const settle=async(page,slug,{timeout=12000}={})=>page.waitForFunction(k=>{
 const s=JSON.parse(localStorage.getItem(k)||'null');
 return s?.status==='GAME_OVER'||s?.phase==='over';
},SAVE[slug],{timeout});
async function session(slug,fn){
 let t;
 try {
   t=await begin(slug);
   const initial=await state(t.page,slug);
   assert.ok(initial && !done(initial),slug+' game starts');
   const steps=await fn(t);
   await settle(t.page,slug);
   const final=await state(t.page,slug);
   assert.ok(done(final),slug+' reached game over');
   const results=t.frame.locator(slug==='gilded-five'?'#results:not([hidden])':'#dlgOver[open]');
   await results.waitFor({state:'visible',timeout:16000});
   const headline=await results.innerText();
   assert.ok(headline.length>14,slug+' real result screen populated');
   await t.page.screenshot({path:'qa-evidence/finished/'+slug+'-result.png'});
   const screenshot='qa-evidence/finished/'+slug+'-result.png';
   // Replay must start another session, clearing the previous result UI.
   if(slug==='gilded-five'){
     await t.frame.locator('#resRematch').click();
   }else{
     await t.frame.locator('#dlgOver [data-act="rematch"]').click();
   }
   const fresh=await state(t.page,slug);
   assert.ok(fresh&&!done(fresh),slug+' rematch begins');
   assert.equal(t.errors.length,0,slug+' no uncaught JS exceptions '+JSON.stringify(t.errors));
   if(slug!=='liars-dice'){
     assert.ok(t.net.some(x=>x.status>=200&&x.status<300&&x.asset.includes('dice')),slug+' actual recorded dice effect requested');
   }
   report.cases.push({slug,status:'PASS',steps,headline:headline.slice(0,500),screenshot,initialStatus:initial.status||initial.phase,finalStatus:final.status||final.phase,rematchStatus:fresh.status||fresh.phase,errors:t.errors,recordedAudioRequests:t.net.slice(0,20),playedAudio:await t.page.evaluate(()=>window.__qaAudio.slice(0,20))});
   console.log('PASS COMPLETE UI GAME',slug,'steps',steps,'result:',headline.replace(/\s+/g,' ').slice(0,150));
 }catch(e){
   report.failures.push({slug,error:String(e),stack:e.stack});
   console.error('FAIL COMPLETE UI GAME',slug,e.stack||String(e));
   if(t)try{await t.page.screenshot({path:'qa-evidence/finished/'+slug+'-failure.png'});}catch{}
 }finally{if(t)await t.context.close();}
}
await session('shut-the-box',async({page,frame})=>{
 let actions=0;
 await act(frame,'roll2');actions++;
 await frame.locator('#tiles [data-t="2"]').click();actions++;
 await act(frame,'shut');actions++;
 await act(frame,'roll2');actions++;
 assert.ok(done(await state(page,'shut-the-box')),'blocked roll ends solo game');
 return actions;
});
await session('liars-dice',async({page,frame})=>{
 let actions=0;
 for(let n=0;n<7&&!done(await state(page,'liars-dice'));n++){
   await act(frame,'handoff'); actions++;
   await frame.locator('#faces [data-face="6"]').click();actions++;
   await act(frame,'bid');actions++;
   await act(frame,'handoff');actions++;
   await act(frame,'liar');actions++;
   const s=await state(page,'liars-dice');
   assert.equal(s.gameData.reveal.loserId,'p1','False sixes bid makes bidder lose a die');
   if(!done(s)){await act(frame,'next');actions++;}
 }
 return actions;
});
await session('bust-or-bank',async({page,frame})=>{
 let actions=0;
 for(let i=0;i<9&&!done(await state(page,'bust-or-bank'));i++){
   await act(frame,'roll');actions++;
   await frame.locator('#board .slot:not([disabled])').first().waitFor({timeout:7500});
   for(let j=0;j<6;j++){await frame.locator('#board .slot[data-index="'+j+'"]').click();actions++;}
   await act(frame,'bank');actions++;
 }
 return actions;
});
await session('generala',async({page,frame})=>{
 let actions=0;
 for(let i=0;i<12&&!done(await state(page,'generala'));i++){
   await act(frame,'roll');actions++;
   const cell=frame.locator('#card [data-cat]:not([disabled])').first();
   await cell.waitFor({timeout:9000});
   await cell.click();actions++;
   await act(frame,'score');actions++;
 }
 return actions;
});
await session('ten-of-a-kind',async({page,frame})=>{
 let actions=0;
 // All ten dice show one with the test-only seeded generator.
 // The first legitimate roll must end a real turn-mode game.
 await act(frame,'roll');actions++;
 return actions;
});
await session('brain-raid',async({page,frame})=>{
 let actions=0;
 for(let i=0;i<12&&!done(await state(page,'brain-raid'));i++){
   await act(frame,'roll');actions++;
   await act(frame,'stop');actions++;
   if(!done(await state(page,'brain-raid'))){await act(frame,'next');actions++;}
 }
 return actions;
});
await session('gilded-five',async({page,frame})=>{
 let actions=0;
 for(let i=0;i<15&&!done(await state(page,'gilded-five'));i++){
   await frame.locator('#btnRoll').click({timeout:13000});actions++;
   const cell=frame.locator('td[data-key]').first();
   await cell.waitFor({state:'visible',timeout:11000});
   const label=await cell.getAttribute('aria-label')||'';
   await cell.click();actions++;
   if(label.startsWith('Score 0')){await cell.click();actions++;}
   await page.waitForTimeout(180);
 }
 return actions;
});
await browser.close();
writeFileSync('qa-evidence/finished/report.json',JSON.stringify(report,null,2));
console.log('UI END-TO-END TOTAL',report.cases.length,'completed;',report.failures.length,'failed');
if(report.failures.length)process.exitCode=1;
