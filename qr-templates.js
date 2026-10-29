/* Sekeping QR Studio — one render engine shared by the dashboard preview and A5 PDF.
 * All coordinates are in A5 1240 × 1754 pixel design space.
 */
(function(){'use strict';
const WIDTH=1240, HEIGHT=1754;
const templates=[
 {id:'minimal',name:'Minimal Cream',description:'Bersih & klasik',accent:'#254b42',paper:'#faf8f3',ink:'#254b42'},
 {id:'sage',name:'Sage Floral',description:'Daun sage halus',accent:'#446e59',paper:'#f1f5ee',ink:'#254b42'},
 {id:'arch',name:'Classic Arch',description:'Gerbang romantik',accent:'#ac8b64',paper:'#f7f0e5',ink:'#493d30'},
 {id:'editorial',name:'Premium Editorial',description:'Tipografi moden',accent:'#254b42',paper:'#fffdf8',ink:'#223d35'},
 {id:'botanical',name:'Soft Botanical',description:'Corak daun lembut',accent:'#738e70',paper:'#f9f5e9',ink:'#365b49'},
 {id:'night',name:'Dark Elegant',description:'Gelap eksklusif',accent:'#c6ac86',paper:'#1d2b27',ink:'#f8f2e6'}
];
const defaults={template:'sage',accent:'#446e59',showDate:true,showVenue:true,showTagline:true,tagline:'Imbas & rakam kenangan'};
function getTemplate(id){return templates.find(t=>t.id===id)||templates[1]}
function normalize(value){const o={...defaults,...(value&&typeof value==='object'?value:{})};const t=getTemplate(o.template);o.template=t.id;o.accent=/^#[0-9a-f]{6}$/i.test(String(o.accent))?o.accent:t.accent;o.showDate=o.showDate!==false;o.showVenue=o.showVenue!==false;o.showTagline=o.showTagline!==false;o.tagline=String(o.tagline||defaults.tagline).trim().slice(0,95)||defaults.tagline;return o}
function rgba(hex,alpha){let x=hex.replace('#','');return`rgba(${parseInt(x.slice(0,2),16)},${parseInt(x.slice(2,4),16)},${parseInt(x.slice(4,6),16)},${alpha})`}
function strokeArch(ctx,x,y,w,h,accent,thickness=3){ctx.save();ctx.strokeStyle=accent;ctx.lineWidth=thickness;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+w/2);ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0);ctx.lineTo(x+w,y+h);ctx.stroke();ctx.restore()}
function drawSprig(ctx,x,y,size,flip,color){ctx.save();ctx.translate(x,y);ctx.scale(flip*size,size);ctx.strokeStyle=color;ctx.lineWidth=2.1;ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(45,-65,48,-150,32,-205);ctx.stroke();for(let i=0;i<5;i++){let px=11+i*6,py=-34-i*33;ctx.beginPath();ctx.moveTo(px,py);ctx.quadraticCurveTo(px-70,py-35,px-53,py-62);ctx.quadraticCurveTo(px-6,py-57,px,py);ctx.stroke();ctx.beginPath();ctx.moveTo(px,py-8);ctx.quadraticCurveTo(px+71,py-33,px+55,py-64);ctx.quadraticCurveTo(px+6,py-49,px,py-8);ctx.stroke()}ctx.restore()}
function cornerLine(ctx,color){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.strokeRect(74,74,WIDTH-148,HEIGHT-148)}
function design(ctx,theme,accent){const id=theme.id;ctx.fillStyle=theme.paper;ctx.fillRect(0,0,WIDTH,HEIGHT);ctx.save();
 if(id==='minimal'){cornerLine(ctx,rgba(accent,.2));ctx.strokeStyle=rgba(accent,.22);ctx.beginPath();ctx.moveTo(464,210);ctx.lineTo(776,210);ctx.moveTo(464,1537);ctx.lineTo(776,1537);ctx.stroke()}
 if(id==='sage'){cornerLine(ctx,rgba(accent,.22));drawSprig(ctx,115,410,.85,1,rgba(accent,.36));drawSprig(ctx,1125,1344,.85,-1,rgba(accent,.36));ctx.strokeStyle=rgba(accent,.2);ctx.beginPath();ctx.arc(83,88,152,0,Math.PI*2);ctx.stroke()}
 if(id==='arch'){strokeArch(ctx,85,80,1070,1556,rgba(accent,.42),4);strokeArch(ctx,108,102,1024,1510,rgba(accent,.18),2);ctx.fillStyle=rgba(accent,.5);ctx.beginPath();ctx.arc(620,214,7,0,Math.PI*2);ctx.fill()}
 if(id==='editorial'){ctx.fillStyle=rgba(accent,.065);ctx.fillRect(66,66,1108,152);ctx.fillStyle=accent;ctx.fillRect(66,1666,1108,12);ctx.strokeStyle=rgba(accent,.22);ctx.beginPath();ctx.moveTo(120,266);ctx.lineTo(1120,266);ctx.stroke()}
 if(id==='botanical'){cornerLine(ctx,rgba(accent,.23));for(let i=0;i<3;i++){drawSprig(ctx,65+i*25,520-i*110,.73,1,rgba(accent,.32));drawSprig(ctx,1175-i*25,1250+i*92,.73,-1,rgba(accent,.32))}ctx.fillStyle=rgba(accent,.07);ctx.beginPath();ctx.arc(620,860,460,0,Math.PI*2);ctx.fill()}
 if(id==='night'){cornerLine(ctx,rgba(accent,.65));ctx.strokeStyle=rgba(accent,.28);ctx.lineWidth=2;ctx.strokeRect(92,92,1056,1570);ctx.beginPath();ctx.arc(620,195,65,0,Math.PI*2);ctx.stroke();ctx.font='normal 44px Georgia,serif';ctx.fillStyle=accent;ctx.textAlign='center';ctx.fillText('✦',620,210);ctx.strokeStyle=rgba(accent,.35);ctx.beginPath();ctx.moveTo(360,1600);ctx.lineTo(880,1600);ctx.stroke()}
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
