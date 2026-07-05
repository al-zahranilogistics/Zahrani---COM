// sw.js - Service Worker لإشعارات الخلفية
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});

// استقبال رسائل من الصفحة وعرض إشعار النظام
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const title = event.data.title || 'تنبيه';
        const options = {
            body: event.data.body || '',
            icon: 'https://res.cloudinary.com/dzukfybwr/image/upload/v1774965392/PQ%D8%AD%D8%B6%D9%88%D8%B1_mrfvvb.png',
            badge: 'https://res.cloudinary.com/dzukfybwr/image/upload/v1774965392/PQ%D8%AD%D8%B6%D9%88%D8%B1_mrfvvb.png',
            data: { url: event.data.url || self.location.origin }
        };
        event.waitUntil(self.registration.showNotification(title, options));
    }
});

// عند النقر على الإشعار: فتح الموقع أو التركيز على التبويب المفتوح
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const urlToOpen = event.notification.data.url || self.location.origin;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url.startsWith(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});