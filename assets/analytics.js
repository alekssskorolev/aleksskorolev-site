(function(){
 'use strict';
 var id=113810500,prefKey='ak_analytics_preferences_v2',noticeKey='ak_cookie_notice_v2',oldKey='ak_analytics_consent_v1';
 var ownScript=document.currentScript,track=ownScript&&ownScript.getAttribute('data-track')==='true';
 var base=new URL('../',ownScript.src),policyURL=new URL('policy/',base).href,infoURL=new URL('analytics-consent/',base).href;
 var enabled=true,started=false,banner,status,panel,toggle;
 function get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}
 function put(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
 function readEnabled(){
  var p=get(prefKey);if(p&&typeof p.enabled==='boolean')return p.enabled;
  var old=get(oldKey);if(old&&old.choice==='denied')return false;
  return true;
 }
 function noticeSeen(){var x=get(noticeKey);return !!(x&&x.version===2&&Date.now()-x.at<180*86400000&&x.at<=Date.now())}
 function cleanURL(value){try{var u=new URL(value,location.href);u.hash='';['email','phone','name','token','order_id','telegram_id'].forEach(function(k){u.searchParams.delete(k)});return u.href}catch(e){return ''}}
 function start(){
  if(!track||started||!enabled)return;started=true;
  window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=Date.now();
  var s=document.createElement('script');s.async=true;s.src='https://mc.yandex.ru/metrika/tag.js?id='+id;s.id='ak-metrika-tag';document.head.appendChild(s);
  window.ym(id,'init',{webvisor:false,clickmap:true,accurateTrackBounce:true,trackLinks:true,referrer:document.referrer?cleanURL(document.referrer):'',url:cleanURL(location.href)});
 }
 function updateSpace(){var h=banner&&!banner.hidden?Math.ceil(banner.getBoundingClientRect().height)+32:0;document.documentElement.style.setProperty('--ak-notice-space',h+'px')}
 function update(){
  if(status)status.textContent=enabled?'Аналитика включена.':'Аналитика отключена.';
  if(toggle)toggle.textContent=enabled?'Отключить аналитику':'Включить аналитику';
  if(banner)banner.hidden=!track||noticeSeen()||!enabled;
  updateSpace();
 }
 function dismiss(){put(noticeKey,{version:2,at:Date.now()});banner.hidden=true;updateSpace()}
 function deleteAnalyticsCookies(){
  document.cookie.split(';').forEach(function(c){var name=c.split('=')[0].trim();if(!/^_ym/.test(name))return;
   var domains=['',location.hostname,'.'+location.hostname],labels=location.hostname.split('.');if(labels.length>2)domains.push('.'+labels.slice(-2).join('.'));
   domains.forEach(function(d){document.cookie=name+'=; Max-Age=0; Path=/'+(d?'; Domain='+d:'')+'; SameSite=Lax'})
  });
  try{Object.keys(localStorage).forEach(function(k){if(/^_ym/.test(k))localStorage.removeItem(k)})}catch(e){}
 }
 function setEnabled(next){
  var wasStarted=started;enabled=next;put(prefKey,{version:2,enabled:next,at:Date.now()});update();
  if(next){start();return;}
  if(wasStarted&&typeof window.ym==='function'){try{window.ym(id,'destruct')}catch(e){}}
  deleteAnalyticsCookies();if(wasStarted)location.reload();
 }
 function initUI(){
  enabled=readEnabled();
  banner=document.createElement('section');banner.className='ak-consent';banner.setAttribute('aria-label','Использование cookies');
  var inner=document.createElement('div');inner.className='ak-consent__inner';
  var p=document.createElement('p');p.append('Сайт использует cookies и Яндекс.Метрику для статистики посещений и переходов. ');
  var a=document.createElement('a');a.href=infoURL;a.textContent='Подробнее';p.append(a);p.append(' · ');
  var policy=document.createElement('a');policy.href=policyURL;policy.textContent='Политика конфиденциальности';p.append(policy);inner.append(p);
  var actions=document.createElement('div');actions.className='ak-consent__actions';
  var accept=document.createElement('button');accept.type='button';accept.textContent='Подтвердить';accept.setAttribute('data-ak-confirm','');accept.addEventListener('click',dismiss);actions.append(accept);inner.append(actions);
  var close=document.createElement('button');close.type='button';close.className='ak-consent__close';close.textContent='×';close.setAttribute('aria-label','Закрыть уведомление');close.setAttribute('data-ak-close','');close.addEventListener('click',dismiss);inner.append(close);banner.append(inner);document.body.append(banner);
  var footer=document.createElement('aside');footer.className='ak-privacy';footer.setAttribute('aria-label','Настройки аналитики');
  var settings=document.createElement('button');settings.type='button';settings.textContent='Настройки аналитики';settings.setAttribute('data-ak-settings','');settings.setAttribute('aria-expanded','false');settings.setAttribute('aria-controls','ak-analytics-settings');
  panel=document.createElement('div');panel.id='ak-analytics-settings';panel.className='ak-privacy__panel';panel.hidden=true;
  status=document.createElement('p');status.setAttribute('aria-live','polite');
  var explanation=document.createElement('p');explanation.textContent='Яндекс.Метрика запускается автоматически. Здесь можно отключить сбор статистики для этого браузера. Закрытие уведомления не меняет эту настройку.';
  toggle=document.createElement('button');toggle.type='button';toggle.setAttribute('data-ak-toggle','');toggle.addEventListener('click',function(){setEnabled(!enabled)});
  settings.addEventListener('click',function(){panel.hidden=!panel.hidden;settings.setAttribute('aria-expanded',String(!panel.hidden));if(!panel.hidden)panel.scrollIntoView({block:'nearest',behavior:'auto'})});
  panel.append(status,explanation,toggle);footer.append(settings,panel);document.body.append(footer);update();start();
  if(window.ResizeObserver)new ResizeObserver(updateSpace).observe(banner);window.addEventListener('resize',updateSpace);
 }
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[data-ak-goal]');if(!a||!enabled||!started||typeof window.ym!=='function')return;
  var goal=a.getAttribute('data-ak-goal'),placement=a.getAttribute('data-ak-placement')||'link';
  if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.target==='_blank'){window.ym(id,'reachGoal',goal,{placement:placement});return;}
  e.preventDefault();var done=false;function go(){if(done)return;done=true;location.href=a.href}setTimeout(go,450);try{window.ym(id,'reachGoal',goal,{placement:placement},go)}catch(err){go()}
 });
 window.addEventListener('storage',function(e){if(e.key===noticeKey){update();return;}if(e.key!==prefKey&&e.key!==oldKey)return;var next=readEnabled();if(started&&!next){location.reload();return;}enabled=next;update();start()});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initUI);else initUI();
})();
