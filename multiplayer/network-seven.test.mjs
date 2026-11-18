import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {WebSocket} from 'ws';
const port=31000+Math.floor(Math.random()*20000),origin='http://127.0.0.1:'+port;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function open(){
 return await new Promise((resolve,reject)=>{
  const ws=new WebSocket(origin.replace('http','ws'),{headers:{Origin:origin}});
  ws.once('open',()=>resolve(ws));ws.once('error',reject);
 });
}
function wait(ws,match){
 return new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{ws.off('message',onMsg);reject(new Error('Timeout waiting for '+match.toString()));},5000);
  function onMsg(raw){let d;try{d=JSON.parse(raw.toString())}catch{return;}
   if(match(d)){clearTimeout(timeout);ws.off('message',onMsg);resolve(d);}
  }
  ws.on('message',onMsg);
 });
}
function send(ws,type,code,other){ws.send(JSON.stringify({type,code,...other}));}
test('All seven hosted rooms join by QR and show synchronised private phone views',async()=>{
 const child=spawn(process.execPath,['multiplayer/server-v2.mjs'],{
  env:{...process.env,PORT:String(port),NODE_ENV:'test',PUBLIC_ORIGIN:origin}
 });
 const sockets=[];
 try{
  let online=false;
  for(let i=0;i<80;i++){try{online=(await fetch(origin+'/health')).ok;if(online)break}catch{}await sleep(100);}
  assert.ok(online,'Server did not start');
  for(const game of ['shut-the-box','gilded-five','liars-dice','bust-or-bank','generala','ten-of-a-kind','brain-raid']){
   const h=await open();sockets.push(h);
   const hosted=wait(h,d=>d.type==='hosted');send(h,'host');
   const {code}=await hosted;
   const qr=await fetch(origin+'/qr?code='+code);
   assert.equal(qr.status,200,game+' QR');
   assert.match(await qr.text(),/<svg/);
   const joins=[];
   for(let i=0;i<2;i++){
    const p=await open();sockets.push(p);
    const joined=wait(p,d=>d.type==='joined');send(p,'join',code,{name:'Guest '+i});
    joins.push({ws:p,...await joined});
   }
   const chosen=wait(h,d=>d.type==='state'&&d.game===game);
   send(h,'chooseGame',code,{game});await chosen;
   const ready=wait(h,d=>d.type==='state'&&d.phase==='PLAYING'&&d.game===game);
   const playerView=wait(joins[0].ws,d=>d.type==='state'&&d.phase==='PLAYING');
   send(h,'start',code);
   const tv=await ready,phone=await playerView;
   assert.equal(tv.players.length,2);assert.equal(phone.players.length,2);
   assert.equal(phone.state.status,'PLAYING');
   if(game==='liars-dice'){
    const g=tv.state.gameData,p=phone.state.gameData;
    assert.ok(Object.values(g.dice).every(v=>v.every(x=>x===0)),'TV leaked secret dice');
    assert.ok(p.dice[joins[0].id].some(x=>x>0),'Phone missing its own dice');
    assert.ok(p.dice[joins[1].id].every(x=>x===0),'Phone leaked opponent dice');
   }
   const denial=wait(joins[1].ws,d=>d.type==='error');
   send(joins[1].ws,'action',code,{action:{type:'ROLL',values:[6,6,6,6,6]}});
   assert.match((await denial).message,/Wait until it is your turn|not allowed|Wait for your turn/i,game+' action authority');
   const back=wait(h,d=>d.type==='state'&&d.phase==='LOBBY');
   send(h,'returnLobby',code);
   assert.equal((await back).players.length,2,'Return to lobby retains both phones');
  }

  // Full eight-handset acceptance at the transport level, plus a ninth rejection.
  const h8=await open();sockets.push(h8);
  const hc=wait(h8,d=>d.type==='hosted');send(h8,'host');
  const {code:room8}=await hc;
  for(let i=0;i<8;i++){
   const p=await open();sockets.push(p);
   const joined=wait(p,d=>d.type==='joined');
   send(p,'join',room8,{name:'Eight '+i});await joined;
  }
  const extra=await open();sockets.push(extra);
  const full=wait(extra,d=>d.type==='error');
  send(extra,'join',room8,{name:'Ninth player'});
  assert.match((await full).message,/full|eight/i);
  const started=wait(h8,d=>d.type==='state'&&d.phase==='PLAYING');
  send(h8,'start',room8);
  assert.equal((await started).players.length,8);
 } finally {for(const ws of sockets)try{ws.close()}catch{}child.kill('SIGTERM');}
});
