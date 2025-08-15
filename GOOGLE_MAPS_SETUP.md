# Google Maps API Setup Guide

To enable interactive maps on your yoga studio and retreat detail pages, you'll need to set up a Google Maps API key.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled for your project

## Step 2: Enable the Maps Embed API

1. In the Google Cloud Console, go to the **APIs & Services** > **Library**
2. Search for "Maps Embed API"
3. Click on it and press **Enable**

## Step 3: Create an API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key

## Step 4: Secure Your API Key (Recommended)

1. Click on your newly created API key to edit it
2. Under **Application restrictions**, select **HTTP referrers (web sites)**
3. Add your domain(s):
   - `localhost:3000/*` (for development)
   - `localhost:3001/*` (for development)
   - `yourdomain.com/*` (for production)
   - `*.yourdomain.com/*` (for subdomains)

## Step 5: Configure Your Environment

1. Open your `.env.local` file
2. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## Step 6: Restart Your Development Server

```bash
npm run dev
```

## Features You'll Get

✅ **Interactive Maps** - Embedded Google Maps showing exact location  
✅ **Loading States** - Smooth loading animation while maps load  
✅ **Fallback UI** - Beautiful fallback when API key isn't configured  
✅ **External Links** - "Open in Google Maps" buttons for native app  
✅ **Mobile Optimized** - Responsive design for all devices  

## Cost Information

- Google Maps Embed API has a **generous free tier**
- First 100,000 map loads per month are **free**
- After that, it's $7 per 1,000 additional map loads
- For most yoga websites, you'll stay within the free tier

## Troubleshooting

**Maps not showing?**
- Check your API key is correct in `.env.local`
- Verify the Maps Embed API is enabled in Google Cloud Console
- Make sure billing is enabled for your Google Cloud project
- Check browser console for any error messages

**Getting "API key not valid" errors?**
- Ensure your domain is added to the API key restrictions
- Wait a few minutes after creating the key (can take time to propagate)

## Support

If you need help setting this up, the maps will gracefully fall back to a styled location card with a "View on Google Maps" button that works without an API key.