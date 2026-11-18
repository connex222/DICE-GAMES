import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {WebSocket} from 'ws';

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function launch(){
 const port=34000+Math.floor(Math.random()*20000);
 const origin='http://127.0.0.1:'+port;
 const child=spawn(process.execPath,['multiplayer/server-v2.mjs'],{
  env:{...process.env,PORT:String(port),NODE_ENV:'test',PUBLIC_ORIGIN:origin,WS_HEARTBEAT_INTERVAL_MS:'100'},
  stdio:['ignore','pipe','pipe']
 });
 let stderr='';
 child.stderr.on('data',chunk=>{stderr+=chunk.toString();});
 const sockets=[];
 async function ready(){
  for(let attempt=0;attempt<80;attempt++){
   if(child.exitCode!==null)break;
   try{if((await fetch(origin+'/health')).ok)return;}catch{}
   await sleep(100);
  }
  throw new Error('Server failed to start: '+stderr);
 }
 function connect(){
  return new Promise((resolve,reject)=>{
   const ws=new WebSocket(origin.replace('http','ws'),{headers:{Origin:origin}});
   sockets.push(ws);
   ws.once('open',()=>resolve(ws));
   ws.once('error',reject);
  });
 }
 function cleanup(){
  for(const ws of sockets)if(ws.readyState===WebSocket.OPEN)ws.close();
  if(child.exitCode===null)child.kill('SIGKILL');
 }
 return {origin,child,ready,connect,cleanup};
}
function waitFor(ws,predicate,timeoutMs=5000){
 return new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{ws.off('message',onMessage);reject(new Error('Timed out waiting for WebSocket response'));},timeoutMs);
  function onMessage(raw){
   let payload;try{payload=JSON.parse(raw.toString());}catch{return;}
   if(predicate(payload)){clearTimeout(timeout);ws.off('message',onMessage);resolve(payload);}
  }
  ws.on('message',onMessage);
 });
}
function send(ws,type,fields={}){ws.send(JSON.stringify({type,...fields}));}

test('GET /health reports JSON, uptime and the current room count',async()=>{
 const app=launch();
 try{
  await app.ready();
  const empty=await fetch(app.origin+'/health');
  assert.equal(empty.status,200);
  assert.match(empty.headers.get('content-type'),/application\/json/);
  const initial=await empty.json();
  assert.equal(initial.ok,true);
  assert.equal(initial.rooms,0);
  assert.ok(Number.isFinite(initial.uptime)&&initial.uptime>=0);
  const host=await app.connect();
  const hosted=waitFor(host,m=>m.type==='hosted');
  send(host,'host');
  await hosted;
  const response=await fetch(app.origin+'/health');
  assert.equal(response.status,200);
  const snapshot=await response.json();
  assert.equal(snapshot.rooms,1);
  assert.ok(snapshot.uptime>=initial.uptime);
 }finally{app.cleanup();}
});

test('unanswered heartbeat ping disconnects the player; their saved seat can rejoin',async()=>{
 const app=launch();
 try{
  await app.ready();
  const host=await app.connect();
  const hosted=waitFor(host,m=>m.type==='hosted');
  send(host,'host');
  const {code}=await hosted;
  const phone=await app.connect();
  const joined=waitFor(phone,m=>m.type==='joined');
  send(phone,'join',{code,name:'Sleepy phone'});
  const {id,token}=await joined;
  // The ws client normally automatically pongs; disable that for this one socket.
  phone.pong=()=>{};
  const disconnected=waitFor(host,m=>
   m.type==='state'&&m.players.some(p=>p.id===id&&p.connected===false),5000);
  const offline=await disconnected;
  assert.equal(offline.players.length,1,'Heartbeat must reserve rather than delete the seat');
  const replacement=await app.connect();
  const rejoined=waitFor(replacement,m=>m.type==='joined');
  const restored=waitFor(host,m=>
   m.type==='state'&&m.players.some(p=>p.id===id&&p.connected===true),5000);
  send(replacement,'resumePlayer',{code,token});
  assert.equal((await rejoined).id,id,'Rejoin must keep the original player id');
  assert.equal((await restored).players.length,1,'Rejoin must not duplicate player');
 }finally{app.cleanup();}
});

test('SIGTERM announces restart and closes phones and TV with WebSocket 1012',async()=>{
 const app=launch();
 try{
  await app.ready();
  const host=await app.connect();
  const hosted=waitFor(host,m=>m.type==='hosted');
  send(host,'host');
  const {code}=await hosted;
  const phone=await app.connect();
  const joined=waitFor(phone,m=>m.type==='joined');
  send(phone,'join',{code,name:'Guest'});
  await joined;
  const notifications=[host,phone].map(ws=>waitFor(ws,m=>m.type==='serverRestarting'));
  const closes=[host,phone].map(ws=>new Promise(resolve=>ws.once('close',resolve)));
  app.child.kill('SIGTERM');
  await Promise.all(notifications);
  assert.deepEqual(await Promise.all(closes),[1012,1012]);
 }finally{app.cleanup();}
});
