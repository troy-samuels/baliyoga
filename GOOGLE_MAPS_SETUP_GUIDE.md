# 🗺️ Google Maps Setup Guide

The interactive maps on your detail pages require a Google Maps API key. Here's how to set it up:

## Quick Setup (5 minutes)

### Step 1: Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable "Maps JavaScript API" and "Geocoding API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key (starts with `AIza...`)

### Step 2: Add to Environment
Add this line to your `.env.local` file:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-actual-key-here
```

### Step 3: Secure Your API Key (Recommended)
1. In Google Cloud Console, click on your API key
2. Under "API restrictions", select "Restrict key"
3. Choose "Maps JavaScript API" and "Geocoding API"
4. Under "Website restrictions", add your domain(s):
   - `localhost:3000` (for development)
   - `baliyoga.com` (for production)
   - `*.vercel.app` (if using Vercel)

### Step 4: Test
Visit any studio or retreat detail page - the map should load properly!

## Current Status
- ❌ Maps API key not configured
- 📍 Showing clickable fallback maps (users can still view on Google Maps)
- ✅ All other functionality working normally

## Cost Information
- Google Maps provides $200 free credit monthly
- Typical usage for yoga website: $5-15/month
- Maps JavaScript API: $7 per 1,000 loads
- Geocoding API: $5 per 1,000 requests

## Troubleshooting

**Map shows "Maps API key missing":**
- Check that your `.env.local` file contains `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- Restart your development server (`npm run dev`)
- Verify the API key starts with `AIza`

**Map loads but shows grey/blank:**
- Enable "Maps JavaScript API" in Google Cloud Console
- Check API key restrictions
- Look for error messages in browser console

**Geocoding not working:**
- Enable "Geocoding API" in Google Cloud Console
- Check API key has access to both APIs

## Alternative: Free Fallback
The current fallback maps are actually quite user-friendly:
- Show location with nice visual design
- Click to open Google Maps directly
- No API costs
- Works for most use cases

You can keep using the fallback if you prefer to avoid API costs!