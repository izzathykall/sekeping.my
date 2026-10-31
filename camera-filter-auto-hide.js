/* V25: automatically dismiss filter popup shortly after a filter selection. */
(()=>{'use strict';const app=document.getElementById('app');if(!app)return;let timer=null;
function close(){timer=null;const panel=app.querySelector('#filterStudio:not([hidden])');if(!panel)return;const button=panel.querySelector('[data-action="close-filters"]');if(button)button.click()}
app.addEventListener('click',e=>{const selected=e.target.closest('#filterStudio [data-filter]');if(selected){clearTimeout(timer);timer=setTimeout(close,1100)}else if(e.target.closest('[data-action="toggle-filters"],[data-action="close-filters"]')){clearTimeout(timer);timer=null}});
})();
