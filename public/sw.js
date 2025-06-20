const CACHE_NAME = 'bali-yoga-v1.0.0'
const urlsToCache = [
  '/',
  '/manifest.webmanifest',
  '/images/blog/',
  // Add more static assets as needed
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return
  
  // Skip API routes and analytics
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('google-analytics.com') ||
    event.request.url.includes('googletagmanager.com') ||
    event.request.url.includes('maps.googleapis.com')
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
}) 