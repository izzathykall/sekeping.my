/* Sekeping data layer. Demo uses localStorage + IndexedDB; production uses Firebase. */
(function(){
'use strict';
const firebaseConfig={
  apiKey:'AIzaSyDx4gBxYEcsHsGVpl4cZQL8b7ytiBz8RzQ',
  authDomain:'sekeping-my.firebaseapp.com',
  databaseURL:'https://sekeping-my-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId:'sekeping-my',
  storageBucket:'sekeping-my.firebasestorage.app',
  messagingSenderId:'158820023594',
  appId:'1:158820023594:web:5e933b4bb4a6c9b1bb3253',
  measurementId:'G-EBTX2F8BT5'
};
const demoEvent={id:'demo',ownerUid:'demo-organizer',name:'Majlis Perkahwinan',bride:'Aina',groom:'Haziq',date:'2026-12-12',time:'11:00',venue:'Dewan Seri Indah',description:'Sebuah hari yang indah, dikongsi bersama insan tersayang.',photoLimit:3,voiceLimit:45,status:'published',allowGallery:true,allowVoices:true,allowWishes:true,giftEnabled:true,giftBank:'',giftRecipient:'',giftAccount:'',giftQrUrl:'',theme:'#254b42',coverUrl:'',coverX:50,coverY:50,coverZoom:100,createdAt:Date.now()};
function isDemo(){const p=new URLSearchParams(location.search);return p.get('demo')==='1'||p.get('e')==='demo';}
const prefix='sekeping_v4_';
const key=(kind,id)=>prefix+kind+'_'+id;
const parse=(s,f)=>{try{return JSON.parse(s)||f}catch{return f}};
const read=(kind,id,f)=>parse(localStorage.getItem(key(kind,id)),f);
const write=(kind,id,value)=>localStorage.setItem(key(kind,id),JSON.stringify(value));
const uuid=()=> crypto.randomUUID?.()||'id-'+Date.now()+'-'+Math.random().toString(36).slice(2);
let f=null, db=null, storage=null, auth=null, authReady=false;
const $getPath=(id,what)=>`events/${id}/${what}`;
function demoInit(){if(!localStorage.getItem('sekeping_demo_seeded')){if(!localStorage.getItem(key('event','demo')))write('event','demo',demoEvent);if(!localStorage.getItem(key('all','events')))write('all','events',['demo']);localStorage.setItem('sekeping_demo_seeded','1')}if(!localStorage.getItem(key('guest','id')))localStorage.setItem(key('guest','id'),uuid());}
async function setup(){if(isDemo()){demoInit();return true;}if(authReady)return true;
 try{
  const [appMod,authMod,dbMod,storageMod]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'),
   import('https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js'),
   import('https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js')
  ]);
  const app=appMod.initializeApp(firebaseConfig);auth=authMod.getAuth(app);db=dbMod.getDatabase(app);storage=storageMod.getStorage(app);
  f={authMod,dbMod,storageMod};await auth.authStateReady();authReady=true;return true;
 }catch(e){console.error('Firebase connection error',e);throw new Error('Tidak dapat sambung ke Firebase. Semak Internet, konfigurasi Firebase dan domain yang dibenarkan. Untuk mencuba tanpa Firebase, gunakan Mod Demo.');}
}
async function dbRead(path){const s=await f.dbMod.get(f.dbMod.ref(db,path));return s.exists()?s.val():null;}
async function dbSet(path,value){return f.dbMod.set(f.dbMod.ref(db,path),value);}
async function dbUpdate(path,value){return f.dbMod.update(f.dbMod.ref(db,path),value);}
let idbPromise;
function idb(){if(idbPromise)return idbPromise;idbPromise=new Promise((resolve,reject)=>{if(!('indexedDB' in window))return reject(new Error('Browser tidak menyokong storan media demo.'));const r=indexedDB.open('SekepingDemoMedia',1);r.onupgradeneeded=()=>r.result.createObjectStore('blobs');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return idbPromise;}
async function putBlob(id,blob){const d=await idb();return new Promise((resolve,reject)=>{const t=d.transaction('blobs','readwrite');t.objectStore('blobs').put(blob,id);t.oncomplete=()=>resolve(id);t.onerror=()=>reject(t.error)})}
async function readBlob(id){const d=await idb();return new Promise((resolve,reject)=>{const t=d.transaction('blobs','readonly');const r=t.objectStore('blobs').get(id);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}
async function getUrl(data){if(data.url)return data.url;if(data.mediaKey){try{const blob=await readBlob(data.mediaKey);return blob?URL.createObjectURL(blob):''}catch{return ''}}return ''}
async function makePublicPhoto(file){
 const canvas=document.createElement('canvas'),max=860;
 let img,src='';
 try{
  if(typeof createImageBitmap==='function'){try{img=await createImageBitmap(file)}catch{}}
  if(!img){src=URL.createObjectURL(file);img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Pratonton gambar gagal dijana.'));img.src=src})}
  const w=img.width||img.naturalWidth,h=img.height||img.naturalHeight,scale=Math.min(1,max/Math.max(w,h));
  canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));
  const cx=canvas.getContext('2d');cx.drawImage(img,0,0,canvas.width,canvas.height);
  return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Tidak dapat menjana pratonton.')),'image/jpeg',.69));
 }finally{if(img?.close)img.close();if(src)URL.revokeObjectURL(src)}
}
function ownerCheck(event){
 if(!event)throw Error('Majlis tidak wujud.');
 if(isDemo()){if(new URLSearchParams(location.search).get('view')!=='dashboard')throw Error('Arkib hanya boleh dibuka dalam dashboard demo.');return}
 if(!auth.currentUser||auth.currentUser.isAnonymous||auth.currentUser.uid!==event.ownerUid)throw Error('Akses ditolak. Hanya akaun pengurus majlis boleh muat turun arkib.');
}
const store={
 get isDemo(){return isDemo()},uuid,config:firebaseConfig,
 async init(){return setup()},
 async user(){await setup();return isDemo()?{uid:'demo-organizer',email:'demo@sekeping.local'}:auth.currentUser},
 async guest(){await setup();if(isDemo())return {uid:localStorage.getItem(key('guest','id')),isAnonymous:true};if(!auth.currentUser)await f.authMod.signInAnonymously(auth);return auth.currentUser},
 async login(email,password){await setup();if(isDemo())return {uid:'demo-organizer',email};return (await f.authMod.signInWithEmailAndPassword(auth,email,password)).user},
 async register(email,password){await setup();if(isDemo())return {uid:'demo-organizer',email};return (await f.authMod.createUserWithEmailAndPassword(auth,email,password)).user},
 async logout(){if(!isDemo())await f.authMod.signOut(auth)},
 async getEvent(id){await setup();if(isDemo()){if(id==='demo')demoInit();return read('event',id,null)}return dbRead($getPath(id,'meta'))},
 async listEvents(){await setup();if(isDemo())return Promise.all(read('all','events',[]).map(id=>store.getEvent(id))).then(a=>a.filter(Boolean));const u=auth.currentUser;if(!u||u.isAnonymous)return [];const owned=await dbRead(`owners/${u.uid}/events`)||{};return (await Promise.all(Object.keys(owned).map(id=>store.getEvent(id)))).filter(Boolean)},
 async createEvent(input){await setup();const ownerUid=isDemo()?'demo-organizer':auth.currentUser?.uid;if(!ownerUid||(!isDemo()&&auth.currentUser.isAnonymous))throw Error('Log masuk sebagai pengurus terlebih dahulu.');
  const id=uuid().replace(/-/g,'').slice(0,14);const event={...demoEvent,...input,id,ownerUid,coverUrl:'',coverX:50,coverY:50,coverZoom:100,createdAt:Date.now()};
  if(isDemo()){write('event',id,event);write('all','events',[...read('all','events',[]),id]);return event}
  await dbSet($getPath(id,'meta'),event);await dbSet(`owners/${ownerUid}/events/${id}`,true);return event;
 },
 async deleteEvent(id){
  await setup();const event=await store.getEvent(id);if(!event)throw Error('Majlis tidak dijumpai.');
  const u=await store.user();if(!isDemo()&&(!u||u.isAnonymous||u.uid!==event.ownerUid))throw Error('Hanya pengurus majlis boleh padam majlis.');
  if(isDemo()){
   const kinds=['photos','voices','wishes'];const old=await Promise.all(kinds.map(k=>store.listContent(id,k)));
   const images=[read('cover',id,null),read('giftqr',id,null)].filter(Boolean);
   try{const d=await idb(),keys=[...old.flat().map(x=>x.mediaKey),...images.map(x=>x.mediaKey)].filter(Boolean);
    if(keys.length)await new Promise((resolve,reject)=>{const tx=d.transaction('blobs','readwrite');for(const key of keys)tx.objectStore('blobs').delete(key);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})
   }catch(err){console.warn('Demo media cleanup:',err)}
   for(const k of [...kinds,'event','cover','giftqr'])localStorage.removeItem(key(k,id));
   write('all','events',read('all','events',[]).filter(x=>x!==id));return;
  }
  // Atomically remove event database records and its owner index. Storage objects need separate cleanup.
  const updates={};updates[`events/${id}`]=null;updates[`owners/${u.uid}/events/${id}`]=null;
  await f.dbMod.update(f.dbMod.ref(db),updates);
 },
 async readOwnPhoto(id,photoId){
  await setup();const u=await store.guest(),event=await store.getEvent(id);
  if(!event)throw Error('Majlis telah dipadam.');
  const photos=await store.listContent(id,'photos'),item=photos.find(x=>x.id===photoId);
  if(!item||!u||item.uid!==u.uid)throw Error('Anda hanya boleh muat turun gambar milik sendiri.');
  if(isDemo()){
   const blob=item.mediaKey?await readBlob(item.mediaKey):null;
   if(!blob)throw Error('Gambar asal tidak ditemui dalam peranti ini.');
   return new Uint8Array(await blob.arrayBuffer());
  }
  if(item.privatePath){
   const safe=`events/${id}/vault/${event.ownerUid}/photos/${u.uid}/`;
   if(!item.privatePath.startsWith(safe))throw Error('Laluan fail bukan milik anda.');
   return new Uint8Array(await f.storageMod.getBytes(f.storageMod.ref(storage,item.privatePath),15*1024*1024));
  }
  if(!item.url)throw Error('Pautan gambar asal tidak tersedia.');
  const parsed=new URL(item.url);
  if(parsed.protocol!=='https:'||parsed.hostname!=='firebasestorage.googleapis.com'||!parsed.pathname.includes('/b/'+firebaseConfig.storageBucket+'/'))throw Error('Pautan lama tidak sah.');
  const res=await fetch(item.url);if(!res.ok)throw Error('Gambar lama tidak dapat dimuat turun.');
  return new Uint8Array(await res.arrayBuffer());
 },
 async updateEvent(id,updates){await setup();if(isDemo()){const existing=await store.getEvent(id);write('event',id,{...existing,...updates});return}const u=auth.currentUser;const event=await store.getEvent(id);if(!u||event.ownerUid!==u.uid)throw Error('Hanya pengurus majlis boleh mengubah tetapan.');await dbUpdate($getPath(id,'meta'),updates)},
 async listContent(id,kind){await setup();let data;if(isDemo())data=read(kind,id,[]);else{const d=await dbRead($getPath(id,kind))||{};data=Object.entries(d).map(([k,v])=>({...v,id:k}))}
  const all=await Promise.all(data.map(async item=>({...item,url:await getUrl(item)})));return all.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
 },
 async getUsed(id){await setup();const u=await store.guest();if(isDemo())return (await store.listContent(id,'photos')).filter(p=>p.uid===u.uid).length;return (await dbRead($getPath(id,'usage/'+u.uid)))?.count||0},
 async saveMedia(id,kind,file,guestName,extra={}){await setup();const event=await store.getEvent(id);if(!event||event.status!=='published')throw Error('Majlis tidak diterbitkan.');const u=await store.guest();
  if(kind==='voices'&&event.allowVoices===false)throw Error('Rakaman suara ditutup oleh pengurus.');
  if(kind==='photos'&&await store.getUsed(id)>=Math.max(1,Number(event.photoLimit)||3))throw Error('Had gambar untuk tetamu ini telah dicapai.');
  const mid=uuid();const item={uid:u.uid,guestName:guestName.trim().slice(0,55),createdAt:Date.now(),mimeType:file.type||'',...extra};
  if(isDemo()){item.id=mid;item.mediaKey=`${id}_${kind}_${mid}`;await putBlob(item.mediaKey,file);const array=read(kind,id,[]);array.push(item);write(kind,id,array);return item}
  let quotaReserved=false;
  if(kind==='photos'){
   const ref=f.dbMod.ref(db,$getPath(id,'usage/'+u.uid));const tx=await f.dbMod.runTransaction(ref,data=>{const count=data?.count||0;if(count>=event.photoLimit)return;return {count:count+1}}, {applyLocally:false});
   if(!tx.committed)throw Error('Had gambar telah dicapai.');quotaReserved=true;
  }
  try{
   const ext=kind==='photos'?'jpg':(file.type.includes('mp4')?'m4a':file.type.includes('ogg')?'ogg':'webm');
   const privatePath=`events/${id}/vault/${event.ownerUid}/${kind}/${u.uid}/${mid}.${ext}`;
   const publicPath=`events/${id}/public/${kind}/${u.uid}/${mid}.${kind==='photos'?'jpg':ext}`;
   // The full original goes to an organiser-read-only vault; guests only get a display copy.
   const original=f.storageMod.ref(storage,privatePath);
   await f.storageMod.uploadBytes(original,file,{contentType:file.type||'application/octet-stream'});
   const preview=kind==='photos'?await makePublicPhoto(file):file;
   const published=f.storageMod.ref(storage,publicPath);
   await f.storageMod.uploadBytes(published,preview,{contentType:kind==='photos'?'image/jpeg':file.type||'audio/webm'});
   item.url=await f.storageMod.getDownloadURL(published);item.privatePath=privatePath;item.publicPath=publicPath;
   await dbSet($getPath(id,`${kind}/${mid}`),item);item.id=mid;return item;
  }catch(e){if(quotaReserved){try{await f.dbMod.runTransaction(f.dbMod.ref(db,$getPath(id,'usage/'+u.uid)),v=>({count:Math.max(0,(v?.count||1)-1)}),{applyLocally:false})}catch{}}throw e}
 },
 async saveWish(id,guestName,message){await setup();const event=await store.getEvent(id);if(!event||event.status!=='published'||!event.allowWishes)throw Error('Ucapan tidak dibenarkan untuk majlis ini.');const u=await store.guest();const item={id:uuid(),uid:u.uid,guestName:guestName.trim().slice(0,55),message:message.trim().slice(0,600),createdAt:Date.now()};if(isDemo()){const arr=read('wishes',id,[]);arr.push(item);write('wishes',id,arr)}else{await dbSet($getPath(id,`wishes/${item.id}`),{...item,id:null})}return item},
 async getOwnerArchiveData(id){
  await setup();const event=await store.getEvent(id);ownerCheck(event);
  // Fresh data, not cached data passed by the browser user.
  const [photos,voices,wishes]=await Promise.all(['photos','voices','wishes'].map(k=>store.listContent(id,k)));
  return {event,photos,voices,wishes};
 },
 async readOwnerMedia(id,kind,item){
  await setup();const event=await store.getEvent(id);ownerCheck(event);
  if(kind!=='photos'&&kind!=='voices')throw Error('Format arkib tidak sah.');
  if(isDemo()){const data=item.mediaKey?await readBlob(item.mediaKey):null;if(!data)throw Error('Fail demo tidak ditemui.');return new Uint8Array(await data.arrayBuffer())}
  if(item.privatePath){const safe=`events/${id}/vault/${event.ownerUid}/${kind}/`;
   if(!item.privatePath.startsWith(safe))throw Error('Laluan fail peribadi tidak sah.');
   return new Uint8Array(await f.storageMod.getBytes(f.storageMod.ref(storage,item.privatePath),30*1024*1024));
  }
  // Files uploaded by older versions did not have a private vault. Legacy access is temporary.
  if(item.url){const parsed=new URL(item.url);
   if(parsed.protocol!=='https:'||parsed.hostname!=='firebasestorage.googleapis.com'||!parsed.pathname.includes('/b/'+firebaseConfig.storageBucket+'/'))throw Error('Pautan media lama tidak boleh dipercayai.');
   const response=await fetch(item.url);if(!response.ok)throw Error('Fail media lama tidak dapat dicapai.');return new Uint8Array(await response.arrayBuffer());
  }
  throw Error('Fail asal media tidak dijumpai.');
 },
 async deleteRecord(id,kind,recordId){await setup();if(isDemo()){write(kind,id,read(kind,id,[]).filter(v=>v.id!==recordId));return}
  const ev=await store.getEvent(id);if(!auth.currentUser||auth.currentUser.uid!==ev.ownerUid)throw Error('Akses tidak dibenarkan.');await f.dbMod.remove(f.dbMod.ref(db,$getPath(id,`${kind}/${recordId}`)));
 },
 async uploadCover(id,file){await setup();const ev=await store.getEvent(id);const u=await store.user();if(!isDemo()&&(!u||ev.ownerUid!==u.uid))throw Error('Akses tidak dibenarkan.');
  if(file.size>8*1024*1024)throw Error('Gambar mesti kurang daripada 8 MB.');
  if(isDemo()){const mediaKey=`${id}_cover_${uuid()}`;await putBlob(mediaKey,file);const url=await getUrl({mediaKey});write('cover',id,{mediaKey});await store.updateEvent(id,{coverUrl:''});return url}
  const path=`events/${id}/covers/${u.uid}/${uuid()}.jpg`;const uploaded=await f.storageMod.uploadBytes(f.storageMod.ref(storage,path),file,{contentType:file.type});const url=await f.storageMod.getDownloadURL(uploaded.ref);await store.updateEvent(id,{coverUrl:url});return url;
 },
 async cover(id,event){if(!isDemo())return event.coverUrl||'';const cover=read('cover',id,null);return cover?getUrl(cover):event.coverUrl||''},
 async giftQr(id,event){if(!isDemo())return event.giftQrUrl||'';const data=read('giftqr',id,null);return data?getUrl(data):event.giftQrUrl||''},
 async uploadGiftQr(id,file){await setup();const ev=await store.getEvent(id);const u=await store.user();if(!ev||(!isDemo()&&(!u||u.uid!==ev.ownerUid)))throw Error('Hanya pengurus boleh menambah QR pembayaran.');
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Hanya imej JPG, PNG atau WebP dibenarkan.');if(file.size>5*1024*1024)throw Error('QR terlalu besar; maksimum 5 MB.');
  if(isDemo()){const mediaKey=`${id}_giftqr_${uuid()}`;await putBlob(mediaKey,file);write('giftqr',id,{mediaKey});return getUrl({mediaKey})}
  const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';const path=`events/${id}/giftqr/${u.uid}/${uuid()}.${ext}`;
  const uploaded=await f.storageMod.uploadBytes(f.storageMod.ref(storage,path),file,{contentType:file.type});const url=await f.storageMod.getDownloadURL(uploaded.ref);await store.updateEvent(id,{giftQrUrl:url});return url;
 }
};
window.SekepingStore=store;
})();
