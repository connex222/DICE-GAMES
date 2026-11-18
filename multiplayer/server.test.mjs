import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { WebSocket } from 'ws';
const port=30000+Math.floor(Math.random()*20000);
const base='http://127.0.0.1:'+port;
async function waitReady(){
 for(let i=0;i<80;i++){
  try{const r=await fetch(base+'/health');if(r.ok)return;}catch{}
  await new Promise(r=>setTimeout(r,100));
 }
 throw Error('Server not ready');
}
function connect(){
 return new Promise((resolve,reject)=>{
  const ws=new WebSocket(base.replace('http','ws'));
  ws.once('open',()=>resolve(ws));ws.once('error',reject);
 });
}
function send(ws,type,other={}){ws.send(JSON.stringify({type,...other}));}
function next(ws,predicate=()=>true){
 return new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>{ws.off('message',onMessage);reject(new Error('Timed out waiting for server event'));},3500);
  const onMessage=raw=>{
   try{const msg=JSON.parse(raw.toString());if(predicate(msg)){clearTimeout(timeout);ws.off('message',onMessage);resolve(msg);}}catch{}
  };
  ws.on('message',onMessage);
 });
}
test('host QR, two player join, authority and results',async()=>{
 const child=spawn(process.execPath,['multiplayer/server.mjs'],{env:{...process.env,PORT:String(port)}});
 const sockets=[];
 try {
  await waitReady();
  const host=await connect();sockets.push(host);
  const hosted=next(host,d=>d.type==='hosted');send(host,'host');
  const {code,token}=await hosted;
  assert.match(code,/^[A-HJ-NP-Z2-9]{4}$/);
  assert.ok(token.length>=20);
  const qr=await fetch(base+'/qr?code='+code);
  assert.equal(qr.status,200);assert.match(await qr.text(),/<svg/);
  const a=await connect();const b=await connect();sockets.push(a,b);
  const aa=next(a,d=>d.type==='joined');send(a,'join',{code,name:'Alice'});
  const ja=await aa;assert.ok(ja.token);
  const bb=next(b,d=>d.type==='joined');send(b,'join',{code,name:'Bob'});
  const jb=await bb;assert.notEqual(ja.token,jb.token);
  const start=next(host,d=>d.type==='state'&&d.status==='playing');
  send(host,'start',{code});let s=await start;
  assert.equal(s.players.length,2);assert.equal(s.currentPlayerId,ja.playerId);
  const denied=next(b,d=>d.type==='error');send(b,'roll',{code});assert.match((await denied).message,/Wait for your turn/);
  const rolled=next(host,d=>d.type==='state'&&d.roll!==null);
  send(a,'roll',{code});s=await rolled;assert.ok(s.roll>=2&&s.roll<=12);
  const cheat=next(a,d=>d.type==='error');send(a,'pick',{code,tiles:[9,9]});assert.match((await cheat).message,/Choose available/);
  // Reconnect using the secret token without duplicating the roster.
  const replacement=await connect();sockets.push(replacement);
  const rejoined=next(replacement,d=>d.type==='joined');
  send(replacement,'resumePlayer',{code,token:ja.token});
  assert.equal((await rejoined).playerId,ja.playerId);
  const snap=next(host,d=>d.type==='state'&&d.players.length===2);
  send(host,'resumeHost',{code,token});
  assert.equal((await snap).players.length,2);
 } finally {
  for(const s of sockets)try{s.close()}catch{}
  child.kill('SIGTERM');
 }
});
