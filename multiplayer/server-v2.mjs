import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomInt, randomBytes } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';
import QRCode from 'qrcode';
import {GAMES,start,next,view,current} from './engines.mjs';

const PORT=Number(process.env.PORT||3000);
const PUBLIC_ORIGIN=process.env.PUBLIC_ORIGIN?.replace(/\/+$/,'');
const HOST=process.env.NODE_ENV==='production'?'https://pocket-gamebox-multiplayer.onrender.com':'http://localhost:'+PORT;
const CODE_CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const rooms=new Map();
const code=()=>Array.from({length:4},()=>CODE_CHARS[randomInt(CODE_CHARS.length)]).join('');
const token=()=>randomBytes(32).toString('base64url');
const open=ws=>ws?.readyState===WebSocket.OPEN;
const send=(ws,m)=>{if(open(ws))ws.send(JSON.stringify(m));};
const clean=s=>String(s||'').trim().replace(/[\x00-\x1f<>]/g,'').slice(0,22);
const goodCode=s=>typeof s==='string'&&/^[A-HJ-NP-Z2-9]{4}$/.test(s);
const errors=(ws,msg)=>send(ws,{type:'error',message:msg});
const available=new Set(GAMES.map(([id])=>id));
function safePlayers(room){return room.players.map(p=>({id:p.id,name:p.name,connected:open(p.ws)}));}
function snapshot(room,playerId){
 const playing=!!room.state;
 const gameState=playing?view(room.game,room.state,playerId):null;
 return {
  type:'state',code:room.code,game:room.game,phase:room.state?.status||'LOBBY',
  players:safePlayers(room),hostOnline:open(room.host.ws),
  currentPlayerId:room.state?current(room.game,room.state):null,
  state:gameState
 };
}
function broadcast(room){
 room.lastActive=Date.now();
 send(room.host.ws,snapshot(room,null));
 for(const p of room.players)send(p.ws,snapshot(room,p.id));
}
function switchGame(room,game) {
 if(room.state)throw Error('The game has already started. Restart to choose a new game.');
 if(!available.has(game))throw Error('Choose one of the seven games.');
 room.game=game;broadcast(room);
}
function processMessage(ws,ctx,data) {
 if(!data||Array.isArray(data)||typeof data!=='object'||typeof data.type!=='string')return;
 const type=data.type;
 const entered=typeof data.code==='string'?data.code.toUpperCase():'';
 if(type==='host'){
  if(ctx.code)throw Error('Already joined a room.');
  let roomCode;do{roomCode=code()}while(rooms.has(roomCode));
  const host={token:token(),ws};
  const room={code:roomCode,host,players:[],game:'shut-the-box',state:null,lastActive:Date.now()};
  rooms.set(roomCode,room);ctx.code=roomCode;ctx.role='host';
  send(ws,{type:'hosted',code:roomCode,token:host.token});broadcast(room);return;
 }
 if(!goodCode(entered)||!rooms.has(entered))throw Error('Room not found. Check the four-letter code.');
 const room=rooms.get(entered);
 if(type==='resumeHost'){
  if(data.token!==room.host.token)throw Error('Host session not recognised.');
  if(open(room.host.ws)&&room.host.ws!==ws)room.host.ws.close(4001,'Host reconnected');
  room.host.ws=ws;ctx.code=entered;ctx.role='host';
  send(ws,{type:'hosted',code:entered,token:room.host.token});broadcast(room);return;
 }
 if(type==='join'||type==='resumePlayer'){
  if(ctx.code&&ctx.code!==entered)throw Error('Already in a different room.');
  let p;
  if(type==='resumePlayer'){
   p=room.players.find(x=>x.token===data.token);
   if(!p)throw Error('Your saved player session is no longer available.');
  }else{
   if(room.state)throw Error('This match has started. Reconnect with your original phone.');
   if(room.players.length>=8)throw Error('Room full: maximum eight players.');
   const name=clean(data.name);
   if(!name)throw Error('Please enter your name.');
   p={id:token(),token:token(),name,ws:null};room.players.push(p);
  }
  if(open(p.ws)&&p.ws!==ws)p.ws.close(4001,'Phone reconnected');
  p.ws=ws;ctx.code=entered;ctx.role='player';ctx.playerId=p.id;
  send(ws,{type:'joined',code:entered,token:p.token,id:p.id});broadcast(room);return;
 }
 if(ctx.code!==entered)throw Error('Join this room first.');
 const isHost=ctx.role==='host'&&room.host.ws===ws;
 const p=room.players.find(p=>p.id===ctx.playerId);
 const isPlayer=ctx.role==='player'&&p?.ws===ws;
 if(!isHost&&!isPlayer)throw Error('Your connection was replaced. Refresh to reconnect.');
 if(type==='chooseGame'){
  if(!isHost)throw Error('Only the host can choose the game.');
  switchGame(room,data.game);return;
 }
 if(type==='returnLobby'){
  if(!isHost)throw Error('Only the host can return to the multiplayer lobby.');
  room.state=null;broadcast(room);return;
 }
 if(type==='start'||type==='rematch'){
  if(!isHost)throw Error('Only the host can start a match.');
  if(type==='start'&&room.state)throw Error('Match already started.');
  if(type==='rematch'&&room.state?.status!=='GAME_OVER')throw Error('Finish the match before a rematch.');
  if(room.players.length<2||room.players.length>8)throw Error('Two to eight players are required.');
  room.state=start(room.game,room.players,room.code);broadcast(room);return;
 }
 if(type==='action'){
  if(!room.state||room.state.status!=='PLAYING')throw Error('This match is not in progress.');
  if(!data.action||typeof data.action!=='object'||Array.isArray(data.action))throw Error('Invalid game action.');
  const actionType=data.action.type;
  // Host can only move a completed transition on (cannot roll / score / bid).
  const transition=room.game==='shut-the-box'?'NEXT_TURN':room.game==='liars-dice'?'NEXT_ROUND':room.game==='brain-raid'?'NEXT_TURN':null;
  if(isHost){
   if(!transition||actionType!==transition)throw Error('Gameplay decisions belong to player phones.');
  }else if(!isPlayer)throw Error('Join on your phone to play.');
  const actorId=room.state.players[room.state.turnIndex]?.id;
  if(!isHost&&actorId!==p.id)throw Error('Wait until it is your turn.');
  room.state=next(room.game,room.state,actorId,data.action);
  broadcast(room);return;
 }
 throw Error('Unsupported request.');
}
const HEADERS={'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer',
 'content-security-policy':"default-src 'self'; media-src 'self' https://cdn.creativeclaw.co; img-src 'self' data:; connect-src 'self' ws: wss:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'"};
function respond(res,status,body,contentType='text/plain; charset=utf-8'){
 res.writeHead(status,{...HEADERS,'content-type':contentType});res.end(body);
}
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url||'/', 'http://localhost');
 if(url.pathname==='/health')return respond(res,200,'ok');
 if(url.pathname==='/'||url.pathname==='/multiplayer-seven.html'||url.pathname==='/multiplayer.html'){
  try{return respond(res,200,await readFile(new URL('../multiplayer-seven.html',import.meta.url)),'text/html; charset=utf-8');}
  catch(e){return respond(res,500,'The multiplayer interface is unavailable');}
 }
 if(/^\/assets\/audio\/[a-z0-9-]+\.mp3$/.test(url.pathname)){
  try{return respond(res,200,await readFile(new URL('..'+url.pathname,import.meta.url)),'audio/mpeg');}
  catch{return respond(res,404,'Sound unavailable');}
 }
 if(/^\/assets\/aaa-cards\/[a-z0-9-]+\.webp$/.test(url.pathname)){
  try{return respond(res,200,await readFile(new URL('..'+url.pathname,import.meta.url)),'image/webp');}
  catch{return respond(res,404,'Artwork unavailable');}
 }
 if(url.pathname==='/qr'){
  const roomCode=url.searchParams.get('code')?.toUpperCase();
  if(!goodCode(roomCode)||!rooms.has(roomCode))return respond(res,404,'Room unavailable');
  const origin=PUBLIC_ORIGIN||HOST;
  const join=origin+'/multiplayer-seven.html?join='+roomCode;
  try{return respond(res,200,await QRCode.toString(join,{type:'svg',width:320,margin:2,errorCorrectionLevel:'M'}),'image/svg+xml');}
  catch{return respond(res,500,'QR creation failed');}
 }
 return respond(res,404,'Not found');
});
const wss=new WebSocketServer({server,maxPayload:4096,perMessageDeflate:false});
wss.on('connection',(ws,req)=>{
 // Prevent unrelated sites from using the user's logged-in browser as an unsolicited controller.
 const origin=req.headers.origin;
 if(origin && !([PUBLIC_ORIGIN,HOST].filter(Boolean).includes(origin))){ws.close(1008,'Invalid origin');return;}
 const ctx={role:null,code:null,playerId:null};
 let recent=0,excess=0;
 ws.on('message',buf=>{
  const at=Date.now();excess=at-recent<160?excess+1:Math.max(0,excess-1);recent=at;
  if(excess>20){ws.close(1008,'Rate limit');return;}
  try{processMessage(ws,ctx,JSON.parse(buf.toString()));}
  catch(e){errors(ws,e.message||'Action rejected');}
 });
 ws.on('close',()=>{
  const room=rooms.get(ctx.code);if(!room)return;
  if(ctx.role==='host'&&room.host.ws===ws)room.host.ws=null;
  const p=room.players.find(p=>p.id===ctx.playerId);if(p?.ws===ws)p.ws=null;
  broadcast(room);
 });
});
const timer=setInterval(()=>{
 const at=Date.now();
 for(const [id,room] of rooms)if(at-room.lastActive>2*60*60*1000){
  send(room.host.ws,{type:'expired'});for(const p of room.players)send(p.ws,{type:'expired'});rooms.delete(id);
 }
},60000);timer.unref();
server.listen(PORT,()=>console.log('Seven-game multiplayer server listening on',PORT));
