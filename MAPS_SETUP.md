# Maps Setup Guide

## Why Maps Weren't Working

The maps in the detailed view weren't working because:

1. **Mapbox Static API doesn't support direct address geocoding** in the URL format we were using
2. **The demo API key had limitations** and wasn't properly configured
3. **Address-based mapping requires proper geocoding** before displaying

## Solution: Google Maps Static API

We've switched to Google Maps Static API because:
- ✅ **Better address geocoding** - Handles addresses directly
- ✅ **More reliable** - Better global coverage
- ✅ **Simpler implementation** - No need for separate geocoding step

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps Static API**
4. Go to **APIs & Services > Credentials**
5. Click **Create Credentials > API Key**
6. Copy your API key

### 2. Add to Environment Variables

Add this to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Secure Your API Key (Recommended)

1. In Google Cloud Console, go to your API key
2. Click **Restrict Key**
3. Under **Application restrictions**, select **HTTP referrers**
4. Add your domains:
   - `localhost:3000/*` (for development)
   - `yourdomain.com/*` (for production)
5. Under **API restrictions**, select **Restrict key**
6. Choose **Maps Static API**

## How It Works Now

### With Coordinates (Preferred)
```
https://maps.googleapis.com/maps/api/staticmap?
center=LAT,LNG&
zoom=15&
size=400x200&
markers=color:red|LAT,LNG&
key=YOUR_API_KEY
```

### With Address (Fallback)
```
https://maps.googleapis.com/maps/api/staticmap?
center=ADDRESS, Bali, Indonesia&
zoom=15&
size=400x200&
markers=color:red|ADDRESS, Bali, Indonesia&
key=YOUR_API_KEY
```

## Fallback Behavior

1. **If coordinates exist** → Use coordinates for precise mapping
2. **If only address exists** → Use address with ", Bali, Indonesia" appended
3. **If map fails to load** → Show "Map not available" message
4. **If no API key** → Show "Google Maps API key required" message

## Cost Considerations

- Google Maps Static API has a **free tier**: 28,000 map loads per month
- After that: $2 per 1,000 additional requests
- For most small to medium websites, this stays within the free tier

## Alternative Solutions

If you prefer not to use Google Maps:

### Option 1: OpenStreetMap (Free)
```javascript
// Example using OpenStreetMap tiles
const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
```

### Option 2: Mapbox with Geocoding
1. Get coordinates first using Mapbox Geocoding API
2. Then use those coordinates for static maps

### Option 3: No Maps
Simply remove the map section and show only the address text.

## Testing

To test if maps are working:

1. **With API key**: Maps should load showing the location
2. **Without API key**: Should show "Google Maps API key required"
3. **With invalid address**: Should show "Map not available"

## Current Status

- ✅ **Coordinates-based maps**: Work perfectly
- ✅ **Address-based maps**: Work with Google Maps API key
- ✅ **Error handling**: Graceful fallbacks for all scenarios
- ✅ **No API key**: Clear message about what's needed 