# 🔍 Analytics Testing & Verification Guide

## ✅ **Quick Verification Checklist**

### **1. Immediate Post-Deployment Test (5 minutes)**
- [ ] Visit your deployed website in **incognito mode**
- [ ] Verify **privacy banner appears** at bottom of page
- [ ] Click **"Accept"** button and confirm banner disappears
- [ ] Check browser **DevTools Console** for no analytics errors
- [ ] Verify no console errors about `gtag is not defined`

### **2. Google Analytics Real-Time Test (2 minutes)**
- [ ] Open [Google Analytics](https://analytics.google.com)
- [ ] Navigate to **Reports → Real-time → Overview**
- [ ] Visit your website in another tab
- [ ] **Within 30 seconds**: Should see 1 active user appear
- [ ] Verify correct page path is being tracked (e.g., `/studios`, `/retreats`)

### **3. Event Tracking Verification (5 minutes)**
- [ ] Navigate to different sections (studios, retreats, blog)
- [ ] Use the search functionality
- [ ] Add items to wishlist
- [ ] Check **GA4 → Real-time → Events** for custom events:
  - `page_view`
  - `view_studio`
  - `search`
  - `add_to_wishlist`
  - `consent_granted`

## 🛠️ **Technical Debugging Steps**

### **Browser DevTools Verification**
Open browser DevTools (F12) and run these tests:

#### **Network Tab Check**
1. Open **Network** tab in DevTools
2. Refresh your website
3. Look for successful requests to:
   - `googletagmanager.com/gtag/js?id=G-KXEWQGL8JY`
   - Status should be **200 OK**

#### **Console Commands Test**
Copy and paste in browser console:
```javascript
// Test 1: Check if analytics is loaded
console.log('Analytics enabled:', !!window.gtag);
console.log('DataLayer exists:', !!window.dataLayer);

// Test 2: Check consent status
console.log('Consent status:', localStorage.getItem('analytics_consent'));

// Test 3: Check tracking ID
console.log('Environment GA ID:', 'G-KXEWQGL8JY');

// Test 4: Manual event test (after accepting consent)
if (window.gtag) {
  window.gtag('event', 'test_event', {
    event_category: 'Testing',
    event_label: 'Manual Console Test'
  });
  console.log('✅ Test event sent successfully');
} else {
  console.log('❌ gtag not available');
}
```

#### **Local Storage Check**
1. DevTools → **Application** tab → **Local Storage**
2. Look for `analytics_consent` key
3. Value should be `"granted"` after accepting consent

## 📱 **Cross-Platform Testing**

### **Desktop Browsers**
- [ ] **Chrome**: Privacy banner works, events track
- [ ] **Safari**: No blocking, consent functions
- [ ] **Firefox**: Analytics load properly
- [ ] **Edge**: Full functionality

### **Mobile Devices**
- [ ] **Mobile Safari**: Touch interactions with consent banner
- [ ] **Mobile Chrome**: All events track correctly
- [ ] **Responsive Design**: Banner displays properly on small screens

## 📊 **Google Analytics Dashboard Verification**

### **Real-Time Reports (Immediate)**
Path: **Google Analytics → Reports → Real-time**
- **Overview**: Active users count
- **Events**: Custom events appearing
- **Conversions**: Wishlist additions, form submissions
- **Audiences**: Geographic data

### **DebugView (Development)**
Path: **Google Analytics → Configure → DebugView**
1. Enable debug mode for your property
2. Visit site with `?debug_mode=1` parameter
3. See detailed event data in real-time
4. Perfect for testing specific events

### **Events Report (24-48 hours)**
Path: **Google Analytics → Reports → Engagement → Events**
- Look for custom events:
  - `view_studio`
  - `view_retreat`
  - `search`
  - `add_to_wishlist`
  - `core_web_vitals`
  - `consent_granted`

## 🚨 **Troubleshooting Common Issues**

### **No Data Appearing**
✅ **Check:**
- Environment variable `NEXT_PUBLIC_GA_ID=G-KXEWQGL8JY` is set
- User accepted consent (not declined)
- No ad blockers preventing Google Analytics
- Site is properly deployed (not localhost)

### **Privacy Banner Not Showing**
✅ **Check:**
- Clear browser cache and cookies
- Test in incognito/private mode
- Verify ClientProviders includes `<PrivacyBanner />`
- Check console for JavaScript errors

### **Events Not Tracking**
✅ **Check:**
- User gave consent before triggering events
- Custom events are properly implemented
- No JavaScript errors breaking gtag function
- Network requests to GA are successful

### **Console Errors**
❌ **Common Errors:**
```javascript
// Error: gtag is not defined
// Solution: Check if Analytics component is loaded

// Error: Cannot read property 'gtag' of undefined
// Solution: Ensure consent was granted before tracking

// Error: Failed to load resource: googletagmanager.com
// Solution: Check for ad blockers or network restrictions
```

## 🎯 **Performance Metrics Verification**

Your analytics track **Core Web Vitals**:

### **LCP (Largest Contentful Paint)**
- **Good**: < 2.5 seconds
- **Needs Improvement**: 2.5-4 seconds
- **Poor**: > 4 seconds

### **FID (First Input Delay)**
- **Good**: < 100ms
- **Needs Improvement**: 100-300ms
- **Poor**: > 300ms

### **CLS (Cumulative Layout Shift)**
- **Good**: < 0.1
- **Needs Improvement**: 0.1-0.25
- **Poor**: > 0.25

**Check in:** GA4 → Reports → Engagement → Events → `core_web_vitals`

## 🔄 **Ongoing Monitoring**

### **Daily Checks**
- [ ] Google Analytics shows visitors
- [ ] No significant drop in tracked events
- [ ] Core Web Vitals remain healthy

### **Weekly Reviews**
- [ ] Review most popular content
- [ ] Check user behavior flows
- [ ] Monitor conversion events (wishlist adds)
- [ ] Review performance metrics trends

### **Monthly Analysis**
- [ ] Export detailed analytics reports
- [ ] Analyze user acquisition sources
- [ ] Review site performance improvements
- [ ] Plan content based on user behavior

## 📞 **Need Help?**

**If analytics still aren't working:**
1. **Check this file first** - most issues are covered above
2. **Verify deployment** - ensure latest code is live
3. **Test in multiple browsers** - rule out browser-specific issues
4. **Check GA4 property setup** - ensure correct tracking ID
5. **Review console logs** - JavaScript errors break tracking

**Expected Timeline:**
- **Real-time data**: Immediate (30 seconds)
- **Event data**: 1-2 hours for full reporting
- **Demographics**: 24-48 hours
- **Search Console**: 3-7 days for indexing

---

✅ **Success Indicator**: When you see real-time users in Google Analytics while browsing your site, your analytics are working perfectly!