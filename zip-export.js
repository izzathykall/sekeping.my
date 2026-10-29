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
async function download(items,zipName){if(items.length>30)throw Error('Maksimum 30 gambar setiap muat turun. Gunakan filter untuk pilih gambar.');const files=[];let bytes=0;for(let i=0;i<items.length;i++){const item=items[i];const response=await fetch(item.url);if(!response.ok)throw Error('Tidak dapat mendapatkan salah satu gambar daripada pelayan.');const buf=new Uint8Array(await response.arrayBuffer());bytes+=buf.length;if(bytes>100*1024*1024)throw Error('Saiz album melebihi 100 MB. Muat turun gambar secara individu.');files.push({name:`Sekeping-${String(i+1).padStart(3,'0')}-${String(item.guestName||'tetamu').replace(/[^\w -]/g,'').slice(0,24)||'tetamu'}.jpg`,bytes:buf})}
 const blob=build(files),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=zipName||'Sekeping-Album.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),15000);return files.length}
window.SekepingZip={download};
})();
