const CACHE_NAME = 'humsj-v1.0.0';
const STATIC_CACHE = 'humsj-static-v1.0.0';
const DYNAMIC_CACHE = 'humsj-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.jpg',
  '/mosques.jpg',
  '/manifest.json',
  // Add critical CSS and JS files
  '/src/index.css',
  '/src/main.tsx'
];

// Islamic content to cache for offline access
const ISLAMIC_CONTENT = [
  '/api/prayer-times',
  '/api/quran-verses',
  '/api/hadith-collection'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Service Worker: Preparing dynamic cache');
        return cache.addAll([]);
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        console.log('Service Worker: Serving from cache:', request.url);
        return cachedResponse;
      }

      // Network first for API calls
      if (url.pathname.startsWith('/api/')) {
        return fetch(request).then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        });
      }

      // Cache first for static assets
      return fetch(request).then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback to offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/index.html');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

// Background sync for prayer reminders
self.addEventListener('sync', (event) => {
  if (event.tag === 'prayer-reminder') {
    event.waitUntil(handlePrayerReminder());
  }
});

// Push notifications for prayer times
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo.jpg',
      badge: '/logo.jpg',
      vibrate: [200, 100, 200],
      data: data.data,
      actions: [
        { action: 'dismiss', title: 'Dismiss' },
        { action: 'snooze', title: 'Remind in 5 min' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'snooze') {
    // Schedule another notification in 5 minutes
    setTimeout(() => {
      self.registration.showNotification('Prayer Reminder', {
        body: 'Prayer time is approaching',
        icon: '/logo.jpg',
        badge: '/logo.jpg'
      });
    }, 5 * 60 * 1000);
  } else {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Handle prayer reminder background task
async function handlePrayerReminder() {
  try {
    // Get current prayer times
    const response = await fetch('/api/prayer-times');
    if (response.ok) {
      const prayerTimes = await response.json();
      // Process prayer reminders logic here
      console.log('Prayer reminder background sync completed');
    }
  } catch (error) {
    console.error('Prayer reminder background sync failed:', error);
  }
}

// Periodic background sync for prayer times
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'prayer-times-update') {
    event.waitUntil(updatePrayerTimes());
  }
});

async function updatePrayerTimes() {
  try {
    const response = await fetch('/api/prayer-times');
    if (response.ok) {
      const prayerTimes = await response.json();
      // Cache updated prayer times
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put('/api/prayer-times', new Response(JSON.stringify(prayerTimes)));
      console.log('Prayer times updated in background');
    }
  } catch (error) {
    console.error('Failed to update prayer times:', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded successfully');