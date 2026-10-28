import { $, $$, esc, fmtDate, fmtClock, dateIso, getGuestName, setGuestName, eventLink, toast, copy, friendlyError, downloadBlob, handleSubscriptions, safeImage, buildQR } from './util.js';
const conf=window.SEKEPING_CONFIG?.firebase||{};
const online=Boolean(conf.apiKey&&conf.projectId&&conf.appId);
let service;
try { service=online ? await (await import('./firebase-service.js')).createService(conf) : await (await import('./demo-service.js')).createService(); }
catch(error){console.error(error);toast('Tidak dapat memulakan sistem: '+friendlyError(error),true);const fatal=document.createElement('div');fatal.className='admin-notice';fatal.style.margin='25px';fatal.textContent='Sistem tidak dapat dimulakan. Semak Firebase config atau buka website melalui HTTPS. '+friendlyError(error);document.body.prepend(fatal);throw error;}
if(service.mode==='demo')$('#modeBanner')?.classList.remove('hidden');
if('serviceWorker' in navigator && location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
const svgIcon=name=>`<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="#s-${name}"></use></svg>`;
const FILTERS={classic:'sepia(.19) saturate(.77) contrast(.93) brightness(1.07)',warm:'sepia(.28) saturate(1.27) contrast(1.02) brightness(1.05)',mono:'grayscale(1) contrast(1.1)',natural:'none'};
const displayPhoto=(p)=>safeImage(p.url)||'';
const formatTime=p=>fmtClock(p.createdAt);
function setBtnWorking(btn,busy,label='Memproses...'){if(!btn)return; if(busy){btn.dataset.oldLabel=btn.innerHTML;btn.textContent=label;btn.disabled=true}else{btn.innerHTML=btn.dataset.oldLabel||btn.innerHTML;btn.disabled=false}}
function focusSection(id){const el=document.getElementById(id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState({},'',location.pathname+location.search+'#'+id)}}
async function guestApp(){
 let eventId=new URLSearchParams(location.search).get('event')||(service.mode==='demo'?'demo-majlis':null),event=null,photos=[],wishes=[],remaining=20,count=0,selectedFilter='classic',stream=null,cameraFacing='environment',previewBlob=null,previewUrl=null,activePhoto=null,flashEnabled=false,cameraReady=false,cameraStarting=false,unsub=handleSubscriptions(),photosOff=null,myOff=null,guestNameResolver=null;
 const video=$('#cameraVideo'),pic=$('#cameraPreview'),place=$('#cameraPlaceholder'),shutter=$('#shutterBtn'),sendBtn=$('#sendPhotoBtn'),nameModal=$('#nameModal');
 const setStatus=(s)=>$('#cameraState').textContent=s;
 const setRemaining=(n)=>{remaining=Math.max(0,n);$('#filmRemaining').textContent=remaining;$('#camShotLabel').textContent=`${Math.max(1,count+1)} / ${event?.limit||20}`;shutter.disabled=!cameraReady||!remaining||!!previewBlob||!event?.acceptUploads};
 $('#stampDate').textContent=new Date().toLocaleDateString('ms-MY',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
 $$('[data-go]').forEach(el=>el.addEventListener('click',()=>{focusSection(el.dataset.go);if(el.dataset.go==='camera' && !stream && event?.acceptUploads)startCamera();}));
 function showEmpty(text='Belum ada gambar. Jadilah yang pertama menangkap momen!'){$('#photoGallery').innerHTML=`<div class="empty-gallery"><span>${svgIcon('sparkles')}</span><h3>Setiap kenangan ada permulaan.</h3><p>${esc(text)}</p><button class="btn btn-cream" data-go="camera">Ambil gambar ${svgIcon('arrow-up-right')}</button></div>`;$('#photoGallery [data-go]')?.addEventListener('click',()=>focusSection('camera'))}
 function renderPhotos(){const show=photos.filter(p=>p.status==='approved');$('#galleryCount').textContent=String(show.length).padStart(2,'0');$('#heroPhotoCount').textContent=show.length;
 if(event?.galleryLocked){$('#galleryLockTag').classList.remove('hidden');showEmpty('Galeri masih dikunci penganjur. Anda tetap boleh menghantar gambar.');return}
 $('#galleryLockTag').classList.add('hidden');if(!show.length){showEmpty();return}
 $('#photoGallery').innerHTML=show.map(p=>`<button class="photo-card" type="button" data-photo="${esc(p.id)}"><img loading="lazy" src="${esc(displayPhoto(p))}" alt="Gambar dirakam oleh ${esc(p.guestName)}"><b>${svgIcon('sparkles')} ${esc(p.guestName||'Tetamu')}</b><small>${esc(formatTime(p))} · Sekeping 35mm</small></button>`).join('');
 $$('[data-photo]',$('#photoGallery')).forEach(b=>b.addEventListener('click',()=>openLightbox(show.find(p=>p.id===b.dataset.photo))));}
 function renderWishes(){$('#wishesList').innerHTML=wishes.length?wishes.slice(0,35).map(w=>`<div class="wish-item"><p>“${esc(w.text)}”</p><span>${svgIcon('sparkles')} ${esc(w.guestName)} · ${esc(formatTime(w))}</span></div>`).join(''):'<div class="empty-wishes">Belum ada ucapan. Jadilah yang pertama menitipkan doa</div>'}
 function syncEvent(e){event=e;if(!e){$('#eventTitle').textContent='Pautan majlis tidak ditemui';$('#eventDetails').textContent='Semak QR atau minta pautan daripada penganjur.';$('#cameraState').textContent='EVENT NOT FOUND';sendBtn.disabled=true;shutter.disabled=true;showEmpty('Majlis tidak ditemui.');return}
 $('#eventTitle').textContent=e.title;document.title=`${e.title} — Sekeping`;$('#eventDateTag').textContent=fmtDate(e.date).toUpperCase();$('#eventDetails').textContent=[fmtDate(e.date),e.venue].filter(Boolean).join(' · ');$('#filmLimit').textContent=e.limit||20;
 $('#filmRemaining').textContent=remaining;setRemaining(Math.max(0,(e.limit||20)-count));const locked=!e.acceptUploads;sendBtn.disabled=locked;$('#photoUpload').disabled=locked;$('#sendWishBtn').disabled=locked;$('#wishText').disabled=locked;$('#shutterBtn').disabled=locked||!cameraReady||!remaining||!!previewBlob;
 if(locked)setStatus('PENGHANTARAN DITUTUP');if(e.galleryLocked){if(photosOff){photosOff();photosOff=null}photos=[];renderPhotos()}else if(!photosOff){photosOff=service.watchPhotos(eventId,data=>{photos=data;renderPhotos()},{onError:err=>toast(friendlyError(err),true)});renderPhotos()}
 }
 function showNameModal(){nameModal.classList.remove('hidden');$('#guestNameInput').focus();}
 async function ensureGuestName(){const prev=getGuestName(eventId);if(prev)return prev;showNameModal();return new Promise(resolve=>guestNameResolver=resolve)}
 $('#nameForm').addEventListener('submit',e=>{e.preventDefault();const n=$('#guestNameInput').value.trim();if(n.length<2)return;setGuestName(eventId,n);nameModal.classList.add('hidden');$('#wishName').value=n;if(guestNameResolver){guestNameResolver(n);guestNameResolver=null}});
 nameModal.addEventListener('click',e=>{if(e.target!==nameModal)return;nameModal.classList.add('hidden');if(guestNameResolver){guestNameResolver(null);guestNameResolver=null}});
 function cameraHelp(message){
  const node=$('#cameraHelp');if(node)node.textContent=message;
  place.classList.remove('hidden');
 }
 function stopCamera(){cameraReady=false;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}video.pause();video.srcObject=null;video.classList.add('hidden');shutter.disabled=true;}
 async function startCamera(){
  if(cameraStarting)return;
  if(!event?.acceptUploads){toast('Majlis ini tidak menerima gambar buat masa ini.',true);return}
  if(remaining<1){toast('Filem gambar anda sudah habis.',true);return}
  if(!window.isSecureContext){
    setStatus('HTTPS DIPERLUKAN');
    cameraHelp('Kamera live hanya boleh digunakan melalui HTTPS (contohnya GitHub Pages). Buka website sebenar menggunakan Safari atau Chrome. Anda masih boleh guna butang kamera telefon.');
    toast('Buka website melalui HTTPS untuk mengakses kamera live.',true);return;
  }
  if(!navigator.mediaDevices?.getUserMedia){
    setStatus('GUNA KAMERA TELEFON');
    cameraHelp('Browser ini tidak menyokong kamera live. Tekan “Ambil guna kamera telefon”, atau buka laman melalui Safari atau Chrome.');
    toast('Kamera live tidak tersedia. Cuba kamera telefon.',true);return;
  }
  cameraStarting=true;
  stopCamera();
  const startButton=$('#startCameraBtn');if(startButton)startButton.disabled=true;
  setStatus('MEMBUKA KAMERA');
  try{
    // Start with the least restrictive constraints. Some iOS cameras reject strict resolutions.
    const requests=[{audio:false,video:{facingMode:{ideal:cameraFacing}}},{audio:false,video:true}];
    let lastError;
    for(const constraints of requests){
      try{stream=await navigator.mediaDevices.getUserMedia(constraints);break}
      catch(err){lastError=err;if(!['OverconstrainedError','NotFoundError','TypeError'].includes(err.name))throw err}
    }
    if(!stream)throw lastError||new Error('Tiada kamera ditemui.');
    video.srcObject=stream;video.muted=true;video.playsInline=true;
    video.classList.toggle('mirrored',cameraFacing==='user');
    video.style.filter=FILTERS[selectedFilter];
    video.classList.remove('hidden');
    await video.play();
    // iOS Safari can resolve play() before videoWidth is ready: never silently ignore shutter.
    await new Promise((resolve,reject)=>{
      const started=Date.now();
      const poll=()=>{
        if(video.videoWidth>0 && video.videoHeight>0 && video.readyState>=2)return resolve();
        if(Date.now()-started>9000)return reject(new Error('Video belum sedia. Cuba kamera telefon.'));
        setTimeout(poll,100);
      };poll();
    });
    place.classList.add('hidden');if(!previewBlob)pic.classList.add('hidden');
    cameraReady=true;setStatus('KAMERA SEDIA');
    setRemaining(Math.max(0,(event?.limit||20)-count));
  }catch(err){
    console.warn('Sekeping camera:',err);
    stopCamera();
    const reason=err.name==='NotAllowedError'||err.name==='PermissionDeniedError'
      ?'Kebenaran kamera disekat. Benarkan kamera pada tetapan Safari/Chrome dan muat semula halaman.'
      :err.name==='NotReadableError'||err.name==='AbortError'
      ?'Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi kamera lain atau gunakan kamera telefon.'
      :err.name==='NotFoundError'
      ?'Tiada kamera dikesan pada peranti ini. Gunakan kamera telefon atau pilih gambar.'
      :'Kamera live tidak dapat dimulakan. Cuba buka di Safari atau Chrome, atau gunakan kamera telefon.';
    setStatus('KAMERA TIDAK TERSEDIA');cameraHelp(reason);toast(reason,true);
  }finally{cameraStarting=false;if(startButton)startButton.disabled=false}
 }
 $('#startCameraBtn').addEventListener('click',startCamera);
 const nativeInput=$('#nativeCameraInput');
 const nativeCamera=()=>{
   if(!event?.acceptUploads){toast('Penghantaran gambar ditutup.',true);return}
   if(remaining<1){toast('Filem gambar sudah habis.',true);return}
   nativeInput.click();
 };
 $('#nativeCameraBtn').addEventListener('click',nativeCamera);
 $('#nativeCameraPlaceholder').addEventListener('click',nativeCamera);
 nativeInput.addEventListener('change',e=>{const file=e.target.files?.[0];if(file)processFile(file);e.target.value='';});
 $('#flipCameraBtn').addEventListener('click',()=>{cameraFacing=cameraFacing==='environment'?'user':'environment';if(stream)startCamera();else toast('Kamera '+(cameraFacing==='user'?'depan':'belakang')+' dipilih.');});
 $('#flashBtn').addEventListener('click',()=>{flashEnabled=!flashEnabled;$('#flashBtn').classList.toggle('active',flashEnabled);toast(flashEnabled?'Flash skrin diaktifkan.':'Flash skrin dimatikan.');});
 $('#filterList').addEventListener('click',e=>{const btn=e.target.closest('[data-filter]');if(!btn)return;selectedFilter=btn.dataset.filter;$$('.filter-option').forEach(b=>b.classList.toggle('selected',b===btn));video.style.filter=FILTERS[selectedFilter]});
 const canvas=document.createElement('canvas');canvas.width=840;canvas.height=1120;
 function makeFrame(source,w,h,mirror=false){const ctx=canvas.getContext('2d');const cw=canvas.width,ch=canvas.height;ctx.fillStyle='#eee7df';ctx.fillRect(0,0,cw,ch);const scale=Math.max(cw/w,ch/h),cropW=cw/scale,cropH=ch/scale;
 ctx.save();ctx.filter=FILTERS[selectedFilter];if(mirror){ctx.translate(cw,0);ctx.scale(-1,1)}ctx.drawImage(source,(w-cropW)/2,(h-cropH)/2,cropW,cropH,0,0,cw,ch);ctx.restore();ctx.save();const grad=ctx.createLinearGradient(0,ch*.76,0,ch);grad.addColorStop(0,'transparent');grad.addColorStop(1,'#0008');ctx.fillStyle=grad;ctx.fillRect(0,ch*.76,cw,ch*.24);
 const stamp=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();ctx.textAlign='left';ctx.font='bold 26px monospace';ctx.fillStyle='#ffc58a';ctx.shadowColor='#000a';ctx.shadowBlur=6;ctx.fillText('SEKEPING · '+stamp,37,ch-42);ctx.restore();return new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.83));}
 function showPreview(blob){if(!blob){toast('Gagal menyediakan gambar.',true);return}if(previewUrl)URL.revokeObjectURL(previewUrl);previewBlob=blob;previewUrl=URL.createObjectURL(blob);pic.src=previewUrl;pic.classList.remove('hidden');video.classList.add('hidden');place.classList.add('hidden');$('#cameraReview').classList.remove('hidden');$('.camera-controls').classList.add('hidden');setStatus('FILM DEVELOPED');shutter.disabled=true;}
 shutter.addEventListener('click',async()=>{if(!cameraReady||!stream||!remaining){toast('Aktifkan kamera dahulu atau gunakan kamera telefon.',true);return}if(!video.videoWidth){cameraHelp('Video belum sedia. Cuba aktifkan kamera sekali lagi atau gunakan kamera telefon.');toast('Video kamera belum sedia.',true);return}if(flashEnabled){const f=$('#flashCover');f.classList.add('flash');setTimeout(()=>f.classList.remove('flash'),130)}try{const blob=await makeFrame(video,video.videoWidth,video.videoHeight,cameraFacing==='user');showPreview(blob)}catch(err){toast('Gagal mengambil gambar: '+friendlyError(err),true)}});
 async function processFile(file){if(!file)return;if(!event?.acceptUploads){toast('Penghantaran gambar ditutup.',true);return}if(remaining<=0){toast('Filem anda sudah habis.',true);return}if(file.size>18*1024*1024){toast('Fail terlalu besar. Pilih imej bawah 18MB.',true);return}
 let url;try{url=URL.createObjectURL(file);const img=new Image();img.src=url;await img.decode();const blob=await makeFrame(img,img.naturalWidth,img.naturalHeight);showPreview(blob);focusSection('camera')}catch(err){toast('Tidak dapat memproses gambar ini. Cuba imej JPEG/PNG.',true)}finally{if(url)URL.revokeObjectURL(url)}}
 $('#photoUpload').addEventListener('change',e=>{processFile(e.target.files[0]);e.target.value=''});
 $('#retakeBtn').addEventListener('click',async()=>{if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;previewBlob=null;pic.src='';pic.classList.add('hidden');$('#cameraReview').classList.add('hidden');$('.camera-controls').classList.remove('hidden');if(!stream){place.classList.remove('hidden');setStatus('READY TO SHOOT')}else{video.classList.remove('hidden');setStatus('READY TO SHOOT')}setRemaining(Math.max(0,(event?.limit||20)-count));});
 let isSubmittingPhoto=false;sendBtn.addEventListener('click',async()=>{if(isSubmittingPhoto||!previewBlob||!event?.acceptUploads)return;isSubmittingPhoto=true;const name=await ensureGuestName();if(!name){isSubmittingPhoto=false;return}setBtnWorking(sendBtn,true,'Sedang menghantar...');try{await service.uploadPhoto(eventId,previewBlob,{guestName:name,filter:selectedFilter});toast(event.manualApproval?'Gambar diterima! Menunggu semakan penganjur.':'Gambar berjaya dimasukkan ke galeri!');$('#retakeBtn').click();focusSection('gallery')}catch(err){toast('Gagal hantar gambar: '+friendlyError(err),true)}finally{isSubmittingPhoto=false;setBtnWorking(sendBtn,false)}});
 $('#wishName').value=eventId?getGuestName(eventId):'';
 $('#wishForm').addEventListener('submit',async e=>{e.preventDefault();const name=$('#wishName').value.trim(),text=$('#wishText').value.trim();if(!name||name.length<2||text.length<3){toast('Isi nama dan ucapan dahulu.',true);return}if(!event?.acceptUploads)return;setBtnWorking($('#sendWishBtn'),true,'Menghantar...');try{await service.addWish(eventId,text,name);setGuestName(eventId,name);$('#wishText').value='';toast('Ucapan berjaya dihantar.')}catch(err){toast('Gagal hantar ucapan: '+friendlyError(err),true)}finally{setBtnWorking($('#sendWishBtn'),false)}});
 $('#refreshGalleryBtn').addEventListener('click',()=>{renderPhotos();toast('Galeri dikemas kini secara langsung.')});
 function openLightbox(p){if(!p)return;activePhoto=p;$('#lightboxImg').src=displayPhoto(p);$('#lightboxTitle').textContent=p.guestName;$('#lightboxDate').textContent=fmtDate(event.date)+' · '+fmtClock(p.createdAt);$('#lightbox').classList.remove('hidden')}
 $('#closeLightbox').addEventListener('click',()=>$('#lightbox').classList.add('hidden'));$('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')$('#lightbox').classList.add('hidden')});
 window.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#lightbox').classList.add('hidden');nameModal.classList.add('hidden');if(guestNameResolver){guestNameResolver(null);guestNameResolver=null}}});
 $('#downloadLightbox').addEventListener('click',async()=>{if(!activePhoto)return;try{const blob=await service.getPhotoBlob(activePhoto);downloadBlob(blob,`sekeping-${activePhoto.id}.jpg`)}catch{window.open(displayPhoto(activePhoto),'_blank','noopener');toast('Jika gambar tidak dimuat turun, tekan lama pada gambar untuk simpan.')}});
 window.addEventListener('pagehide',stopCamera);
 if(!eventId){syncEvent(null);toast('Tiada majlis dipilih. Buka link QR yang diberikan oleh penganjur.',true);return}
 try{const ev=await service.getEvent(eventId);if(!ev){syncEvent(null);return}unsub.add(service.watchEvent(eventId,syncEvent,err=>toast(friendlyError(err),true)));unsub.add(service.watchWishes(eventId,data=>{wishes=data;renderWishes()},err=>toast(friendlyError(err),true)));
 // This count is a convenient browser-level limit; production server enforcement requires backend checks.
 unsub.add(service.watchMyCount(eventId,service.uid(),num=>{count=num;setRemaining(Math.max(0,(event?.limit||20)-num))},err=>toast(friendlyError(err),true)));
 }catch(err){syncEvent(null);toast('Tidak dapat membuka majlis: '+friendlyError(err),true)}
}
async function adminApp(){
 let user=null,events=[],selectedId=null,event=null,photos=[],wishes=[],mode='overview',authOff=null,eventsOff=null,selectedSub=handleSubscriptions(),adminOpened=false;
 const pageTitles={overview:'Ringkasan majlis',settings:'Tetapan majlis',photos:'Urus gambar',qr:'Kod QR & kongsi',notes:'Buku ucapan'};
 function panel(name){mode=name;$$('[data-panel]').forEach(b=>b.classList.toggle('active',b.dataset.panel===name));$$('.admin-panel').forEach(s=>s.classList.toggle('hidden',s.id!==`panel-${name}`));$('#adminPageTitle').textContent=pageTitles[name]||'Dashboard';if(name==='qr')drawQR();if(name==='photos')renderAdminPhotos();if(name==='notes')renderAdminWishes();}
 $$('[data-panel]').forEach(btn=>btn.addEventListener('click',()=>panel(btn.dataset.panel)));
 const opening=()=>{adminOpened=true;$('#adminLogin').classList.add('hidden');$('#adminApp').classList.remove('hidden');$('#adminBadge').innerHTML=svgIcon('sparkles')+(service.mode==='demo'?' MOD DEMO':' FIREBASE LIVE');$('#demoAppNotice').classList.toggle('hidden',service.mode!=='demo');panel('overview');loadEvents();};
 const closing=()=>{$('#adminLogin').classList.remove('hidden');$('#adminApp').classList.add('hidden');selectedSub.clear();eventsOff?.();eventsOff=null;selectedId=null;adminOpened=false};
 if(service.mode==='demo'){$('#loginForm').classList.add('hidden');$('#demoLoginMessage').classList.remove('hidden');$('#demoLoginBtn').classList.remove('hidden');$('#demoLoginBtn').addEventListener('click',opening);}else{
 authOff=service.authChanged(u=>{user=u;if(u&&!u.isAnonymous&&u.email){if(!adminOpened)opening()}else if(adminOpened)closing()});
 $('#loginForm').addEventListener('submit',async e=>{e.preventDefault();const btn=$('#loginBtn');setBtnWorking(btn,true,'Memeriksa akaun...');try{await service.signIn($('#loginEmail').value.trim(),$('#loginPassword').value)}catch(err){toast(friendlyError(err),true)}finally{setBtnWorking(btn,false)}});
 }
 $('#logoutBtn').addEventListener('click',async()=>{if(service.mode==='demo')closing();else try{await service.signOut()}catch(err){toast(friendlyError(err),true)}});
 function loadEvents(){if(eventsOff)eventsOff();eventsOff=service.watchMyEvents(user?.uid||'demo-admin',items=>{events=items;const select=$('#eventSelect');select.innerHTML=items.length?items.map(e=>`<option value="${esc(e.id)}">${esc(e.title)}</option>`).join(''):'<option value="">Tiada majlis</option>';
 $('#adminEmpty').classList.toggle('hidden',items.length>0);if(!items.length){selectedSub.clear();selectedId=null;event=null;$$('.admin-panel').forEach(p=>p.classList.add('hidden'));return}
 const params=new URLSearchParams(location.search),target=params.get('event');const next=items.some(x=>x.id===selectedId)?selectedId:(items.some(x=>x.id===target)?target:items[0].id);select.value=next;if(next!==selectedId)selectEvent(next);else renderOverview();},err=>toast('Gagal memuatkan majlis: '+friendlyError(err),true));}
 $('#eventSelect').addEventListener('change',e=>selectEvent(e.target.value));
 function selectEvent(id){if(!id)return;selectedSub.clear();selectedId=id;event=events.find(e=>e.id===id)||null;photos=[];wishes=[];$('#adminEmpty').classList.add('hidden');panel(mode);selectedSub.add(service.watchEvent(id,e=>{event=e;if(!e){toast('Majlis tidak ditemui.',true);return}renderOverview();fillSettings();drawQR()},err=>toast(friendlyError(err),true)));
 selectedSub.add(service.watchPhotos(id,items=>{photos=items;renderOverview();renderAdminPhotos()},{admin:true,onError:err=>toast(friendlyError(err),true)}));selectedSub.add(service.watchWishes(id,items=>{wishes=items;renderOverview();renderAdminWishes()},err=>toast(friendlyError(err),true)));renderOverview();}
 function renderOverview(){if(!event)return;$('#overviewTitle').textContent=event.title;$('#overviewDate').textContent=fmtDate(event.date)+(event.venue?' · '+event.venue:'');$('#statAll').textContent=photos.length;$('#statApproved').textContent=photos.filter(p=>p.status==='approved').length;$('#statPending').textContent=photos.filter(p=>p.status==='pending').length;$('#statWishes').textContent=wishes.length;
 $('#previewEventLink').href=eventLink(selectedId);$('#overviewUrl').textContent=eventLink(selectedId);
 $('#recentPhotos').innerHTML=photos.length?photos.slice(0,4).map(p=>`<img src="${esc(displayPhoto(p))}" alt="Foto oleh ${esc(p.guestName)}" loading="lazy">`).join(''):'<div class="empty-state">Belum ada gambar. Kongsi kod QR dengan tetamu untuk mula menerima foto.</div>';
 }
 $('#overviewCopyLink').addEventListener('click',()=>{if(selectedId)copy(eventLink(selectedId))});
 function fillSettings(){if(!event)return;$('#settingTitle').value=event.title;$('#settingDate').value=event.date||dateIso();$('#settingVenue').value=event.venue||'';$('#settingLimit').value=event.limit||20;$('#settingUploads').checked=Boolean(event.acceptUploads);$('#settingModeration').checked=Boolean(event.manualApproval);$('#settingLocked').checked=Boolean(event.galleryLocked)}
 $('#settingsForm').addEventListener('submit',async e=>{e.preventDefault();if(!selectedId)return;const btn=$('#settingsForm button[type="submit"]'),data={title:$('#settingTitle').value.trim(),date:$('#settingDate').value,venue:$('#settingVenue').value.trim(),limit:Number($('#settingLimit').value),acceptUploads:$('#settingUploads').checked,manualApproval:$('#settingModeration').checked,galleryLocked:$('#settingLocked').checked};if(!data.title||data.limit<1||data.limit>50)return;setBtnWorking(btn,true,'Menyimpan...');try{await service.updateEvent(selectedId,data);toast('Tetapan majlis berjaya disimpan.')}catch(err){toast('Gagal simpan: '+friendlyError(err),true)}finally{setBtnWorking(btn,false)}});
 const showCreate=()=>{$('#createEventModal').classList.remove('hidden');$('#newDate').value=dateIso();$('#newTitle').focus()};
 $('#newEventBtn').addEventListener('click',showCreate);$$('[data-create-event]').forEach(b=>b.addEventListener('click',showCreate));$$('[data-close-create]').forEach(b=>b.addEventListener('click',()=>$('#createEventModal').classList.add('hidden')));
 $('#createEventModal').addEventListener('click',e=>{if(e.target.id==='createEventModal')e.currentTarget.classList.add('hidden')});
 $('#createEventForm').addEventListener('submit',async e=>{e.preventDefault();const btn=$('#saveNewEventBtn'),data={title:$('#newTitle').value.trim(),date:$('#newDate').value,venue:$('#newVenue').value.trim(),limit:Number($('#newLimit').value),acceptUploads:true,manualApproval:false,galleryLocked:false};if(!data.title)return;setBtnWorking(btn,true,'Mencipta majlis...');try{const ev=await service.createEvent(data);$('#createEventModal').classList.add('hidden');$('#createEventForm').reset();selectedId=null;const old=eventsOff;old?.();eventsOff=null; // force selecting newly created event in listener
 const url=new URL(location.href);url.searchParams.set('event',ev.id);history.replaceState({},'',url);toast('Majlis baru berjaya dicipta!');panel('qr');loadEvents();}
 catch(err){toast('Gagal cipta: '+friendlyError(err),true)}finally{setBtnWorking(btn,false)}});
 function renderAdminPhotos(){const box=$('#adminPhotos');if(!box||!selectedId)return;const filter=$('#photoStatusFilter').value,show=photos.filter(p=>filter==='all'||p.status===filter);
 box.innerHTML=show.length?show.map(p=>`<article class="admin-photo"><img src="${esc(displayPhoto(p))}" alt="Gambar ${esc(p.guestName)}" loading="lazy"><div class="admin-photo-detail"><strong>${esc(p.guestName||'Tetamu')}</strong><small>${esc(formatTime(p))}</small><span class="status-pill ${p.status==='pending'?'pending':p.status==='hidden'?'hidden-status':''}">${p.status==='approved'?'Dipaparkan':p.status==='pending'?'Menunggu':'Disembunyikan'}</span><div class="photo-actions">${p.status!=='approved'?`<button data-act="approve" data-id="${esc(p.id)}">${svgIcon('check')} Lulus</button>`:''}${p.status!=='hidden'?`<button data-act="hide" data-id="${esc(p.id)}">Sembunyi</button>`:''}<button data-act="save" data-id="${esc(p.id)}">${svgIcon('arrow-down')} Simpan</button><button class="danger" data-act="delete" data-id="${esc(p.id)}">Padam</button></div></div></article>`).join(''):'<div class="empty-state">Tiada gambar dalam kategori ini.</div>';
 }
 $('#photoStatusFilter').addEventListener('change',renderAdminPhotos);
 $('#adminPhotos').addEventListener('click',async e=>{const b=e.target.closest('[data-act]');if(!b)return;const p=photos.find(p=>p.id===b.dataset.id);if(!p)return;const act=b.dataset.act;if(act==='delete'&&!confirm('Padam gambar ini secara kekal?'))return;b.disabled=true;
 try{if(act==='approve')await service.setPhotoStatus(selectedId,p.id,'approved');if(act==='hide')await service.setPhotoStatus(selectedId,p.id,'hidden');if(act==='delete')await service.deletePhoto(selectedId,p.id);if(act==='save')downloadBlob(await service.getPhotoBlob(p),`sekeping-${p.id}.jpg`);toast(act==='save'?'Muat turun gambar bermula.':'Gambar berjaya dikemas kini.')}
 catch(err){toast('Tindakan gagal: '+friendlyError(err),true)}finally{b.disabled=false}});
 function renderAdminWishes(){$('#adminWishes').innerHTML=wishes.length?wishes.map(w=>`<div class="admin-wish"><p>“${esc(w.text)}”</p><div class="admin-wish-footer"><span>${svgIcon('sparkles')} ${esc(w.guestName)} · ${esc(formatTime(w))}</span><button type="button" data-wish-del="${esc(w.id)}">Padam</button></div></div>`).join(''):'<div class="empty-state">Ucapan tetamu akan muncul di sini secara langsung.</div>'}
 $('#adminWishes').addEventListener('click',async e=>{const btn=e.target.closest('[data-wish-del]');if(!btn)return;if(!confirm('Padam ucapan ini?'))return;try{await service.deleteWish(selectedId,btn.dataset.wishDel);toast('Ucapan telah dipadam.')}catch(err){toast(friendlyError(err),true)}});
 function drawQR(){if(!event||!selectedId)return;$('#qrEventTitle').textContent=event.title;const url=eventLink(selectedId);$('#shareUrl').value=url;try{buildQR(url,$('#qrCanvas'))}catch(err){toast('Kod QR gagal dijana: '+friendlyError(err),true)}}
 $('#copyQrLink').addEventListener('click',()=>{if(selectedId)copy(eventLink(selectedId))});
 $('#saveQrBtn').addEventListener('click',()=>{if(!selectedId)return;const canvas=document.createElement('canvas');buildQR(eventLink(selectedId),canvas,1200);canvas.toBlob(blob=>{if(blob)downloadBlob(blob,'Sekeping-QR-'+selectedId.slice(0,8)+'.png')},'image/png')});
 $('#printQrBtn').addEventListener('click',()=>{if(!selectedId)return;panel('qr');setTimeout(()=>window.print(),100)});
 function csvVal(x){return '"'+String(x??'').replaceAll('"','""')+'"'}
 function wishCSV(){return '\ufeffNama,Tarikh,Ucapan\r\n'+wishes.map(w=>[w.guestName,new Date(w.createdAt).toISOString(),w.text].map(csvVal).join(',')).join('\r\n')}
 $('#exportWishesBtn').addEventListener('click',()=>{if(!event)return;downloadBlob(new Blob([wishCSV()],{type:'text/csv;charset=utf-8'}),'Sekeping-Ucapan.csv');toast('Buku ucapan telah dieksport.')});
 $('#exportZipBtn').addEventListener('click',async()=>{if(!selectedId||!photos.length){toast('Belum ada gambar untuk dimuat turun.');return}if(!window.JSZip){toast('Pustaka ZIP tidak dijumpai.',true);return}const btn=$('#exportZipBtn');setBtnWorking(btn,true,'Menyiapkan ZIP...');const zip=new JSZip(),folder=zip.folder('Gambar Majlis');let ok=0,failed=0;for(let i=0;i<photos.length;i++){const p=photos[i];btn.textContent=`Memuat gambar ${i+1}/${photos.length}`;try{const blob=await service.getPhotoBlob(p);folder.file(`${String(i+1).padStart(3,'0')}-${p.id}.jpg`,blob);ok++}catch(err){failed++;console.warn('Export image failed',p.id,err)}}zip.file('Buku-Ucapan.csv',wishCSV());zip.file('MAKLUMAT.txt',`Sekeping - ${event.title}\nTarikh: ${fmtDate(event.date)}\nJumlah gambar dieksport: ${ok}\nGambar gagal: ${failed}\n`);
 try{if(!ok){toast('Gagal membaca imej untuk ZIP. Semak CORS Storage dan izin fail.',true);return}const blob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:4}});downloadBlob(blob,'Sekeping-'+event.title.replace(/[^\w\- ]/g,'').replace(/\s+/g,'-').slice(0,50)+'.zip');toast(`ZIP siap: ${ok} gambar${failed?`, ${failed} gagal (semak CORS)`:''}.`)}catch(err){toast(friendlyError(err),true)}finally{setBtnWorking(btn,false)}});
}
if(document.body.dataset.page==='guest')guestApp();else if(document.body.dataset.page==='admin')adminApp();
