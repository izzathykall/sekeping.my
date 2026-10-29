/* Sekeping QR Studio — one render engine shared by the dashboard preview and A5 PDF.
 * All coordinates are in A5 1240 × 1754 pixel design space.
 */
(function(){'use strict';
const WIDTH=1240, HEIGHT=1754;
const templates=[
 {id:'minimal',name:'Classic Cream',description:'Garis warisan elegan',accent:'#8f7457',paper:'#fbf8f0',ink:'#284c41'},
 {id:'sage',name:'Sage Floral',description:'Botani lembut romantik',accent:'#54765d',paper:'#f3f5ed',ink:'#284c41'},
 {id:'arch',name:'Royal Arch',description:'Gerbang emas berlapis',accent:'#a5855a',paper:'#faf4e9',ink:'#473b32'},
 {id:'editorial',name:'Editorial Classic',description:'Gaya majalah klasik',accent:'#426153',paper:'#fffdf8',ink:'#243e34'},
 {id:'botanical',name:'Botanical Elegance',description:'Floral artisanal',accent:'#7f946f',paper:'#f8f6ee',ink:'#365b49'},
 {id:'night',name:'Dark Heritage',description:'Hijau gelap & emas',accent:'#c6ac86',paper:'#1e302a',ink:'#f8f2e6'}
];
const defaults={template:'sage',accent:'#446e59',showDate:true,showVenue:true,showTagline:true,tagline:'Imbas & rakam kenangan'};
function getTemplate(id){return templates.find(t=>t.id===id)||templates[1]}
function normalize(value){const o={...defaults,...(value&&typeof value==='object'?value:{})};const t=getTemplate(o.template);o.template=t.id;o.accent=/^#[0-9a-f]{6}$/i.test(String(o.accent))?o.accent:t.accent;o.showDate=o.showDate!==false;o.showVenue=o.showVenue!==false;o.showTagline=o.showTagline!==false;o.tagline=String(o.tagline||defaults.tagline).trim().slice(0,95)||defaults.tagline;return o}
function rgba(hex,alpha){let x=hex.replace('#','');return`rgba(${parseInt(x.slice(0,2),16)},${parseInt(x.slice(2,4),16)},${parseInt(x.slice(4,6),16)},${alpha})`}
function strokeArch(ctx,x,y,w,h,accent,thickness=3){ctx.save();ctx.strokeStyle=accent;ctx.lineWidth=thickness;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0);ctx.lineTo(x+w,y+h);ctx.stroke();ctx.restore()}
function drawSprig(ctx,x,y,size,flip,color){ctx.save();ctx.translate(x,y);ctx.scale(flip*size,size);ctx.strokeStyle=color;ctx.lineWidth=2.1;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(45,-65,48,-150,32,-205);ctx.stroke();for(let i=0;i<5;i++){let px=11+i*6,py=-34-i*33;ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px-70,py-35,px-53,py-62);ctx.quadraticCurveTo(px-6,py-57,px,py);ctx.stroke();ctx.beginPath();ctx.moveTo(px,py-8);ctx.quadraticCurveTo(px+71,py-33,px+55,py-64);ctx.quadraticCurveTo(px+6,py-49,px,py-8);ctx.stroke()}ctx.restore()}
function cornerLine(ctx,color){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.strokeRect(74,74,WIDTH-148,HEIGHT-148)}
function ornament(ctx,x,y,r,color){
 ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,r*.6,0,Math.PI*2);ctx.stroke();
 for(let i=0;i<8;i++){const rad=i*Math.PI/4;ctx.save();ctx.rotate(rad);ctx.beginPath();ctx.ellipse(0,-r*.58,r*.27,r*.48,0,0,Math.PI*2);ctx.stroke();ctx.restore()}
 ctx.beginPath();ctx.arc(0,0,r*.14,0,Math.PI*2);ctx.stroke();ctx.restore();
}
function vine(ctx,x,y,length,direction,color){
 ctx.save();ctx.translate(x,y);ctx.scale(direction,1);ctx.strokeStyle=color;ctx.lineWidth=2.4;
 ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(45,-length*.18,23,-length*.72,70,-length);ctx.stroke();
 for(let i=0;i<6;i++){const yy=-25-i*length/7,xx=9+i*8,sign=i%2?1:-1;
 ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+sign*48,yy-18,xx+sign*43,yy-45);ctx.quadraticCurveTo(xx+sign*5,yy-34,xx,yy);ctx.stroke()}
 ctx.restore();
}
function capLine(ctx,x1,x2,y,color){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();ctx.beginPath();ctx.arc((x1+x2)/2,y,4,0,Math.PI*2);ctx.stroke()}
function design(ctx,theme,accent){const id=theme.id;ctx.fillStyle=theme.paper;ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.save();
 const pale=rgba(accent,.2),soft=rgba(accent,.1),strong=rgba(accent,.55);
 if(id==='minimal'){
   ctx.strokeStyle=pale;ctx.lineWidth=2;ctx.strokeRect(68,68,1104,1618);ctx.strokeRect(90,90,1060,1574);
   ornament(ctx,620,112,28,strong);capLine(ctx,382,858,239,pale);capLine(ctx,462,778,1580,pale);
   for(const sx of [112,1128]){ctx.strokeStyle=pale;ctx.beginPath();ctx.moveTo(sx-16,120);ctx.lineTo(sx+16,120);ctx.moveTo(sx,104);ctx.lineTo(sx,136);ctx.stroke()}
 }
 if(id==='sage'){
   ctx.strokeStyle=pale;ctx.lineWidth=2;ctx.strokeRect(78,78,1084,1598);
   vine(ctx,110,593,300,1,rgba(accent,.37));vine(ctx,1126,1494,300,-1,rgba(accent,.37));
   drawSprig(ctx,145,370,.52,1,rgba(accent,.35));drawSprig(ctx,1095,1390,.52,-1,rgba(accent,.35));
   ornament(ctx,620,104,32,rgba(accent,.28));ctx.fillStyle=soft;ctx.beginPath();ctx.ellipse(90,95,210,100,-.4,0,Math.PI*2);ctx.fill();
 }
 if(id==='arch'){
   strokeArch(ctx,80,92,1080,1570,rgba(accent,.54),3);strokeArch(ctx,102,114,1036,1524,rgba(accent,.22),3);
   strokeArch(ctx,125,136,990,1478,rgba(accent,.16),1);
   ornament(ctx,620,105,28,rgba(accent,.56));
   for(const x of [148,1092]){ornament(ctx,x,1198,22,rgba(accent,.36))}
   ctx.strokeStyle=strong;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(416,591);ctx.lineTo(824,591);ctx.stroke();
 }
 if(id==='editorial'){
   ctx.fillStyle=rgba(accent,.065);ctx.fillRect(70,69,1100,142);ctx.fillRect(70,1594,1100,90);
   ctx.fillStyle=accent;ctx.fillRect(70,69,11,1540);ctx.fillRect(1159,69,11,1540);
   ctx.fillStyle=pale;ctx.fillRect(146,232,948,2);ctx.fillRect(146,1566,948,2);
   for(let i=0;i<12;i++){ctx.fillStyle=rgba(accent,.14);ctx.fillRect(168+i*80,244,1,34)}
   ornament(ctx,1050,140,28,rgba(accent,.36));
 }
 if(id==='botanical'){
   ctx.strokeStyle=pale;ctx.lineWidth=2;ctx.strokeRect(72,72,1096,1610);
   for(let i=0;i<3;i++){vine(ctx,95+i*34,485-i*110,230,1,rgba(accent,.24+i*.02));vine(ctx,1145-i*34,1440+i*85,240,-1,rgba(accent,.24+i*.02))}
   ornament(ctx,620,106,35,strong);ornament(ctx,620,1598,25,rgba(accent,.3));
   ctx.fillStyle=rgba(accent,.055);ctx.beginPath();ctx.ellipse(620,880,390,570,0,0,Math.PI*2);ctx.fill();
 }
 if(id==='night'){
   ctx.strokeStyle=strong;ctx.lineWidth=3;ctx.strokeRect(71,71,1098,1612);
   ctx.strokeStyle=rgba(accent,.24);ctx.lineWidth=2;ctx.strokeRect(91,91,1058,1572);
   ornament(ctx,620,105,26,accent);ornament(ctx,620,1580,26,rgba(accent,.54));
   for(let i=0;i<5;i++){const y=470+i*105;ctx.strokeStyle=rgba(accent,.11);ctx.beginPath();ctx.moveTo(106,y);ctx.lineTo(1134,y);ctx.stroke()}
   vine(ctx,155,575,210,1,rgba(accent,.35));vine(ctx,1085,1450,210,-1,rgba(accent,.35));
 }
 ctx.restore()}
function getQR(text,size=520){if(window.SekepingPDF?.qrCanvas)return window.SekepingPDF.qrCanvas(text,size);throw Error('Enjin kod QR tidak tersedia.')}
function dateLabel(date){if(!date)return'';const d=new Date(date+'T12:00:00');return isNaN(d)?'':new Intl.DateTimeFormat('ms-MY',{day:'numeric',month:'long',year:'numeric'}).format(d)}
function drawFitted(ctx,text,x,y,width,base,min,font='Georgia,serif',italic=false){const val=String(text||'');let size=base;while(size>min){ctx.font=`${italic?'italic ':'normal '}${size}px ${font}`;if(ctx.measureText(val).width<=width)break;size-=2}ctx.font=`${italic?'italic ':'normal '}${size}px ${font}`;let fitted=val;if(ctx.measureText(fitted).width>width){while(fitted.length>1&&ctx.measureText(fitted+'…').width>width)fitted=fitted.slice(0,-1);fitted+='…'}ctx.fillText(fitted,x,y);return size}
function drawNames(ctx,event,ink){const bride=String(event.bride||'Pengantin'),groom=String(event.groom||'Pengantin');ctx.fillStyle=ink;ctx.textAlign='center';let line=bride+' & '+groom;ctx.font='normal 71px Georgia,serif';if(ctx.measureText(line).width<=1030){drawFitted(ctx,line,620,428,1030,71,42);return}
 drawFitted(ctx,bride,620,359,970,65,32);ctx.font='italic 44px Georgia,serif';ctx.fillText('&',620,426);drawFitted(ctx,groom,620,493,970,65,32)}
function wrap(ctx,string,maxWidth,maxLines=2){const words=String(string||'').trim().split(/\s+/).filter(Boolean),lines=[],measure=s=>ctx.measureText(s).width;let line='';for(const word of words){const combined=line?line+' '+word:word;if(measure(combined)>maxWidth&&line){lines.push(line);line=word}else line=combined}if(line)lines.push(line);if(lines.length>maxLines){const rest=lines.slice(maxLines-1).join(' ');lines.length=maxLines;let final=rest;while(final.length>0&&measure(final+'…')>maxWidth)final=final.slice(0,-1);lines[maxLines-1]=final+'…'}return lines.map(s=>{if(measure(s)<=maxWidth)return s;let reduced=s;while(reduced.length>0&&measure(reduced+'…')>maxWidth)reduced=reduced.slice(0,-1);return reduced+'…'})}
function render(event,url,config){const opt=normalize(config||event.qrDesign),theme=getTemplate(opt.template),accent=opt.accent;const c=document.createElement('canvas');c.width=WIDTH;c.height=HEIGHT;const ctx=c.getContext('2d');design(ctx,theme,accent);ctx.textAlign='center';ctx.textBaseline='alphabetic';const ink=theme.ink;
 const light=theme.id==='night'?'#d4c7ac':'#687d70';
 ctx.fillStyle=ink;ctx.font='normal 58px Georgia,serif';ctx.fillText('sekeping.',620,173);
 ctx.fillStyle=accent;ctx.font='bold 23px Arial,sans-serif';ctx.fillText('KENANGAN HARI ISTIMEWA',620,272);
 drawNames(ctx,event,ink);
 if(opt.showDate){ctx.fillStyle=light;ctx.font='normal 28px Arial,sans-serif';ctx.fillText(dateLabel(event.date),620,552)}
 ctx.strokeStyle=rgba(accent,.55);ctx.beginPath();ctx.moveTo(427,598);ctx.lineTo(813,598);ctx.stroke();
 // QR module is always on white, with an unchanged quiet zone; decorations never overlap.
 const QR_SIZE=520,qrX=360,qrY=685;
 ctx.fillStyle='#ffffff';ctx.fillRect(qrX-18,qrY-18,QR_SIZE+36,QR_SIZE+36);
 ctx.drawImage(getQR(url,QR_SIZE),qrX,qrY,QR_SIZE,QR_SIZE);
 ctx.fillStyle=ink;ctx.font='bold 30px Arial,sans-serif';const headline=opt.showTagline?opt.tagline:'IMBAS UNTUK MASUK';const short=wrap(ctx,headline.toUpperCase(),940,2);short.forEach((line,i)=>drawFitted(ctx,line,620,1328+i*37,940,30,20,'Arial,sans-serif'));
 ctx.fillStyle=light;ctx.font='normal 26px Arial,sans-serif';ctx.fillText('Gambar  •  Suara  •  Ucapan',620,1432);
 if(opt.showVenue&&event.venue){ctx.fillStyle=light;ctx.font='normal 25px Arial,sans-serif';const lines=wrap(ctx,event.venue,930,2);lines.forEach((line,i)=>ctx.fillText(line,620,1505+i*34))}
 ctx.fillStyle=theme.id==='night'?accent:'#a99072';ctx.font='italic 25px Georgia,serif';ctx.fillText('Terima kasih meraikan bersama kami.',620,1645);
 return c}
window.SekepingQRStudio={templates,defaults,normalize,getTemplate,render,width:WIDTH,height:HEIGHT};
})();
