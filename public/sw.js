const CACHE_NAME = 'bali-yoga-v2.0.0'
const STATIC_CACHE = 'static-v2'
const DYNAMIC_CACHE = 'dynamic-v2'
const IMAGE_CACHE = 'images-v2'

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/studios',
  '/retreats',
  '/manifest.webmanifest'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - optimized caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip Chrome extension and external analytics
  if (
    url.protocol === 'chrome-extension:' ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('googletagmanager.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    return
  }

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request))
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(handleStaticAssets(request))
  } else {
    event.respondWith(handlePageRequest(request))
  }
})

// Handle image requests with cache-first strategy and longer TTL
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response('Image not available', { status: 404 })
  }
}

// Handle API requests with network-first strategy and short cache
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE)
    const cachedResponse = await cache.match(request)
    return cachedResponse || new Response('Network error', { status: 503 })
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cache = await caches.open(STATIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response('Asset not available', { status: 404 })
  }
}

// Handle page requests with stale-while-revalidate strategy
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const cachedResponse = await cache.match(request)
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  })
  
  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise
} 