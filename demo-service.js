import {newId,dateIso} from './util.js';
const EVENTS='sekeping-events-v1';const CHANNEL='sekeping-updates';
let dbPromise,channel;
function openDB(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open('sekeping-photo-demo',1);req.onupgradeneeded=()=>{const db=req.result;db.createObjectStore('photos',{keyPath:'id'});db.createObjectStore('wishes',{keyPath:'id'});};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});return dbPromise;}
async function store(name,mode,op){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(name,mode),os=tx.objectStore(name);let result;const req=op(os);req.onsuccess=()=>result=req.result;req.onerror=()=>reject(req.error);tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);});}
const all=(name)=>store(name,'readonly',os=>os.getAll());
const one=(name,id)=>store(name,'readonly',os=>os.get(id));
const put=(name,value)=>store(name,'readwrite',os=>os.put(value));
const del=(name,id)=>store(name,'readwrite',os=>os.delete(id));
function events(){try{const e=JSON.parse(localStorage.getItem(EVENTS)||'null');if(e&&Array.isArray(e))return e}catch{}const e=[{id:'demo-majlis',ownerUid:'demo-admin',title:'Majlis Kenangan Kita',date:dateIso(),venue:'Sebuah hari yang istimewa',limit:20,manualApproval:false,galleryLocked:false,acceptUploads:true,createdAt:Date.now()}];try{localStorage.setItem(EVENTS,JSON.stringify(e))}catch{}return e;}
function saveEvents(arr){localStorage.setItem(EVENTS,JSON.stringify(arr));notify();}
const listeners=new Set();function notify(){try{channel?.postMessage('change')}catch{}for(const f of listeners)f();}
function listen(refresh){listeners.add(refresh);return()=>listeners.delete(refresh)}
function localUid(){try{let u=localStorage.getItem('sekeping-demo-guest-uid');if(!u){u=newId();localStorage.setItem('sekeping-demo-guest-uid',u)}return u}catch{return 'guest-browser'}}}
const observable=(getter,cb,onError)=>{let active=true;let urls=new Set();const refresh=async()=>{if(!active)return;try{const res=await getter();if(!active)return;if(Array.isArray(res))res.forEach(p=>{if(p.url?.startsWith('blob:'))urls.add(p.url)});cb(res)}catch(e){onError?.(e)}};const off=listen(refresh);refresh();return()=>{active=false;off();urls.forEach(x=>URL.revokeObjectURL(x))}};
export async function createService(){await openDB();try{channel=new BroadcastChannel(CHANNEL);channel.onmessage=()=>{for(const f of listeners)f()}}catch{}window.addEventListener('storage',e=>{if(e.key===EVENTS)for(const f of listeners)f()});
return{
 mode:'demo',uid:()=>localUid(),
 authChanged(cb){cb({uid:'demo-admin',email:'demo@tempatan',isDemo:true});return()=>{}},
 async signIn(){return {uid:'demo-admin'}},async signOut(){},
 async getEvent(id){return events().find(x=>x.id===id)||null},
 watchEvent(id,cb,er){return observable(async()=>events().find(x=>x.id===id)||null,cb,er)},
 watchPhotos(id,cb,{admin=false,onError}={}){const cached=new Map();return observable(async()=>{const rec=(await all('photos')).filter(x=>x.eventId===id&&(admin||x.status==='approved')).sort((a,b)=>b.createdAt-a.createdAt);return rec.map(p=>{if(!cached.has(p.id))cached.set(p.id,URL.createObjectURL(p.blob));return {...p,url:cached.get(p.id),blob:undefined}})},cb,onError)},
 watchWishes(id,cb,onError){return observable(async()=>(await all('wishes')).filter(x=>x.eventId===id).sort((a,b)=>b.createdAt-a.createdAt),cb,onError)},
 watchMyCount(id,uid,cb,onError){return observable(async()=>(await all('photos')).filter(x=>x.eventId===id&&x.guestUid===uid).length,cb,onError)},
 watchMyEvents(uid,cb,onError){return observable(async()=>events().sort((a,b)=>b.createdAt-a.createdAt),cb,onError)},
 async uploadPhoto(id,blob,{guestName,filter}){const ev=events().find(e=>e.id===id);if(!ev?.acceptUploads)throw Error('Majlis tidak menerima gambar buat masa ini.');const photo={id:newId(),eventId:id,guestUid:localUid(),guestName:guestName.slice(0,40),filter,status:ev.manualApproval?'pending':'approved',createdAt:Date.now(),blob};await put('photos',photo);notify();return photo;},
 async addWish(id,text,guestName){const ev=events().find(e=>e.id===id);if(!ev?.acceptUploads)throw Error('Majlis tidak menerima ucapan buat masa ini.');const rec={id:newId(),eventId:id,guestUid:localUid(),guestName:guestName.slice(0,40),text:text.slice(0,500),createdAt:Date.now()};await put('wishes',rec);notify();return rec;},
 async createEvent(data){const ev={...data,id:newId(),ownerUid:'demo-admin',createdAt:Date.now()};saveEvents([...events(),ev]);return ev;},
 async updateEvent(id,data){const arr=events().map(x=>x.id===id?{...x,...data}:x);saveEvents(arr);},
 async setPhotoStatus(id,pid,status){const rec=await one('photos',pid);if(!rec||rec.eventId!==id)throw Error('Gambar tidak ditemui');await put('photos',{...rec,status});notify()},
 async deletePhoto(id,pid){const rec=await one('photos',pid);if(rec?.eventId===id){await del('photos',pid);notify()}},
 async deleteWish(id,wid){const rec=await one('wishes',wid);if(rec?.eventId===id){await del('wishes',wid);notify()}},
 async getPhotoBlob(photo){const rec=await one('photos',photo.id);if(!rec)throw Error('Fail gambar tidak ditemui');return rec.blob;}
};}
