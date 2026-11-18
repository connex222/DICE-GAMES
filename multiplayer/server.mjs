import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomInt, randomBytes } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';
import QRCode from 'qrcode';

const port = Number(process.env.PORT || 3000);
const rooms = new Map();
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({length:4},()=>alphabet[randomInt(alphabet.length)]).join('');
const secret = () => randomBytes(24).toString('base64url');
const cleanName = v => String(v ?? '').trim().replace(/[\u0000-\u001f<>]/g,'').slice(0,24);
const validCode = v => typeof v === 'string' && /^[A-HJ-NP-Z2-9]{4}$/.test(v);
const now = () => Date.now();
const isOpen = ws => ws && ws.readyState === WebSocket.OPEN;
const send = (ws, message) => { if(isOpen(ws)) ws.send(JSON.stringify(message)); };
const getRoom = code => rooms.get(code);
const remaining = tiles => [1,2,3,4,5,6,7,8,9].filter(n=>!tiles.includes(n));
function possible(tiles, total) {
  const free = remaining(tiles);
  for (let mask=1;mask<1<<free.length;mask++){
    let sum=0;for(let j=0;j<free.length;j++) if(mask&(1<<j))sum+=free[j];
    if(sum===total)return true;
  }
  return false;
}
function score(tiles){return remaining(tiles).reduce((a,b)=>a+b,0);}
function publicState(r){
  const current = r.status==='playing'?r.players[r.turn]:null;
  const finished = r.status==='finished';
  return {
    roomCode:r.code, status:r.status, game:'shut-the-box', hostConnected:isOpen(r.hostSocket),
    players:r.players.map(p=>({id:p.id,name:p.name,connected:isOpen(p.socket),score:p.score,finished:p.finished})),
    currentPlayerId:current?.id??null, tiles:r.tiles, roll:r.roll,
    canPick:r.roll!=null && possible(r.tiles,r.roll), turn:r.turn+1,
    winners:finished? r.players.filter(p=>p.score===Math.min(...r.players.map(x=>x.score))).map(p=>p.id):[],
    instructions: r.status==='lobby'?'Scan the QR code to join':finished?'Match complete':r.roll==null?'Roll the dice':possible(r.tiles,r.roll)?'Select tiles totalling the dice':'No matching tiles — turn complete'
  };
}
function broadcast(r) {
  r.updated=now();
  const state=publicState(r);
  send(r.hostSocket,{type:'state',...state,role:'host'});
  for(const p of r.players)send(p.socket,{type:'state',...state,role:'player',yourPlayerId:p.id});
}
function error(ws,message){send(ws,{type:'error',message});}
function advance(r){
  const p=r.players[r.turn];
  p.score=score(r.tiles);p.finished=true;
  if(r.turn===r.players.length-1){r.status='finished';r.roll=null;broadcast(r);return;}
  r.turn++;r.tiles=[];r.roll=null;broadcast(r);
}
function action(ws,data,ctx){
  if(!data || typeof data!=='object' || Array.isArray(data))return;
  let code=String(data.code||'').toUpperCase();
  if(data.type==='host'){
    let tries=0;do{code=newCode();tries++;}while(rooms.has(code)&&tries<100);
    if(rooms.has(code))return error(ws,'Could not create a room. Try again.');
    const r={code,hostToken:secret(),hostSocket:ws,players:[],status:'lobby',turn:0,tiles:[],roll:null,updated:now()};
    rooms.set(code,r);ctx.code=code;ctx.role='host';
    send(ws,{type:'hosted',code,token:r.hostToken});broadcast(r);return;
  }
  if(!validCode(code))return error(ws,'Enter a valid four-character room code.');
  const r=getRoom(code);
  if(!r)return error(ws,'Room not found. Ask the host for a new QR code.');
  if(data.type==='resumeHost'){
    if(typeof data.token!=='string'||data.token!==r.hostToken)return error(ws,'Host token is invalid.');
    if(isOpen(r.hostSocket) && r.hostSocket!==ws)r.hostSocket.close(4001,'Host reconnected');
    r.hostSocket=ws;ctx.code=code;ctx.role='host';
    send(ws,{type:'hosted',code,token:r.hostToken});broadcast(r);return;
  }
  if(data.type==='join'||data.type==='resumePlayer'){
    let p;
    if(data.type==='resumePlayer'){
      p=r.players.find(p=>p.token===data.token);
      if(!p)return error(ws,'Saved player session has expired.');
    } else {
      if(r.status!=='lobby')return error(ws,'Game already started. Rejoin using your existing phone.');
      if(r.players.length>=8)return error(ws,'Room is full (eight players).');
      const name=cleanName(data.name);
      if(!name)return error(ws,'Enter your player name.');
      p={id:secret(),token:secret(),name,score:null,finished:false,socket:null};r.players.push(p);
    }
    if(isOpen(p.socket)&&p.socket!==ws)p.socket.close(4001,'Phone reconnected');
    p.socket=ws;ctx.code=code;ctx.role='player';ctx.playerId=p.id;
    send(ws,{type:'joined',code,token:p.token,playerId:p.id});broadcast(r);return;
  }
  if(ctx.code!==code)return error(ws,'You are not connected to this room.');
  if(data.type==='start'||data.type==='rematch'){
    if(ctx.role!=='host'||r.hostSocket!==ws)return error(ws,'Only the host can start or restart.');
    if(r.players.length<2)return error(ws,'At least two players are required.');
    if(data.type==='start'&&r.status!=='lobby')return error(ws,'Game is already running.');
    if(data.type==='rematch'&&r.status!=='finished')return error(ws,'Finish the match first.');
    r.status='playing';r.turn=0;r.roll=null;r.tiles=[];
    for(const p of r.players){p.finished=false;p.score=null;}
    broadcast(r);return;
  }
  if(ctx.role!=='player')return error(ws,'Use your phone to play.');
  const p=r.players[r.turn];
  if(r.status!=='playing'||!p||p.id!==ctx.playerId||p.socket!==ws)return error(ws,'Wait for your turn.');
  if(data.type==='roll'){
    if(r.roll!==null)return error(ws,'Select tiles before rolling again.');
    const dice=remaining(r.tiles).some(n=>n>=7)?2:1;
    r.roll=dice===2?randomInt(1,7)+randomInt(1,7):randomInt(1,7);
    if(!possible(r.tiles,r.roll)){broadcast(r);advance(r);}else broadcast(r);
    return;
  }
  if(data.type==='pick'){
    const tiles=data.tiles;
    if(r.roll===null||!Array.isArray(tiles)||!tiles.length||tiles.length>9
       ||tiles.some(n=>!Number.isInteger(n)||n<1||n>9)
       ||new Set(tiles).size!==tiles.length||tiles.some(n=>r.tiles.includes(n))
       ||tiles.reduce((a,b)=>a+b,0)!==r.roll)return error(ws,'Choose available tiles totalling your roll.');
    r.tiles=[...r.tiles,...tiles].sort((a,b)=>a-b);r.roll=null;
    if(r.tiles.length===9){p.score=0;p.finished=true;r.status='finished';r.roll=null;broadcast(r);}
    else broadcast(r);
    return;
  }
  error(ws,'Unknown action.');
}
const respond=(res,status,body,contentType='text/plain; charset=utf-8')=>{res.writeHead(status,{'content-type':contentType,'cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'no-referrer','content-security-policy':"default-src 'self'; connect-src 'self' ws: wss:; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'"});res.end(body);};
const server=http.createServer(async(req,res)=>{
  const path=new URL(req.url||'/', 'http://localhost').pathname;
  if(path==='/health')return respond(res,200,'ok');
  if(path==='/multiplayer.html'||path==='/') {
    try{return respond(res,200,await readFile(new URL('../multiplayer.html',import.meta.url)),'text/html; charset=utf-8');}
    catch{return respond(res,500,'Multiplayer UI unavailable');}
  }
  if(path==='/qr'){
    const code=new URL(req.url,'http://localhost').searchParams.get('code')?.toUpperCase();
    if(!validCode(code)||!rooms.has(code))return respond(res,404,'Room not found');
    // Trust the actual server origin, not arbitrary forwarded host headers.
    const configured=process.env.PUBLIC_ORIGIN?.replace(/\/$/,'');
    const origin=configured||('https://'+req.headers.host);
    try{
      const svg=await QRCode.toString(origin+'/multiplayer.html?join='+code,{type:'svg',width:320,margin:2,errorCorrectionLevel:'M'});
      return respond(res,200,svg,'image/svg+xml');
    }catch{return respond(res,500,'QR generation failed');}
  }
  return respond(res,404,'Not found');
});
const wss=new WebSocketServer({server,maxPayload:2048,perMessageDeflate:false});
wss.on('connection',(ws)=>{
  const ctx={code:null,role:null,playerId:null};
  let last=0,bursts=0;
  ws.on('message',raw=>{
    const time=now();if(time-last<200)bursts++;else bursts=Math.max(0,bursts-1);
    last=time;if(bursts>15){ws.close(1008,'Rate limit');return;}
    try{action(ws,JSON.parse(raw.toString()),ctx);}catch{error(ws,'Invalid request.');}
  });
  ws.on('close',()=>{
    const r=getRoom(ctx.code);if(!r)return;
    if(ctx.role==='host'&&r.hostSocket===ws)r.hostSocket=null;
    const p=r.players.find(p=>p.id===ctx.playerId);
    if(p&&p.socket===ws)p.socket=null;
    broadcast(r);
  });
});
const expiry=setInterval(()=>{for(const [code,r] of rooms)if(now()-r.updated>2*60*60*1000){send(r.hostSocket,{type:'expired'});for(const p of r.players)send(p.socket,{type:'expired'});rooms.delete(code);}},60_000);
expiry.unref();
server.listen(port,()=>console.log('Pocket Gamebox multiplayer on port '+port));
