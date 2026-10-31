/* Sekeping Camera Studio — live CSS looks and equivalent saved JPEG effects.
   Local-only effects, no external API or image uploads. */
(function(){
'use strict';
const GROUPS=[
 {id:'semua',name:'Semua'}
];
const FILTERS={
 natural:{label:'Asli',group:'semua',style:'none'},
 klasik94:{label:'Klasik 94',group:'semua',style:'sepia(.24) saturate(.84) contrast(1.13) brightness(.97)'},
 kodak:{label:'Kodak Gold',group:'semua',style:'sepia(.21) saturate(1.3) contrast(1.13) brightness(1.03)'},
 fuji:{label:'Fuji 400',group:'semua',style:'hue-rotate(-9deg) saturate(.83) contrast(1.12) brightness(1.04)'},
 dreamy:{label:'Dreamy',group:'semua',style:'brightness(1.11) saturate(.82) contrast(.88)'},
 bw:{label:'B&W Klasik',group:'semua',style:'grayscale(1) contrast(1.13)'}
};
let noiseTile=null;
function getNoiseTile(){
 if(noiseTile)return noiseTile;
 const c=document.createElement('canvas');c.width=160;c.height=160;
 const cx=c.getContext('2d');const d=cx.createImageData(160,160);
 let seed=47921; // stable noise tile for consistent preview/export
 for(let i=0;i<d.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;const n=(seed>>>24);d.data[i]=n;d.data[i+1]=n;d.data[i+2]=n;d.data[i+3]=245}
 cx.putImageData(d,0,0);noiseTile=c;return c;
}
function grainURL(){return getNoiseTile().toDataURL('image/png')}
function vignetteCSS(strength){
 const alpha=Math.min(.9,Math.max(0,(Number(strength)||0)/100*.82));
 return `radial-gradient(ellipse at center, rgba(0,0,0,0) 18%, rgba(0,0,0,${(alpha*.13).toFixed(3)}) 47%, rgba(0,0,0,${alpha.toFixed(3)}) 100%)`;
}
function grainOpacity(strength){return Math.max(0,Math.min(.55,Number(strength)/100*.53))}
function applyManualBW(ctx,w,h){
 const img=ctx.getImageData(0,0,w,h),d=img.data,contrast=1.12,offset=128*(1-contrast);
 for(let i=0;i<d.length;i+=4){
  const g=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];
  const tone=Math.max(0,Math.min(255,g*contrast+offset));
  d[i]=tone;d[i+1]=tone;d[i+2]=tone;
 }
 ctx.putImageData(img,0,0);
}
function draw(source,options={}){
 const landscape=options.orientation==='landscape',wide=options.aspect==='wide';const w=landscape?(wide?1920:1600):(wide?1080:1200),h=landscape?(wide?1080:1200):(wide?1920:1600);
 const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:false});
 const swidth=source.videoWidth||source.naturalWidth||source.width;
 const sheight=source.videoHeight||source.naturalHeight||source.height;
 if(!swidth||!sheight)throw new Error('Imej kamera belum tersedia. Cuba sekali lagi.');
 const ratio=Math.max(w/swidth,h/sheight),cropW=w/ratio,cropH=h/ratio;
 const filterKey=options.filter;
 ctx.filter=filterKey==='bw'?'none':(FILTERS[filterKey]?.style||'none');
 ctx.drawImage(source,(swidth-cropW)/2,(sheight-cropH)/2,cropW,cropH,0,0,w,h);
 ctx.filter='none';
 if(filterKey==='bw')applyManualBW(ctx,w,h);
 if(options.grain){
  ctx.save();ctx.globalAlpha=grainOpacity(options.grainStrength??40);ctx.globalCompositeOperation='overlay';
  const pat=ctx.createPattern(getNoiseTile(),'repeat');ctx.fillStyle=pat;ctx.fillRect(0,0,w,h);ctx.restore();
 }
 if(options.vignette){
  const a=Math.min(.9,Math.max(0,Number(options.vignetteStrength??55)/100*.82));
  const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.15,w/2,h/2,Math.max(w,h)*.7);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.53,`rgba(0,0,0,${(a*.10).toFixed(3)})`);g.addColorStop(1,`rgba(0,0,0,${a.toFixed(3)})`);
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
 }
 return c;
}
window.SekepingCameraEffects={filters:FILTERS,groups:GROUPS,grainURL,vignetteCSS,grainOpacity,draw};
})();
