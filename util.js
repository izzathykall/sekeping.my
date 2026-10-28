export const $=(selector,root=document)=>root.querySelector(selector);
export const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
export const esc=(s='')=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmtDate=(s)=>{if(!s)return 'Tarikh akan diumumkan';let date=new Date(`${s}T12:00:00`);return Number.isNaN(+date)?s:new Intl.DateTimeFormat('ms-MY',{day:'numeric',month:'long',year:'numeric'}).format(date);};
export const fmtClock=(s)=>new Date(s?.toDate?.()??s??Date.now()).toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit'});
export const dateIso=()=>new Date().toLocaleDateString('en-CA');
export const newId=()=>crypto.randomUUID();
export const getGuestName=(id)=>{try{return localStorage.getItem('sekeping-name-'+id)||''}catch{return ''}};
export const setGuestName=(id,name)=>{try{localStorage.setItem('sekeping-name-'+id,name)}catch{}};
export const eventLink=(id)=>{const url=new URL('./index.html',location.href);url.searchParams.set('event',id);url.hash='';return url.href;};
export const toast=(msg,error=false)=>{let e=$('#toast');if(!e)return; e.textContent=msg;e.classList.toggle('error',error);e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),4300);};
export const copy=async(text)=>{try{await navigator.clipboard.writeText(text);toast('Pautan telah disalin.');}catch{const t=document.createElement('textarea');t.value=text;document.body.append(t);t.select();document.execCommand('copy');t.remove();toast('Pautan telah disalin.')}};
export const friendlyError=(err)=>{const msg=String(err?.message||err||'Ralat tidak diketahui');if(/permission-denied|storage\/unauthorized/i.test(msg))return 'Akses ditolak. Semak Firebase Rules, tetapan majlis dan akaun.';if(/auth\/invalid-credential|auth\/wrong-password|auth\/user-not-found/i.test(msg))return 'E-mel atau kata laluan tidak tepat.';if(/storage\/quota-exceeded|storage\/unknown/i.test(msg))return 'Storan tidak tersedia. Semak Blaze billing, bucket dan sambungan.';if(/auth\/operation-not-allowed/i.test(msg))return 'Aktifkan kaedah log masuk dalam Firebase Authentication.';return msg;};
export const downloadBlob=(blob,name)=>{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),45000);};
export const handleSubscriptions=()=>{let unsub=[];return{add(f){if(typeof f==='function')unsub.push(f)},clear(){for(const f of unsub)try{f()}catch{}unsub=[]}}};
export const safeImage=(url)=>url?.startsWith('blob:')||url?.startsWith('data:image/')||url?.startsWith('https://')?url:'';
export function buildQR(text,canvas,size=390){if(!window.MemQR)throw Error('Enjin QR tidak dijumpai.');const qr=new window.MemQR(0,0);qr.addData(text);qr.make();const n=qr.getModuleCount(),pad=4,total=n+pad*2;canvas.width=size;canvas.height=size;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,size,size);ctx.fillStyle='#172922';for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr.isDark(y,x)){const x1=Math.round((x+pad)*size/total),x2=Math.round((x+pad+1)*size/total),y1=Math.round((y+pad)*size/total),y2=Math.round((y+pad+1)*size/total);ctx.fillRect(x1,y1,x2-x1,y2-y1);}return canvas;}
export const option=(str)=>esc(str);
