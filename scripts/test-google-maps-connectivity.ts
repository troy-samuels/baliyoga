import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config({ path: '.env.local' })

function get(name: string): string | undefined {
  const v = process.env[name]?.trim()
  return v && v.length > 0 ? v : undefined
}

async function testStaticMaps(): Promise<{ ok: boolean; status?: number; note?: string }> {
  const key = get('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY') || get('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY')
  const q = encodeURIComponent('Ubud, Bali, Indonesia')
  const url = key
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${q}&zoom=14&size=320x160&scale=2&maptype=roadmap&key=${encodeURIComponent(key)}`
    : `https://maps.googleapis.com/maps/api/staticmap?center=${q}&zoom=14&size=320x160&scale=2&maptype=roadmap`
  try {
    const res = await fetch(url)
    const ct = res.headers.get('content-type') || ''
    if (res.ok && ct.startsWith('image/')) return { ok: true }
    const text = await res.text()
    return { ok: false, status: res.status, note: text.slice(0, 200) }
  } catch (e: any) {
    return { ok: false, note: e?.message }
  }
}

async function testGeocoding(): Promise<{ ok: boolean; status?: number; note?: string }> {
  const key = get('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY') || get('NEXT_PUBLIC_GOOGLE_PLACES_API_KEY')
  if (!key) return { ok: false, note: 'No key found in env' }
  const q = encodeURIComponent('Bali Yoga, Bali, Indonesia')
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${q}&key=${encodeURIComponent(key)}&components=country:ID`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (res.ok && data.status === 'OK') return { ok: true }
    return { ok: false, status: res.status, note: data.status }
  } catch (e: any) {
    return { ok: false, note: e?.message }
  }
}

async function main() {
  console.log('🔍 Testing Google Maps connectivity...')
  const [staticRes, geoRes] = await Promise.all([testStaticMaps(), testGeocoding()])
  console.log('Static Maps:', staticRes)
  console.log('Geocoding:', geoRes)
  if (!staticRes.ok || !geoRes.ok) {
    process.exit(1)
  }
  console.log('✅ Connectivity OK')
}

main().catch((e) => {
  console.error('❌ Error:', e)
  process.exit(1)
})

