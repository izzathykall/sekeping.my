/* No-dependency A5 PDF exporter; creates a genuine PDF embedding a high-resolution poster. */
(function(){'use strict';
function qrCanvas(text,px=620){const qr=window.SekepingQR(text);const count=qr.getModuleCount(),quiet=4,unit=px/(count+quiet*2),c=document.createElement('canvas');c.width=px;c.height=px;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,px,px);ctx.fillStyle='#152b24';for(let y=0;y<count;y++)for(let x=0;x<count;x++)if(qr.isDark(y,x)){let xx=Math.round((x+quiet)*unit),yy=Math.round((y+quiet)*unit),x2=Math.round((x+quiet+1)*unit),y2=Math.round((y+quiet+1)*unit);ctx.fillRect(xx,yy,x2-xx,y2-yy)}return c}
function drawLeaf(c,x,y,s,angle){c.save();c.translate(x,y);c.rotate(angle);c.scale(s,s);c.strokeStyle='#bcb99a';c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(5,-30,38,-80,45,-110);c.stroke();for(let i=0;i<4;i++){let yy=-18-i*25;let xx=6+i*11;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx-39,yy-22,xx-22,yy-42);c.quadraticCurveTo(xx+4,yy-40,xx,yy);c.stroke();c.beginPath();c.moveTo(xx,yy-7);c.quadraticCurveTo(xx+37,yy-38,xx+32,yy-55);c.quadraticCurveTo(xx+4,yy-45,xx,yy-7);c.stroke()}c.restore()}
function multiline(ctx,str,y,maxWidth,lineHeight){const words=(str||'').trim().split(/\s+/),lines=[];let line='';for(const w of words){const tryLine=line?line+' '+w:w;if(ctx.measureText(tryLine).width>maxWidth&&line){lines.push(line);line=w}else line=tryLine}if(line)lines.push(line);lines.slice(0,3).forEach((s,i)=>ctx.fillText(s,620,y+i*lineHeight));return Math.min(3,lines.length)}
function poster(event,url){
 const c=document.createElement('canvas');c.width=1240;c.height=1754;
 const ctx=c.getContext('2d'),W=c.width,H=c.height;
 // Background, safe borders and botanical geometry use the same visual identity as the dashboard.
 ctx.fillStyle='#f8f7ef';ctx.fillRect(0,0,W,H);
 ctx.strokeStyle='#d8d9c8';ctx.lineWidth=2;ctx.strokeRect(60,60,W-120,H-120);
 ctx.strokeStyle='#e5e4d5';ctx.lineWidth=1;ctx.strokeRect(74,74,W-148,H-148);
 ctx.beginPath();ctx.arc(70,72,156,0,Math.PI*2);ctx.stroke();
 ctx.beginPath();ctx.arc(W-72,H-72,160,0,Math.PI*2);ctx.stroke();
 ctx.fillStyle='#254b42';ctx.textAlign='center';ctx.textBaseline='alphabetic';
 ctx.font='500 55px Georgia,serif';ctx.fillText('sekeping.',620,170);
 ctx.fillStyle='#a08b6f';ctx.font='bold 25px Arial,sans-serif';ctx.fillText('KENANGAN HARI ISTIMEWA',620,271);
 const bride=String(event.bride||'Pengantin'),groom=String(event.groom||'Pengantin'),combined=bride+' & '+groom;
 ctx.fillStyle='#254b42';
 function fontFit(value,initial,minimum,max){let size=initial;do{ctx.font=`500 ${size}px Georgia,serif`;if(ctx.measureText(value).width<=max)break;size-=2}while(size>=minimum);return size}
 if(fontFit(combined,77,43,1050)>=43&&ctx.measureText(combined).width<=1050){ctx.fillText(combined,620,399)}
 else{fontFit(bride,70,39,1020);ctx.fillText(bride,620,342);ctx.font='italic 48px Georgia,serif';ctx.fillText('&',620,410);fontFit(groom,70,39,1020);ctx.fillText(groom,620,474)}
 ctx.fillStyle='#788d80';ctx.font='normal 27px Arial,sans-serif';
 if(event.date){const date=new Date(event.date+'T12:00:00');if(!isNaN(date))ctx.fillText(new Intl.DateTimeFormat('ms-MY',{day:'numeric',month:'long',year:'numeric'}).format(date),620,538)}
 ctx.strokeStyle='#c6cbbd';ctx.beginPath();ctx.moveTo(415,582);ctx.lineTo(825,582);ctx.stroke();
 // A dedicated QR safe area; all textual elements are outside the quiet zone.
 const code=qrCanvas(url,550),x=345,y=685;
 ctx.fillStyle='#ffffff';ctx.fillRect(x-15,y-15,580,580);ctx.drawImage(code,x,y,550,550);
 ctx.fillStyle='#254b42';ctx.font='bold 30px Arial,sans-serif';ctx.fillText('IMBAS & RAKAM KENANGAN',620,1365);
 ctx.fillStyle='#7b8b7e';ctx.font='normal 26px Arial,sans-serif';ctx.fillText('Gambar   •   Suara   •   Ucapan',620,1421);
 // Venue wraps to at most two lines and stays well above the bottom safety zone.
 const words=String(event.venue||'').split(/\s+/).filter(Boolean);let line='',lines=[];
 ctx.font='normal 25px Arial,sans-serif';
 for(const word of words){const joined=line?line+' '+word:word;
  if(ctx.measureText(joined).width>950&&line){lines.push(line);line=word}else line=joined}
 if(line)lines.push(line);
 ctx.fillStyle='#7f8f80';for(let i=0;i<Math.min(lines.length,2);i++){const text=lines[i];if(ctx.measureText(text).width>960){const ratio=960/ctx.measureText(text).width;ctx.font=`normal ${Math.max(17,25*ratio)}px Arial,sans-serif`}ctx.fillText(text,620,1504+i*35)}
 ctx.fillStyle='#ab957b';ctx.font='italic 27px Georgia,serif';ctx.fillText('Terima kasih meraikan bersama kami.',620,1633);
 return c;
}
const encoder=new TextEncoder();const bytes=s=>encoder.encode(s);function concat(parts){let count=0;parts.forEach(p=>count+=p.length);const out=new Uint8Array(count);let i=0;for(const p of parts){out.set(p,i);i+=p.length}return out}
function makePdf(jpeg,width,height){const pageW=419.528,pageH=595.276,parts=[],offsets=[0];let pos=0;const append=(x)=>{const d=typeof x==='string'?bytes(x):x;parts.push(d);pos+=d.length};const obj=(n,content)=>{offsets[n]=pos;append(`${n} 0 obj\n${content}\nendobj\n`)};
append('%PDF-1.4\n%Sekeping\n');obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');obj(3,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im1 5 0 R >> >> /Contents 4 0 R >>`);
const command=`q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im1 Do\nQ\n`;obj(4,`<< /Length ${bytes(command).length} >>\nstream\n${command}endstream`);
offsets[5]=pos;append(`5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`);append(jpeg);append('\nendstream\nendobj\n');const xrefPos=pos;append('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)append(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);append(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);return new Blob([concat(parts)],{type:'application/pdf'})}
function toJPEG(c){const raw=atob(c.toDataURL('image/jpeg',0.93).split(',')[1]);const a=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)a[i]=raw.charCodeAt(i);return a}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000)}
function exportA5(event,url){const c=poster(event,url),file=makePdf(toJPEG(c),c.width,c.height);download(file,'Sekeping-QR-A5-'+(event.id||'majlis')+'.pdf');return file}
window.SekepingPDF={qrCanvas,poster,exportA5};
})();
