/* Sekeping.my · Voice Deck 01 — retro UI enhancement for V10–V12.
   No edits to app.js or Firebase. The existing recorder remains authoritative. */
(()=>{
 'use strict';
 const app=document.getElementById('app');if(!app)return;
 const clock=n=>{n=Math.max(0,Math.floor(Number(n)||0));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`};
 let stream=null,meterContext=null,analyser=null,meterFrame=0,meterStrength=[0,0],lastMeterTime=0;
 let upgrading=false;
 const originalMedia=navigator.mediaDevices?.getUserMedia;
 if(originalMedia){try{
  navigator.mediaDevices.getUserMedia=async function(constraints){
   const result=await originalMedia.call(this,constraints);
   if(constraints?.audio&&!constraints?.video){stream=result;setTimeout(startMeter,70)}
   return result;
  };
 }catch(err){console.warn('Microphone visualization not available; using visual animation.',err)}}
 const meter=()=>app.querySelector('[data-retro-recorder]');
 function closeMeter(){if(meterFrame)cancelAnimationFrame(meterFrame);meterFrame=0;analyser=null;meterStrength=[0,0];if(meterContext){const c=meterContext;meterContext=null;c.close().catch(()=>{})}meter()?.classList.remove('meter-live')}
 async function startMeter(){
  const deck=meter();if(!deck?.classList.contains('is-recording')||!stream||meterContext)return;
  const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
  try{
   meterContext=new AudioCtx({latencyHint:'interactive'});
   analyser=meterContext.createAnalyser();analyser.fftSize=512;analyser.smoothingTimeConstant=.65;
   meterContext.createMediaStreamSource(stream).connect(analyser);
   await meterContext.resume();
   if(!deck.isConnected||!deck.classList.contains('is-recording')){closeMeter();return}
   deck.classList.add('meter-live');
   const data=new Uint8Array(analyser.fftSize);
   const needles=Array.from(deck.querySelectorAll('.retro-vu-needle'));
   const tick=now=>{
    if(!deck.isConnected||!deck.classList.contains('is-recording')||stream?.getAudioTracks().every(t=>t.readyState==='ended')){closeMeter();return}
    if(now-lastMeterTime>40){
     lastMeterTime=now;analyser.getByteTimeDomainData(data);let sum=0;
     for(const raw of data){const n=(raw-128)/128;sum+=n*n}
     const level=Math.min(1,Math.sqrt(sum/data.length)*6);
     meterStrength[0]=meterStrength[0]*.72+level*.28;
     meterStrength[1]=meterStrength[1]*.74+Math.max(0,Math.min(1,level*.92+Math.sin(now/310)*.016))*.26;
     needles.forEach((el,i)=>{el.style.transform=`translateX(-50%) rotate(${(-46+meterStrength[i]*87).toFixed(1)}deg)`});
    }
    meterFrame=requestAnimationFrame(tick);
   };
   meterFrame=requestAnimationFrame(tick);
  }catch(err){console.warn('VU audio meter unavailable; retaining CSS animation.',err);closeMeter()}
 }
 function getMode(card){
  if(card.querySelector('[data-action="stop-record"]'))return 'recording';
  if(card.querySelector('[data-action="save-voice"]')||card.querySelector('[data-voice-player="preview"]'))return 'ready';
  return 'idle';
 }
 function getLimit(card){
  const text=card.textContent||'';
  const explicit=text.match(/Maksimum\s*(\d{1,3})\s*saat/i)||text.match(/Had\s*(\d{1,2}):(\d{2})/i);
  if(explicit)return Math.min(90,Math.max(5,explicit[2]?Number(explicit[1])*60+Number(explicit[2]):Number(explicit[1])));
  const remain=card.querySelector('#voiceRemaining')?.textContent||'';
  const m=remain.match(/(\d{1,2}):(\d{2})/);
  if(m)return Math.min(90,Math.max(5,Number(m[1])*60+Number(m[2])));
  return 45;
 }
 function upgrade(){
  if(upgrading)return;
  const panel=app.querySelector('.voice-panel');if(!panel||panel.classList.contains('retro-upgraded'))return;
  const card=panel.querySelector('.voice-studio, .card');if(!card||!card.querySelector('#voiceClock'))return;
  upgrading=true;
  try{
   const mode=getMode(card),max=getLimit(card);
   const currentClock=card.querySelector('#voiceClock').textContent?.trim()||'00:00';
   const guestName=card.querySelector('#guestNameVoice')?.value||'';
   const preview=card.querySelector('[data-voice-player="preview"]');
   const deck=document.createElement('div');deck.className='retro-voice-top';
   const recording=mode==='recording',ready=mode==='ready';
   const meters=[0,1].map(i=>`<div class="retro-meter" aria-hidden="true"><div class="retro-meter-title">${i?'R':'L'} · VU</div><div class="retro-meter-face"><div class="retro-vu-scale"><span>−20</span><span>−10</span><span>0</span><span>+3</span></div><span class="retro-vu-base"></span><span class="retro-vu-needle"></span></div></div>`).join('');
   deck.innerHTML=`
    <div class="retro-intro"><label for="guestNameVoice">NAMA ANDA</label><input class="input" id="guestNameVoice" type="text" maxlength="55" autocomplete="name" placeholder="Nama anda" ${recording?'readonly':''}></div>
    <section class="retro-recorder ${recording?'is-recording':ready?'is-ready':'is-idle'}" data-retro-recorder data-retro-limit="${max}" aria-label="Perakam suara gaya kaset klasik">
      <div class="retro-woodside left" aria-hidden="true"></div><div class="retro-woodside right" aria-hidden="true"></div>
      <div class="retro-face"><div class="retro-topline"><span>SEKEPING <b>STUDIO</b></span><span class="retro-edition">ANALOG MEMORIES · 01</span></div>
        <div class="retro-hardware"><div class="retro-cassette-bay"><div class="retro-bay-label">VOICE MEMORY <span>TYPE I</span></div><div class="retro-cassette" aria-hidden="true"><div class="retro-cassette-window"><div class="retro-reel left"><span></span></div><div class="retro-tape-line"></div><div class="retro-reel right"><span></span></div></div><div class="retro-tape-label"><b>S.</b><span>SEKEPING · ${max}S</span></div></div></div>
          <div class="retro-monitor"><div class="retro-meters">${meters}</div><div class="retro-digital"><span class="retro-digital-label">COUNTER</span><strong id="voiceClock" role="timer" aria-label="Masa rakaman">${currentClock}</strong><span class="retro-led"><i></i><span data-retro-status aria-live="polite">${recording?'SEDANG MERAKAM':ready?'RAKAMAN SIAP':'SEDIA MERAKAM'}</span></span></div></div></div>
        <div class="retro-bottomline"><span>STEREO VOICE DECK</span><span><i class="retro-power-led"></i> POWER</span></div>
        <div class="retro-controls" aria-label="Kawalan rakaman">
          <button type="button" class="retro-key retro-rec" data-action="start-record" ${recording||ready?'disabled':''} aria-label="Mula merakam"><span class="retro-key-symbol">●</span><span>REC</span></button>
          <button type="button" class="retro-key" data-retro-stop ${!recording&&!ready?'disabled':''} aria-label="Hentikan rakaman atau main balik"><span class="retro-key-symbol">■</span><span>STOP</span></button>
          <button type="button" class="retro-key" data-retro-play ${!ready?'disabled':''} aria-label="Main atau jeda rakaman"><span class="retro-key-symbol">▶</span><span>PLAY</span></button>
          <button type="button" class="retro-key retro-rewind" data-action="discard-voice" ${!ready?'disabled':''} aria-label="Buang rakaman dan rakam semula"><span class="retro-key-symbol">↶</span><span>ULANG</span></button>
        </div><div class="retro-lower-status"><span>CASSETTE RECORDING SYSTEM</span><span data-retro-remaining>${recording?`${clock(max)} berbaki`:`Had ${clock(max)}`}</span></div><div class="retro-progress"><div data-retro-progress></div></div>
      </div>
    </section><div class="retro-instructions">${recording?'Meter VU bergerak ketika mikrofon merakam suara.':ready?'Tekan PLAY untuk mendengar, atau hantar rakaman.':'Isi nama dan tekan REC. Hentikan rakaman dengan STOP.'}</div>
    <div class="retro-preview" data-retro-preview ${!preview?'hidden':''}><span class="retro-preview-label">PRATONTON AUDIO</span></div>
    <div class="retro-send-row" ${!ready?'hidden':''}><button class="btn retro-send" data-action="save-voice">Hantar rakaman suara</button></div>`;
   deck.querySelector('#guestNameVoice').value=guestName;
   if(preview)deck.querySelector('[data-retro-preview]').append(preview);
   card.replaceWith(deck);
   panel.classList.add('retro-upgraded','retro-voice-layout');
   sync();if(recording)startMeter();else closeMeter();
  }catch(err){console.error('Retro recorder UI update failed:',err)}finally{upgrading=false}
 }
 function sync(){
  const deck=meter();if(!deck)return;
  const s=deck.querySelector('#voiceClock')?.textContent||'00:00';const parts=s.match(/(\d+):(\d\d)/);
  const elapsed=parts?Number(parts[1])*60+Number(parts[2]):0;
  const max=Number(deck.dataset.retroLimit)||45;
  if(deck.classList.contains('is-recording')){
   const remaining=deck.querySelector('[data-retro-remaining]');if(remaining)remaining.textContent=`${clock(max-elapsed)} berbaki`;
   const bar=deck.querySelector('[data-retro-progress]');if(bar)bar.style.width=`${Math.min(100,elapsed/max*100)}%`;
  }
 }
 function previewAudio(){return app.querySelector('[data-voice-player="preview"] audio')}
 function updatePlayback(audio){
  const deck=meter();if(!deck||deck.classList.contains('is-recording'))return;
  const t=deck.querySelector('#voiceClock');if(t)t.textContent=clock(audio.currentTime||0);
  const max=Number.isFinite(audio.duration)&&audio.duration>0?audio.duration:Number(deck.dataset.retroLimit)||45;
  const bar=deck.querySelector('[data-retro-progress]');if(bar)bar.style.width=`${Math.min(100,(audio.currentTime||0)/max*100)}%`;
 }
 app.addEventListener('click',ev=>{
  const play=ev.target.closest('[data-retro-play]'),stop=ev.target.closest('[data-retro-stop]');
  if(!play&&!stop)return;
  ev.preventDefault();ev.stopPropagation();
  if(play){app.querySelector('[data-voice-player="preview"] [data-voice-play]')?.click();return}
  const deck=meter();
  if(deck?.classList.contains('is-recording')){
   /* Use the original handler: the original recorder determines min duration and formats. */
   const native=document.createElement('button');native.dataset.action='stop-record';native.style.display='none';app.append(native);native.click();native.remove();
   return;
  }
  const audio=previewAudio();if(audio){audio.pause();audio.currentTime=0;updatePlayback(audio)}
 },true);
 app.addEventListener('play',ev=>{if(ev.target.matches?.('[data-voice-player="preview"] audio'))meter()?.classList.add('is-playing')},true);
 app.addEventListener('pause',ev=>{if(ev.target.matches?.('[data-voice-player="preview"] audio'))meter()?.classList.remove('is-playing')},true);
 app.addEventListener('ended',ev=>{if(ev.target.matches?.('[data-voice-player="preview"] audio'))meter()?.classList.remove('is-playing')},true);
 app.addEventListener('timeupdate',ev=>{if(ev.target.matches?.('[data-voice-player="preview"] audio'))updatePlayback(ev.target)},true);
 let scheduled=false;
 new MutationObserver(()=>{
  if(scheduled)return;
  if(!app.querySelector('.voice-panel:not(.retro-upgraded)'))return;
  scheduled=true;queueMicrotask(()=>{scheduled=false;upgrade()});
 }).observe(app,{subtree:true,childList:true});
 upgrade();
 setInterval(()=>{if(meter())sync();else if(meterContext)closeMeter()},250);
 window.addEventListener('pagehide',closeMeter);
})();
