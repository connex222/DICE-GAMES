import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { randomInt } from 'node:crypto';

const dice = n => Array.from({length:n},()=>randomInt(1,7));
const shuffleDraw=(source,count)=>{const pool=[...source],items=[];for(let i=0;i<count;i++)items.push(pool.splice(randomInt(pool.length),1)[0]);return items;};
export const GAMES=[
 ['shut-the-box','Shut the Box'],['gilded-five','Gilded Five'],['liars-dice',"Liar's Dice"],
 ['bust-or-bank','Bust or Bank'],['generala','Generala'],['ten-of-a-kind','Ten of a Kind'],['brain-raid','Brain Raid']
];
const adapters=new Map();
function html(name){return readFileSync(fileURLToPath(new URL('../games/'+name+'.html',import.meta.url)),'utf8');}
function loadEngine(name){
 const raw=html(name);
 const begin=raw.lastIndexOf('/* ---------- 1.',raw.indexOf('const Engine ='));
 const end=raw.indexOf('})();',raw.indexOf('const Engine ='))+4;
 if(begin<0||end<begin)throw Error('Core rule region not found: '+name);
 let script=raw.slice(begin,end).replace(/maxPlayers:\s*[46]/,'maxPlayers: 8');
 const context=vm.createContext(Object.create(null),{codeGeneration:{strings:false,wasm:false}});
 const obj=vm.runInContext(script+'\n;({Engine,RULES})',context,{timeout:1200,filename:name+'.rules'});
 if(!obj?.Engine?.reduce)throw Error('Missing rule reducer: '+name);
 return obj;
}
for(const name of ['shut-the-box','liars-dice','bust-or-bank','generala','ten-of-a-kind','brain-raid'])adapters.set(name,loadEngine(name));
const RULES_GILDED=(()=>{
 const raw=html('gilded-five');
 const a=raw.indexOf('/*RULES-START*/'),b=raw.indexOf('/*RULES-END*/');
 if(a<0||b<0)throw Error('Gilded Five scoring rules missing');
 const ctx=vm.createContext(Object.create(null),{codeGeneration:{strings:false,wasm:false}});
 return vm.runInContext(raw.slice(a,b)+'\n;({CATS,turnOptions,rawScore,totals})',ctx,{timeout:1200});
})();
const {CATS,turnOptions,rawScore,totals}=RULES_GILDED;
const validGame=game=>GAMES.some(([id])=>id===game);
export function start(game,players,code){
 if(!validGame(game))throw Error('Choose a valid game');
 if(!Array.isArray(players)||players.length<2||players.length>8)throw Error('Choose between two and eight players');
 if(game==='gilded-five'){
  const blank=()=>Object.fromEntries(CATS.map(c=>[c.id,null]));
  return {gameId:'gilded-five',roomCode:code,status:'PLAYING',turnIndex:0,players:players.map(p=>({id:p.id,name:p.name,score:0,cards:[{s:blank(),yb:0}]})),gameData:{phase:'READY',dice:[],held:[],rolls:0,round:1,winnerIds:[]},lastAction:{type:'START_GAME'}};
 }
 const {Engine}=adapters.get(game);
 let a={type:'START_GAME',players:players.map(p=>({id:p.id,name:p.name,isLocal:false,isBot:false})),options:{}};
 if(game==='liars-dice'){
  const need=Engine.diceNeeded(Engine.createState(code),a);
  a.dice=Object.fromEntries(Object.entries(need).map(([id,n])=>[id,dice(n)]));
 }
 if(game==='ten-of-a-kind'){a.options={mode:'turns'};a.at=Date.now();a.dice=Object.fromEntries(players.map(p=>[p.id,dice(10)]));}
 const s=Engine.reduce(Engine.createState(code),a);
 if(s.status!=='PLAYING')throw Error('Original '+game+' engine rejected game start');
 return s;
}
export function next(game,state,actorId,request){
 if(!request||typeof request.type!=='string')throw Error('Invalid move');
 if(game==='gilded-five')return gildedNext(state,actorId,request);
 const {Engine}=adapters.get(game);
 const typ=request.type;
 const allowed={
  'shut-the-box':['ROLL','SHUT','NEXT_TURN'],
  'liars-dice':['BID','CHALLENGE','NEXT_ROUND'],
  'bust-or-bank':['ROLL','TOGGLE_DIE','BANK','PASS'],
  'generala':['ROLL','TOGGLE_HOLD','SCORE'],
  'ten-of-a-kind':['LOCK','ROLL'],
  'brain-raid':['ROLL','STOP','NEXT_TURN']
 };
 if(!allowed[game]?.includes(typ))throw Error('Move is not allowed for this game');
 // Input never controls dice or clock; actions are whitelisted and the engine validates them.
 const a={type:typ,actorId};
 if(typ==='ROLL'){
  if(game==='brain-raid'){
   if(!Engine.canRoll(state))throw Error('Finish your current turn first');
   const g=state.gameData,plan=Engine.planRoll(g.turn,g.mode);
   a.draws=shuffleDraw(plan.cup,plan.need);
   a.faces=Array.from({length:plan.need+g.turn.runners.length},()=>randomInt(6));
  }else if(game==='shut-the-box'){a.count=request.count===1?1:2;a.values=dice(a.count);}
  else if(game==='ten-of-a-kind'){
   const board=state.gameData.boards[actorId];
   if(!board)throw Error('Unknown dice board');
   a.values=dice(board.dice.filter(x=>!x.locked).length);a.at=Date.now();
  }else a.values=dice(Engine.diceToRoll(state));
 }else if(typ==='NEXT_ROUND'&&game==='liars-dice'){
  const need=Engine.diceNeeded(state,a);
  a.dice=Object.fromEntries(Object.entries(need).map(([id,n])=>[id,dice(n)]));
 }else if(typ==='SHUT'){
  a.tiles=Array.isArray(request.tiles)?request.tiles.slice(0,12):[];
 }else if(typ==='BID'){
  a.quantity=request.quantity;a.face=request.face;
 }else if(typ==='SCORE'){a.category=request.category;}
 else if(typ==='TOGGLE_DIE'||typ==='TOGGLE_HOLD'||typ==='LOCK'){a.index=request.index;}
 const s=Engine.reduce(state,a);
 if(s===state)throw Error('That action is not allowed in the current game state');
 return s;
}
function gildedNext(state,actorId,a){
 if(state.status!=='PLAYING'||state.players[state.turnIndex].id!==actorId)throw Error('Not your turn');
 let s=structuredClone(state),g=s.gameData,p=s.players[s.turnIndex];
 if(a.type==='ROLL'){
  if(g.rolls>=3)throw Error('Maximum three rolls');
  if(!g.rolls){g.dice=dice(5);g.held=Array(5).fill(false);}
  else {for(let i=0;i<5;i++)if(!g.held[i])g.dice[i]=randomInt(1,7);}
  g.rolls++;g.phase='ROLLED';
 }else if(a.type==='TOGGLE_HOLD'){
  if(g.phase!=='ROLLED'||g.rolls>=3||!Number.isInteger(a.index)||a.index<0||a.index>=5)throw Error('Cannot hold that die');
  g.held[a.index]=!g.held[a.index];
 }else if(a.type==='SCORE'){
  if(g.phase!=='ROLLED'||!CATS.some(c=>c.id===a.category))throw Error('Roll before scoring');
  const opts=turnOptions(p.cards[0].s,g.dice);
  if(!opts.allowed.has(a.category))throw Error('This scoring category is not available');
  p.cards[0].s[a.category]=rawScore(a.category,g.dice,opts.joker);
  if(opts.bonus)p.cards[0].yb++;
  p.score=totals(p).grand;
  if(s.players.every(x=>CATS.every(c=>x.cards[0].s[c.id]!==null))){
   s.status='GAME_OVER';g.phase='DONE';const top=Math.max(...s.players.map(x=>x.score));g.winnerIds=s.players.filter(x=>x.score===top).map(x=>x.id);
  }else{
   s.turnIndex=(s.turnIndex+1)%s.players.length;
   if(s.turnIndex===0)g.round++;
   g.phase='READY';g.rolls=0;g.held=[];g.dice=[];
  }
 }else throw Error('Unsupported move');
 s.lastAction={type:a.type,actorId,at:Date.now()};
 return s;
}
export function view(game,state,viewerId=null){
 if(game==='liars-dice')return adapters.get(game).Engine.viewFor(state,viewerId);
 return state;
}
export function current(game,state){
 if(state.status!=='PLAYING')return null;
 if(game==='ten-of-a-kind'&&state.gameData.mode==='race')return null;
 return state.players[state.turnIndex]?.id||null;
}
export function publicScores(state){return state.players.map(p=>({id:p.id,name:p.name,score:p.score}));}
