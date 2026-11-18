import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GAMES,start,next,view} from './engines.mjs';
const players=Array.from({length:8},(_,i)=>({id:'p'+i,name:'Player '+(i+1)}));
for(const [game] of GAMES){
 test(game+' starts with eight players, server rolls or bids and denies illegal moves',()=>{
  let s=start(game,players,'ABCD');
  assert.equal(s.status,'PLAYING');assert.equal(s.players.length,8);
  assert.equal(s.players[0].id,'p0');
  if(game==='liars-dice'){
   const privateView=view(game,s,'p0'),publicView=view(game,s,null);
   assert.ok(privateView.gameData.dice.p0.some(n=>n>0));
   assert.ok(privateView.gameData.dice.p1.every(n=>n===0));
   assert.ok(publicView.gameData.dice.p0.every(n=>n===0));
   s=next(game,s,'p0',{type:'BID',quantity:1,face:2});
   assert.equal(s.turnIndex,1);
   s=next(game,s,'p1',{type:'CHALLENGE'});
   assert.ok(['REVEAL','DONE'].includes(s.gameData.phase));
  }else if(game==='ten-of-a-kind'){
   assert.ok(s.gameData.boards.p0.dice.length===10);
   s=next(game,s,'p0',{type:'ROLL'});
   assert.equal(s.turnIndex,1);
  }else{
   s=next(game,s,'p0',{type:'ROLL'});
   assert.ok(s.gameData);
  }
  assert.throws(()=>next(game,s,'p1',{type:'HACK'}),/Move|Unsupported/i);
 });
}
