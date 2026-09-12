self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
  let data={};try{data=event.data?.json()||{};}catch{}
  event.waitUntil((async()=>{
    await self.registration.showNotification(data.title||'診間支援通知',{body:data.body||'請開啟查看',tag:data.tag||'clinic-test',icon:'./icon-192.png',data:{url:new URL('./?experience=1',self.registration.scope).href}});
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    windows.forEach(client=>client.postMessage({type:'push-received',id:data.tag}));
  })());
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const client=windows.find(c=>c.url.startsWith(self.registration.scope));
    if(client){await client.focus();client.postMessage({type:'push-open'});}
    else await self.clients.openWindow(new URL('./?experience=1',self.registration.scope).href);
  })());
});
