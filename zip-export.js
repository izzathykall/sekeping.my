/* Small uncompressed ZIP generator for photo archives, no external dependency. */
(function(){'use strict';
const enc=new TextEncoder();const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;table[n]=c>>>0}
function crc(buf){let c=0xffffffff;for(const b of buf)c=table[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function u16(dv,i,v){dv.setUint16(i,v,true)}function u32(dv,i,v){dv.setUint32(i,v,true)}
function build(files){const chunks=[],central=[];let pos=0;for(const file of files){const name=enc.encode(file.name),body=file.bytes;const header=new Uint8Array(30+name.length),dv=new DataView(header.buffer),c=crc(body);
 u32(dv,0,0x04034b50);u16(dv,4,20);u16(dv,6,0x0800);u16(dv,8,0);u16(dv,10,0);u16(dv,12,0);u32(dv,14,c);u32(dv,18,body.length);u32(dv,22,body.length);u16(dv,26,name.length);u16(dv,28,0);header.set(name,30);
 chunks.push(header,body);
 const centralHeader=new Uint8Array(46+name.length),cd=new DataView(centralHeader.buffer);u32(cd,0,0x02014b50);u16(cd,4,20);u16(cd,6,20);u16(cd,8,0x0800);u16(cd,10,0);u16(cd,12,0);u16(cd,14,0);u32(cd,16,c);u32(cd,20,body.length);u32(cd,24,body.length);u16(cd,28,name.length);u16(cd,30,0);u16(cd,32,0);u16(cd,34,0);u16(cd,36,0);u32(cd,38,0);u32(cd,42,pos);centralHeader.set(name,46);central.push(centralHeader);pos+=header.length+body.length}
 const offset=pos,size=central.reduce((n,x)=>n+x.length,0);const end=new Uint8Array(22),d=new DataView(end.buffer);u32(d,0,0x06054b50);u16(d,4,0);u16(d,6,0);u16(d,8,files.length);u16(d,10,files.length);u32(d,12,size);u32(d,16,offset);u16(d,20,0);return new Blob([...chunks,...central,end],{type:'application/zip'})}
function save(files,name){if(!Array.isArray(files)||files.length>65000)throw Error('Jumlah fail dalam arkib tidak disokong.');for(const f of files)if(!(f.bytes instanceof Uint8Array))throw Error('Data arkib tidak sah.');const blob=build(files);const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name||'Sekeping-Arkib.zip';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);return blob.size}
window.SekepingZip={save};
})();
