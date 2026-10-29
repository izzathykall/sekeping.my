/* Sekeping archive — only called from the authenticated organiser dashboard.
 * One ZIP contains the media originals and the written wishes.
 */
(function(){'use strict';
const enc=new TextEncoder();
const clean=x=>String(x||'Tetamu').replace(/[\u0000-\u001f<>:"/\\|?*]/g,'').replace(/\s+/g,' ').trim().slice(0,50)||'Tetamu';
const csv=x=>'"'+String(x??'').replace(/"/g,'""').replace(/^[=+@\-\t\r]/,v=>"'"+v)+'"';
const fmt=x=>new Date(x||Date.now()).toLocaleString('ms-MY',{timeZone:'Asia/Kuala_Lumpur'});
const extension=(m,kind)=>kind==='photos'?'.jpg':m.mimeType?.includes('mp4')?'.m4a':m.mimeType?.includes('ogg')?'.ogg':m.mimeType?.includes('wav')?'.wav':'.webm';
async function exportEvent(eventId,report){
 const S=window.SekepingStore,Z=window.SekepingZip;
 // Do not use any caller-supplied list or URL: owner verification happens at data layer.
 const {event,photos,voices,wishes}=await S.getOwnerArchiveData(eventId);
 const files=[],total=photos.length+voices.length,maxFiles=500;
 if(total>maxFiles)throw Error('Arkib terlalu besar untuk eksport terus dalam browser (lebih 500 media). Gunakan eksport backend untuk majlis besar.');
 let totalBytes=0;
 for(const [kind,items,label] of [['photos',photos,'Gambar'],['voices',voices,'Suara']]){
  for(let i=0;i<items.length;i++){
   const item=items[i];if(report)report(`Menyediakan ${label.toLowerCase()} ${i+1}/${items.length}…`);
   const bytes=await S.readOwnerMedia(eventId,kind,item);
   totalBytes+=bytes.length;if(totalBytes>180*1024*1024)throw Error('Arkib melebihi had 180 MB untuk browser. Eksport menggunakan backend disyorkan bagi majlis besar.');
   const title=clean(item.guestName),index=String(i+1).padStart(4,'0');
   files.push({name:`${label}/${index}-${title}${extension(item,kind)}`,bytes});
  }
 }
 if(report)report('Menyediakan fail ucapan…');
 const headings=['Bil','Nama Tetamu','Tarikh','Ucapan'];
 const rows=[headings.map(csv).join(',')];
 wishes.forEach((w,i)=>rows.push([i+1,w.guestName,fmt(w.createdAt),w.message].map(csv).join(',')));
 files.push({name:'Ucapan/semua-ucapan.csv',bytes:enc.encode('\uFEFF'+rows.join('\r\n'))});
 files.push({name:'Ucapan/semua-ucapan.txt',bytes:enc.encode(wishes.length?wishes.map((w,i)=>`${i+1}. ${clean(w.guestName)} — ${fmt(w.createdAt)}\n${String(w.message||'')}\n`).join('\n'):'Belum ada ucapan.')});
 const summary={majlis:event.name,pengantin:`${event.bride} & ${event.groom}`,tarikh:event.date,dieksport:new Date().toISOString(),jumlah:{gambar:photos.length,suara:voices.length,ucapan:wishes.length},note:'Arkib ini untuk kegunaan pengurus majlis sahaja. Lindungi privasi tetamu.'};
 files.push({name:'MAKLUMAT-MAJLIS.json',bytes:enc.encode(JSON.stringify(summary,null,2))});
 if(report)report('Membina satu fail ZIP…');
 const filename='Sekeping-Arkib-Majlis-'+String(event.id).replace(/[^a-z0-9_-]/gi,'')+'.zip';
 Z.save(files,filename);
 return summary.jumlah;
}
window.SekepingArchive={exportEvent};
})();
