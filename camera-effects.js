/* Sekeping Camera Studio — live CSS looks and equivalent saved JPEG effects.
   Local-only effects, no external API or image uploads. */
(function(){
'use strict';
const GROUPS=[
 {id:'semua',name:'Semua'}, {id:'asas',name:'Asas'}, {id:'filem',name:'Filem'},
 {id:'sinematik',name:'Sinematik'}, {id:'warna',name:'Warna'}, {id:'mono',name:'Monokrom'}
];
const FILTERS={
 natural:{label:'Asli',group:'asas',style:'none'},
 lembut:{label:'Lembut',group:'asas',style:'brightness(1.06) contrast(.91) saturate(.88)'},
 terang:{label:'Cerah',group:'asas',style:'brightness(1.14) contrast(1.04) saturate(1.06)'},
 bersih:{label:'Bersih',group:'asas',style:'contrast(1.07) saturate(1.07)'},
 dreamy:{label:'Dreamy',group:'asas',style:'brightness(1.11) saturate(.82) contrast(.88)'},
 klasik94:{label:'Klasik 94',group:'filem',style:'sepia(.24) saturate(.84) contrast(1.13) brightness(.97)'},
 kodak:{label:'Kodak Gold',group:'filem',style:'sepia(.21) saturate(1.3) contrast(1.13) brightness(1.03)'},
 fuji:{label:'Fuji 400',group:'filem',style:'hue-rotate(-9deg) saturate(.83) contrast(1.12) brightness(1.04)'},
 polaroid:{label:'Polaroid',group:'filem',style:'sepia(.18) saturate(.78) brightness(1.11) contrast(.88)'},
 faded:{label:'Pudar 70s',group:'filem',style:'sepia(.29) contrast(.79) saturate(.67) brightness(1.1)'},
 disposable:{label:'Disposable',group:'filem',style:'sepia(.16) saturate(1.46) contrast(1.21) brightness(.96)'},
 cinema:{label:'Cinema',group:'sinematik',style:'contrast(1.23) saturate(.81) brightness(.92)'},
 teal:{label:'Teal & Orange',group:'sinematik',style:'hue-rotate(164deg) saturate(.95) contrast(1.19)'},
 moody:{label:'Moody',group:'sinematik',style:'brightness(.79) contrast(1.34) saturate(.72)'},
 matte:{label:'Matte Film',group:'sinematik',style:'contrast(.83) saturate(.84) brightness(1.03)'},
 midnight:{label:'Midnight',group:'sinematik',style:'brightness(.75) hue-rotate(20deg) saturate(.81) contrast(1.18)'},
 sunset:{label:'Sunset',group:'warna',style:'sepia(.32) hue-rotate(-9deg) saturate(1.5) brightness(1.06)'},
 golden:{label:'Golden Hour',group:'warna',style:'sepia(.27) saturate(1.28) brightness(1.13)'},
 blush:{label:'Rosy',group:'warna',style:'sepia(.13) hue-rotate(324deg) saturate(1.27) brightness(1.09)'},
 olive:{label:'Olive',group:'warna',style:'sepia(.16) hue-rotate(35deg) saturate(.8) contrast(1.12)'},
 sejuk:{label:'Biru Sejuk',group:'warna',style:'hue-rotate(17deg) saturate(.89) contrast(1.06)'},
 vivid:{label:'Pop Colour',group:'warna',style:'saturate(1.76) contrast(1.16)'},
 bw:{label:'B&W Klasik',group:'mono',style:'grayscale(1) contrast(1.13)'},
 silver:{label:'Silver',group:'mono',style:'grayscale(1) contrast(.94) brightness(1.11)'},
 noir:{label:'Noir',group:'mono',style:'grayscale(1) contrast(1.55) brightness(.87)'},
 sepia:{label:'Sepia',group:'mono',style:'sepia(.95) contrast(1.08)'},
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
function draw(source,options={}){
 const landscape=options.orientation==='landscape',wide=options.aspect==='wide';const w=landscape?(wide?1920:1600):(wide?1080:1200),h=landscape?(wide?1080:1200):(wide?1920:1600);
 const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:false});
 const swidth=source.videoWidth||source.naturalWidth||source.width;
 const sheight=source.videoHeight||source.naturalHeight||source.height;
 if(!swidth||!sheight)throw new Error('Imej kamera belum tersedia. Cuba sekali lagi.');
 const ratio=Math.max(w/swidth,h/sheight),cropW=w/ratio,cropH=h/ratio;
 ctx.filter=FILTERS[options.filter]?.style||'none';
 ctx.drawImage(source,(swidth-cropW)/2,(sheight-cropH)/2,cropW,cropH,0,0,w,h);
 ctx.filter='none';
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
