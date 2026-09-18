self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// The former Railway root worker must never focus the production app.
const demoScope=new URL(self.registration.scope).pathname==='/'?new URL('/demo/',self.registration.scope).href:self.registration.scope;
self.addEventListener('push',event=>{
  let data={};try{data=event.data?.json()||{};}catch{}
  event.waitUntil((async()=>{
    await self.registration.showNotification(data.title||'診間支援通知',{body:data.body||'請開啟查看',tag:data.tag||'clinic-test',icon:new URL('icon-192.png',demoScope).href,data:{url:new URL('./?experience=1',demoScope).href}});
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    windows.filter(client=>client.url.startsWith(demoScope)).forEach(client=>client.postMessage({type:'push-received',id:data.tag}));
  })());
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const client=windows.find(c=>c.url.startsWith(demoScope));
    if(client){await client.focus();client.postMessage({type:'push-open'});}
    else await self.clients.openWindow(new URL('./?experience=1',demoScope).href);
  })());
});
