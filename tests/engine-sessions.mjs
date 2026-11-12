/* Rule-neutral, deterministic reducer sessions using the actual production engines.
 * Not a substitute for UI browser, mobile-device, or recorded audio testing. */
import {readFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import vm from 'node:vm';
const read=slug=>readFileSync(new URL('../games/'+slug+'.html',import.meta.url),'utf8');
function engine(slug,names=['Engine']){
 const page=read(slug),a=page.indexOf('// #region core'),b=page.indexOf('// #endregion',a);
 assert.ok(a>=0&&b>a,slug+' production core');
 const sandbox={};
 vm.runInNewContext(page.slice(a,b)+'\nglobalThis.__exports={'+names.join(',')+'};',sandbox,{filename:slug+'.core.js',timeout:3000});
 return sandbox.__exports;
}
const human=id=>({id,name:id,isLocal:true,isBot:false});
function step(E,s,a){
 const next=E.reduce(s,a);
 assert.notEqual(next,s,'Rejected legal action '+a.type+' by '+(a.actorId||'host'));
 return next;
}
function assertComplete(name,s){
 assert.equal(s.status,'GAME_OVER',name+' completed');
 console.log('PASS: COMPLETE production engine session: '+name);
}
{
 const {Engine:E,Combos}=engine('shut-the-box',['Engine','Combos']);
 let s=step(E,E.createState(),{type:'START_GAME',players:[human('p1')],options:{tiles:9,rounds:1,oneDie:false,shutWins:false}});
 assert.equal(E.reduce(s,{type:'SHUT',actorId:'p1',tiles:[1]}),s,'cannot close tiles before rolling');
 for(let i=0;i<40&&s.status==='PLAYING';i++){
  const g=s.gameData;
  if(g.phase==='READY')s=step(E,s,{type:'ROLL',actorId:'p1',count:2,values:[6,6]});
  else if(g.phase==='CHOOSING'){
   const combo=Combos.options(g.open,g.total)[0];
   assert.ok(combo>0);
   s=step(E,s,{type:'SHUT',actorId:'p1',tiles:Combos.tilesOf(combo)});
  }else if(g.phase==='TURN_OVER')s=step(E,s,{type:'NEXT_TURN',actorId:'p1'});
  else assert.fail('Unexpected Shut the Box phase '+g.phase);
 }
 assertComplete('Shut the Box (solo, nine tiles)',s);
}
{
 const {Engine:E}=engine('liars-dice');
 const dice=s=>Object.fromEntries(s.players.filter(p=>s.gameData.diceCount[p.id]>0).map(p=>[p.id,Array(s.gameData.diceCount[p.id]).fill(2)]));
 let s=step(E,E.createState(),{type:'START_GAME',players:[human('p1'),human('p2')],options:{aceRule:'standard'},dice:{p1:Array(5).fill(2),p2:Array(5).fill(2)}});
 assert.equal(E.reduce(s,{type:'CHALLENGE',actorId:'p2'}),s,'cannot challenge before first bid');
 for(let n=0;n<6&&s.status==='PLAYING';n++){
  assert.equal(E.currentPlayer(s).id,'p1','loser should bid again');
  s=step(E,s,{type:'BID',actorId:'p1',quantity:1,face:6});
  s=step(E,s,{type:'CHALLENGE',actorId:'p2'});
  if(s.status==='PLAYING')s=step(E,s,{type:'NEXT_ROUND',actorId:E.currentPlayer(s).id,dice:dice(s)});
 }
 assertComplete("Liar's Dice (five challenges)",s);
 assert.equal(s.gameData.winnerId,'p2');
}
{
 const {Engine:E}=engine('bust-or-bank');
 let s=step(E,E.createState(),{type:'START_GAME',players:[human('p1')]});
 assert.equal(E.reduce(s,{type:'BANK',actorId:'p1'}),s,'no bank in READY');
 for(let n=0;n<20&&s.status==='PLAYING';n++){
  s=step(E,s,{type:'ROLL',actorId:'p1',values:Array(6).fill(1)});
  assert.equal(s.gameData.phase,'SELECTING');
  for(let i=0;i<6;i++)s=step(E,s,{type:'TOGGLE_DIE',actorId:'p1',index:i});
  s=step(E,s,{type:'BANK',actorId:'p1'});
 }
 assertComplete('Bust or Bank (bank to 10,000)',s);
 assert.ok(s.players[0].score>=10000);
}
{
 const {Engine:E}=engine('generala');
 let s=step(E,E.createState(),{type:'START_GAME',players:[human('p1'),human('p2')],options:{servidaWin:false,aceHigh:false}});
 assert.equal(E.reduce(s,{type:'SCORE',actorId:'p1',category:'ones'}),s,'cannot score before rolling');
 for(let n=0;n<40&&s.status==='PLAYING';n++){
  const id=E.currentPlayer(s).id;
  s=step(E,s,{type:'ROLL',actorId:id,values:Array(5).fill(1)});
  const card=s.gameData.cards[id];
  const category=Object.keys(card).find(k=>card[k]===null);
  assert.ok(category);
  s=step(E,s,{type:'SCORE',actorId:id,category});
 }
 assertComplete('Generala (two full scorecards)',s);
 assert.equal(Object.values(s.gameData.cards).flatMap(c=>Object.values(c)).filter(v=>v===null).length,0);
}
{
 const {Engine:E}=engine('ten-of-a-kind');
 for(const mode of ['turns','race']){
  const starting=[1,2,3,4,5,6,1,2,3,4];
  let s=step(E,E.createState(),{type:'START_GAME',players:[human('p1')],options:{mode,timeLimit:30},dice:{p1:starting},at:1000});
  if(mode==='race'){
   s=step(E,s,{type:'GO',at:2000,dice:{p1:starting}});
   s=step(E,s,{type:'PAUSE',at:2500});
   assert.equal(E.reduce(s,{type:'LOCK',actorId:'p1',index:0}),s,'cannot lock while paused');
   s=step(E,s,{type:'RESUME',at:2600});
  }
  s=step(E,s,{type:'LOCK',actorId:'p1',index:0});
  assert.equal(E.reduce(s,{type:'LOCK',actorId:'p1',index:1}),s,'cannot lock inconsistent face');
  s=step(E,s,{type:'ROLL',actorId:'p1',values:Array(9).fill(1),at:3100});
  assertComplete('Ten of a Kind ('+mode+')',s);
  assert.ok(s.gameData.boards.p1.dice.every(d=>d.v===1));
 }
}
{
 const {Engine:E}=engine('brain-raid');
 for(const mode of ['classic','horde']){
  let s=step(E,E.createState(),{type:'START_GAME',players:[human('p1')],options:{mode}});
  const target=mode==='classic'?13:25,handSize=mode==='classic'?3:6;
  for(let n=0;n<25&&s.status==='PLAYING';n++){
   const plan=E.planRoll(s.gameData.turn,mode);
   s=step(E,s,{type:'ROLL',actorId:'p1',draws:plan.cup.slice(0,plan.need),faces:Array(handSize).fill(0)});
   assert.equal(s.gameData.phase,'DECIDE','all-first-face rolls avoid shots in controlled session');
   s=step(E,s,{type:'STOP',actorId:'p1'});
   if(s.status==='PLAYING')s=step(E,s,{type:'NEXT_TURN',actorId:'p1'});
  }
  assertComplete('Brain Raid ('+mode+')',s);
  assert.ok(s.players[0].score>=target);
 }
}
{
 // A fully filled Gilded Five scorecard via the production scoring module,
 // NOT a browser/controller end-to-end gameplay test.
 const src=read('gilded-five'),a=src.indexOf('/*RULES-START*/'),b=src.indexOf('/* ================= storage',a);
 assert.ok(a>=0&&b>a,'Gilded Five pure scoring module');
 const sb={};
 vm.runInNewContext(src.slice(a,b)+'\nglobalThis.__test={CATS,rawScore,turnOptions};',sb,{filename:'gilded-five.scoring.js',timeout:3000});
 const {CATS,rawScore,turnOptions}=sb.__test;
 const card=Object.fromEntries(CATS.map(c=>[c.id,null]));
 const faces={ones:[1,1,1,1,1],twos:[2,2,2,2,2],threes:[3,3,3,3,3],fours:[4,4,4,4,4],fives:[5,5,5,5,5],sixes:[6,6,6,6,6],threeK:[4,4,4,2,6],fourK:[5,5,5,5,1],full:[2,2,3,3,3],smS:[1,2,3,4,6],lgS:[1,2,3,4,5],chance:[6,6,3,2,1],yahtzee:[6,6,6,6,6]};
 for(const cat of CATS){
  const options=turnOptions(card,faces[cat.id]);
  assert.ok(options.allowed.has(cat.id),'legal scoring category '+cat.id);
  card[cat.id]=rawScore(cat.id,faces[cat.id],options.joker);
  assert.ok(Number.isInteger(card[cat.id])&&card[cat.id]>=0);
 }
 assert.equal(CATS.length,13);
 assert.ok(Object.values(card).every(x=>x!==null));
 assert.equal(rawScore('yahtzee',[6,6,6,6,6],false),50);
 console.log('PASS: COMPLETE scorecard simulation: Gilded Five (classic, thirteen scoring boxes)');
}
console.log('NOTE: reducer/scoring sessions are NOT browser sessions or audio/touch evidence.');
