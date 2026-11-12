/* Browser automation runs independently of the Node reducer tests.
 * This intentionally measures UI, navigation, real asset responses and viewport geometry,
 * NOT real speaker playback or a physically handled smartphone.
 */
import {chromium} from 'playwright';
import {strict as assert} from 'node:assert';
import {mkdirSync,writeFileSync} from 'node:fs';
const BASE='http://127.0.0.1:8765/';
const games=['gilded-five','shut-the-box','liars-dice','bust-or-bank','generala','ten-of-a-kind','brain-raid'];
const widths=[320,375,390,430];
const report={timestamp:new Date().toISOString(),browser:'Chromium via GitHub Actions',tests:[],failures:[],warnings:[]};
mkdirSync('qa-evidence/screens',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
function check(ok,desc,info){if(!ok){report.failures.push({desc,info});console.error('FAIL',desc,JSON.stringify(info??{}));} else console.log('PASS',desc);}
async function pageAt(context,url){const p=await context.newPage();await p.goto(url,{waitUntil:'domcontentloaded'});return p;}
try{
 // Lobby is a real collection, never eight tiles or an accidentally linked legacy index.
 for(const width of widths){
  const context=await browser.newContext({viewport:{width,height:780},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await pageAt(context,BASE);
  check((await page.locator('.mobile-card').count())===7,'Lobby exactly seven entries @'+width);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  check(overflow<=8,'Lobby no horizontal overflow @'+width,{overflow});
  if(width===390)await page.screenshot({path:'qa-evidence/screens/collection-390.png',fullPage:true});
  await context.close();
 }
 // Each game: iframe loads, unique guide, real help and access to its saved state.
 for(const slug of games){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
  const page=await context.newPage();
  const errors=[],failedRequests=[],assetHits=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{
   if(r.url().includes('/assets/audio/'))assetHits.push({url:r.url().split('/').pop(),status:r.status()});
   if(r.status()>=400&&r.url().includes('/assets/'))failedRequests.push({url:r.url().split('/').pop(),status:r.status()});
  });
  await page.goto(BASE+'play.html?game='+slug,{waitUntil:'domcontentloaded'});
  const iframe=page.frameLocator('#game');
  await iframe.locator('body').waitFor({state:'attached',timeout:12000});
  const title=await page.locator('#title').innerText();
  const isLoaded=await iframe.locator('html').evaluate(el=>el.querySelector('#app')!==null||el.querySelector('.shell')!==null);
  check(isLoaded,'Game launched '+slug);
  await page.locator('#guide-toggle').click();
  check(await page.locator('#guide-panel.open').count()===1,'Game-specific guide opened '+slug);
  const guide=await page.locator('#guide-body').innerText();
  check(guide.length>75&&guide.includes('Signature moment'), 'Guide is not generic '+slug);
  await page.locator('#guide-close').click();
  const rules=slug==='gilded-five'?iframe.locator('#btnRules1'):iframe.locator('#btnRules');
  if(await rules.count()){
   await rules.click({timeout:8000});
   const shown=slug==='gilded-five'?await iframe.locator('#rules:not([hidden])').count():await iframe.locator('dialog#dlgRules[open]').count();
   check(shown>0,'Actual in-game rules open '+slug);
   if(slug==='gilded-five')await iframe.locator('[data-act="close"]').first().click().catch(()=>{});
   else await iframe.locator('body').press('Escape').catch(()=>{});
  }
  const geometry=await iframe.locator('body').evaluate(()=>{
   const vw=innerWidth,doc=document.documentElement;
   const header=document.querySelector('.topbar');
   const nav=header?[...header.querySelectorAll('a,button')].map(el=>{const b=el.getBoundingClientRect();return {name:el.getAttribute('aria-label')||el.textContent?.trim()?.slice(0,15),left:Math.round(b.left),right:Math.round(b.right),height:Math.round(b.height)};}):[];
   return {width:vw,scrollWidth:doc.scrollWidth,overflow:doc.scrollWidth-vw,nav};
  });
  report.tests.push({slug,stage:'lobby',title,geometry});
  if(geometry.overflow>15)report.warnings.push({slug,issue:'Game has horizontal overflow',pixels:geometry.overflow});
  const clipped=geometry.nav.filter(n=>n.left< -8||n.right>geometry.width+8||n.height<28);
  if(clipped.length)report.warnings.push({slug,issue:'Topbar controls clipped or too small',clipped});
  await page.screenshot({path:'qa-evidence/screens/'+slug+'-lobby-390.png'});
  if(slug==='gilded-five'){
   await iframe.locator('#btnStart').click({timeout:8000});
  } else {
   // btnB is the primary action dock control on all six other titles.
   const start=iframe.locator('#btnB');
   check(await start.isVisible(),'Setup primary action visible '+slug);
   await start.click({timeout:8000});
  }
  await page.waitForTimeout(350);
  const started=slug==='gilded-five'
   ? await iframe.locator('#setup[hidden]').count()===1
   : await iframe.locator('#app').getAttribute('data-view')==='game';
  check(started,'Actual game starts '+slug);
  await page.screenshot({path:'qa-evidence/screens/'+slug+'-playing-390.png'});
  // Standalone help is reachable again from gameplay.
  await page.locator('#guide-toggle').click();
  check(await page.locator('#guide-panel.open').count()===1,'Guide reachable in active game '+slug);
  await page.locator('#guide-close').click();
  // The original wrapper controls are independent and persisted.
  await page.locator('#effects').click();
  check(await page.locator('#effects').getAttribute('aria-pressed')==='false','Effects mute works '+slug);
  await page.locator('#effects').click();
  check(await page.locator('#effects').getAttribute('aria-pressed')==='true','Effects unmute works '+slug);
  await page.locator('#listen').click();
  check(await page.locator('#listen').getAttribute('aria-pressed')==='true','Voice enable works '+slug);
  const storage=await page.evaluate(()=>({fx:localStorage.getItem('pg-effects-off'),voice:localStorage.getItem('pg-quiet-voice')}));
  check(storage.fx==='no'&&storage.voice==='on','Separate audio choices saved '+slug,storage);
  // A genuine frame-sourced audio event should fetch a bundled recording.
  await iframe.locator('body').evaluate(()=>window.parent.postMessage({type:'pocket-audio',key:'dice'},'*'));
  await page.waitForTimeout(550);
  if(!assetHits.some(x=>x.url==='dice.mp3'&&x.status===200))
   report.warnings.push({slug,issue:'No observed successful dice.mp3 request',assetHits});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.frameLocator('#game').locator('body').waitFor({state:'attached'});
  const progress=await page.evaluate(()=>Object.entries(localStorage).filter(([key])=>key.endsWith('.game')||key.includes('game.v2')));
  report.tests.push({slug,stage:'refresh',storageKeys:progress.map(x=>x[0]),assets:assetHits.slice(0,12),errors,failedRequests});
  check(errors.length===0,'No browser JS exceptions '+slug,{errors});
  check(failedRequests.length===0,'No missing asset responses '+slug,{failedRequests});
  await context.close();
 }
} catch(e){report.failures.push({desc:'Browser suite aborted',message:String(e),stack:e.stack});console.error(e);}
finally{await browser.close();writeFileSync('qa-evidence/browser-report.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify({tests:report.tests.length,failures:report.failures.length,warnings:report.warnings.length}));
if(report.failures.length)process.exitCode=1;
