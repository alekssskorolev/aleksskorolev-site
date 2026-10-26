(function(){
 'use strict';
 var id=113810500,key='ak_analytics_consent_v1',lifetime=180*24*60*60*1000;
 var ownScript=document.currentScript,track=ownScript&&ownScript.getAttribute('data-track')==='true';
 var base=new URL('../',ownScript.src),policyURL=new URL('policy/',base).href,consentURL=new URL('analytics-consent/',base).href;
 var consent=null,started=false,banner,status;
 function read(){try{var x=JSON.parse(localStorage.getItem(key));if(x&&x.version===1&&['granted','denied'].indexOf(x.choice)!==-1&&Date.now()-x.at<lifetime&&x.at<=Date.now())return x.choice;}catch(e){}return null;}
 function save(choice){try{localStorage.setItem(key,JSON.stringify({version:1,choice:choice,at:Date.now()}));}catch(e){}consent=choice;}
 function cleanURL(value){try{var u=new URL(value,location.href);u.hash='';['email','phone','name','token','order_id','telegram_id'].forEach(function(k){u.searchParams.delete(k)});return u.href}catch(e){return ''}}
 function start(){
  if(!track||started||consent!=='granted')return;started=true;
  window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments)};window.ym.l=Date.now();
  var s=document.createElement('script');s.async=true;s.src='https://mc.yandex.ru/metrika/tag.js?id='+id;s.id='ak-metrika-tag';document.head.appendChild(s);
  window.ym(id,'init',{webvisor:false,clickmap:true,accurateTrackBounce:true,trackLinks:true,referrer:document.referrer?cleanURL(document.referrer):'',url:cleanURL(location.href)});
 }
 function update(){
  if(banner)banner.hidden=consent!==null;
  if(status)status.textContent=consent==='granted'?'Аналитика разрешена.':consent==='denied'?'Аналитика отключена.':'';
 }
 function deleteAnalyticsCookies(){
  document.cookie.split(';').forEach(function(c){var name=c.split('=')[0].trim();if(!/^_ym/.test(name))return;
   var domains=['',location.hostname,'.'+location.hostname];var labels=location.hostname.split('.');if(labels.length>2)domains.push('.'+labels.slice(-2).join('.'));
   domains.forEach(function(d){document.cookie=name+'=; Max-Age=0; Path=/'+(d?'; Domain='+d:'')+'; SameSite=Lax';});
  });
  try{Object.keys(localStorage).forEach(function(k){if(/^_ym/.test(k))localStorage.removeItem(k)})}catch(e){}
 }
 function choose(choice){
  var wasStarted=started;save(choice);update();
  if(choice==='granted'){start();return;}
  if(wasStarted&&typeof window.ym==='function'){try{window.ym(id,'destruct')}catch(e){}}
  deleteAnalyticsCookies();
  if(wasStarted)location.reload();
 }
 function initUI(){
  consent=read();
  banner=document.createElement('section');banner.className='ak-consent';banner.setAttribute('aria-label','Согласие на аналитику');banner.hidden=consent!==null||!track;
  var inner=document.createElement('div');inner.className='ak-consent__inner';
  var p=document.createElement('p');p.append('Разрешить Яндекс.Метрике собирать статистику посещений и переходов с помощью cookies? До согласия счётчик отключён. ');
  var a=document.createElement('a');a.href=consentURL;a.textContent='Текст согласия';p.append(a);p.append('. ');
  var policy=document.createElement('a');policy.href=policyURL;policy.textContent='Политика';p.append(policy);inner.append(p);
  var actions=document.createElement('div');actions.className='ak-consent__actions';
  var accept=document.createElement('button');accept.type='button';accept.textContent='Разрешить аналитику';accept.setAttribute('data-ak-accept','');accept.addEventListener('click',function(){choose('granted')});
  var reject=document.createElement('button');reject.type='button';reject.textContent='Без аналитики';reject.setAttribute('data-ak-reject','');reject.addEventListener('click',function(){choose('denied')});actions.append(accept,reject);inner.append(actions);banner.append(inner);document.body.prepend(banner);
  var footer=document.createElement('aside');footer.className='ak-privacy';footer.setAttribute('aria-label','Настройки аналитики');
  var settings=document.createElement('button');settings.type='button';settings.textContent='Настройки аналитики';settings.setAttribute('data-ak-settings','');settings.addEventListener('click',function(){banner.hidden=false;banner.scrollIntoView({block:'start',behavior:'auto'});accept.focus({preventScroll:true})});
  status=document.createElement('p');status.setAttribute('aria-live','polite');footer.append(settings,status);document.body.append(footer);update();
  // Non-tracked legal pages expose the controls, but never start the counter.
  if(!track)banner.hidden=true;
  start();
 }
 document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[data-ak-goal]');
  if(!a||consent!=='granted'||!started||typeof window.ym!=='function')return;
  var goal=a.getAttribute('data-ak-goal'),placement=a.getAttribute('data-ak-placement')||'link';
  // Preserve modified clicks and links that already open in a new tab.
  if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||a.target==='_blank'){
   window.ym(id,'reachGoal',goal,{placement:placement});return;
  }
  e.preventDefault();var done=false;function go(){if(done)return;done=true;location.href=a.href}
  setTimeout(go,450);
  try{window.ym(id,'reachGoal',goal,{placement:placement},go)}catch(err){go()}
 });
 window.addEventListener('storage',function(e){if(e.key!==key)return;var next=read();if(started&&next!=='granted'){location.reload();return;}consent=next;update();start()});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initUI);else initUI();
})();
