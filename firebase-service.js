/** Firebase JS modular SDK — only loaded when config.js is filled in. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import {getAuth,onAuthStateChanged,signInAnonymously,signInWithEmailAndPassword,signOut as fbSignOut} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import {getFirestore,doc,getDoc,setDoc,updateDoc,deleteDoc,collection,query,where,onSnapshot,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js';
import {getStorage,ref as stRef,uploadBytes,getDownloadURL,deleteObject,getBlob} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js';
import {newId} from './util.js';
function asDate(value){return value?.toMillis?.()??value??0}
export async function createService(config){const app=initializeApp(config);const auth=getAuth(app),db=getFirestore(app),storage=getStorage(app);
const docEvent=(id)=>doc(db,'events',id);const getEv=async(id)=>{const s=await getDoc(docEvent(id));return s.exists()?{...s.data(),id:s.id,createdAt:asDate(s.data().createdAt)}:null};
const owner=(ev)=>auth.currentUser?.uid===ev.ownerUid;
const authReady=new Promise(resolve=>{const unsub=onAuthStateChanged(auth,u=>{unsub();resolve(u)})});await authReady;
async function enterAsGuest(){if(!auth.currentUser)await signInAnonymously(auth);return auth.currentUser;}
function watchSnapshot(q,cb,onError,transform=(s)=>s.docs.map(d=>({...d.data(),id:d.id,createdAt:asDate(d.data().createdAt)}))){return onSnapshot(q,s=>cb(transform(s)),onError)}
return{
 mode:'firebase',uid:()=>auth.currentUser?.uid||'',
 authChanged(cb){return onAuthStateChanged(auth,cb)},
 signIn:(email,password)=>signInWithEmailAndPassword(auth,email,password),signOut:()=>fbSignOut(auth),
 async getEvent(id){await enterAsGuest();return getEv(id)},
 watchEvent(id,cb,er){return onSnapshot(docEvent(id),s=>cb(s.exists()?{...s.data(),id:s.id,createdAt:asDate(s.data().createdAt)}:null),er)},
 watchPhotos(id,cb,{admin=false,onError}={}){const col=collection(db,'events',id,'photos');const q=admin?col:query(col,where('status','==','approved'));
 let call=0,done=false;const off=watchSnapshot(q,async rec=>{const curr=++call;const results=await Promise.all(rec.map(async p=>{try{return{...p,url:await getDownloadURL(stRef(storage,p.storagePath))}}catch(e){return{...p,url:'',loadError:String(e?.code||e)}}}));if(!done&&call===curr)cb(results.sort((a,b)=>b.createdAt-a.createdAt));},onError);return()=>{done=true;off()};},
 watchWishes(id,cb,onError){return watchSnapshot(collection(db,'events',id,'wishes'),r=>cb(r.sort((a,b)=>b.createdAt-a.createdAt)),onError)},
 watchMyCount(id,uid,cb,onError){return watchSnapshot(query(collection(db,'events',id,'photos'),where('guestUid','==',uid)),r=>cb(r.length),onError)},
 watchMyEvents(uid,cb,onError){return watchSnapshot(query(collection(db,'events'),where('ownerUid','==',uid)),r=>cb(r.sort((a,b)=>b.createdAt-a.createdAt)),onError)},
 async uploadPhoto(id,blob,{guestName,filter}){await enterAsGuest();const ev=await getEv(id);if(!ev?.acceptUploads)throw Error('Majlis tidak menerima gambar.');const idPhoto=newId(),storagePath=`events/${id}/${auth.currentUser.uid}/${idPhoto}`;
 await uploadBytes(stRef(storage,storagePath),blob,{contentType:'image/jpeg',cacheControl:'public,max-age=86400'});
 const value={guestUid:auth.currentUser.uid,guestName:guestName.slice(0,40),filter,status:ev.manualApproval?'pending':'approved',storagePath,createdAt:serverTimestamp()};
 try{await setDoc(doc(db,'events',id,'photos',idPhoto),value)}catch(e){try{await deleteObject(stRef(storage,storagePath))}catch{}throw e}
 return{id:idPhoto,...value};},
 async addWish(id,text,name){await enterAsGuest();const idWish=newId();await setDoc(doc(db,'events',id,'wishes',idWish),{guestUid:auth.currentUser.uid,guestName:name.slice(0,40),text:text.slice(0,500),createdAt:serverTimestamp()})},
 async createEvent(data){const user=auth.currentUser;if(!user||user.isAnonymous||!user.email)throw Error('Log masuk sebagai penganjur.');const ev={id:newId(),ownerUid:user.uid,...data,createdAt:serverTimestamp()};await setDoc(docEvent(ev.id),Object.fromEntries(Object.entries(ev).filter(([k])=>k!=='id')));return ev},
 updateEvent:(id,data)=>updateDoc(docEvent(id),data),
 setPhotoStatus:(id,pid,status)=>updateDoc(doc(db,'events',id,'photos',pid),{status}),
 async deletePhoto(id,pid){const s=await getDoc(doc(db,'events',id,'photos',pid));if(!s.exists())return;const path=s.data().storagePath;await deleteDoc(s.ref);try{await deleteObject(stRef(storage,path))}catch(e){console.warn('Photo file cleanup failed',e)}},
 deleteWish:(id,wid)=>deleteDoc(doc(db,'events',id,'wishes',wid)),
 getPhotoBlob:async(photo)=>getBlob(stRef(storage,photo.storagePath))
};}
