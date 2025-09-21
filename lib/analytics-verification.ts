/**
 * Analytics Verification Utilities
 * Helper functions to verify analytics are working correctly
 */

export interface AnalyticsStatus {
  isEnabled: boolean;
  hasTrackingId: boolean;
  hasConsent: boolean;
  gtagLoaded: boolean;
  dataLayerExists: boolean;
  errors: string[];
}

export function checkAnalyticsStatus(): AnalyticsStatus {
  const status: AnalyticsStatus = {
    isEnabled: false,
    hasTrackingId: false,
    hasConsent: false,
    gtagLoaded: false,
    dataLayerExists: false,
    errors: []
  };

  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      status.errors.push('Not running in browser environment');
      return status;
    }

    // Check tracking ID
    const trackingId = 'G-KXEWQGL8JY';
    status.hasTrackingId = !!trackingId;

    // Check if gtag is loaded
    status.gtagLoaded = typeof window.gtag === 'function';
    if (!status.gtagLoaded) {
      status.errors.push('gtag function not available');
    }

    // Check dataLayer
    status.dataLayerExists = !!(window.dataLayer && Array.isArray(window.dataLayer));
    if (!status.dataLayerExists) {
      status.errors.push('dataLayer not available');
    }

    // Check consent
    try {
      const consent = localStorage.getItem('analytics_consent');
      status.hasConsent = consent === 'granted';
      if (!status.hasConsent && consent === 'denied') {
        status.errors.push('User has denied analytics consent');
      } else if (!consent) {
        status.errors.push('No consent decision recorded');
      }
    } catch (error) {
      status.errors.push('Cannot access localStorage for consent check');
    }

    // Overall status
    status.isEnabled = status.hasTrackingId && status.gtagLoaded && status.dataLayerExists && status.hasConsent;

  } catch (error) {
    status.errors.push(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return status;
}

export function logAnalyticsStatus(): void {
  const status = checkAnalyticsStatus();

  console.group('🔍 Analytics Status Check');
  console.log('Overall Status:', status.isEnabled ? '✅ Working' : '❌ Not Working');
  console.log('Tracking ID:', status.hasTrackingId ? '✅ Available' : '❌ Missing');
  console.log('gtag Function:', status.gtagLoaded ? '✅ Loaded' : '❌ Not Loaded');
  console.log('DataLayer:', status.dataLayerExists ? '✅ Available' : '❌ Missing');
  console.log('User Consent:', status.hasConsent ? '✅ Granted' : '❌ Not Granted');

  if (status.errors.length > 0) {
    console.group('❌ Errors');
    status.errors.forEach(error => console.log(`• ${error}`));
    console.groupEnd();
  }

  if (status.isEnabled) {
    console.log('🎉 Analytics are working correctly!');
    console.log('Check Google Analytics Real-Time reports to see data');
  } else {
    console.log('🔧 Fix the issues above to enable analytics tracking');
  }

  console.groupEnd();
}

export function testAnalyticsEvent(eventName: string = 'test_verification'): boolean {
  const status = checkAnalyticsStatus();

  if (!status.isEnabled) {
    console.warn('Cannot test event - analytics not properly configured');
    return false;
  }

  try {
    window.gtag('event', eventName, {
      event_category: 'Testing',
      event_label: 'Analytics Verification Test',
      timestamp: new Date().toISOString()
    });

    console.log(`✅ Test event '${eventName}' sent successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send test event: ${error}`);
    return false;
  }
}

export function verifyRealTimeTracking(): void {
  console.log('🔄 Testing real-time tracking...');

  const status = checkAnalyticsStatus();
  if (!status.isEnabled) {
    console.error('❌ Analytics not enabled - cannot test real-time tracking');
    return;
  }

  // Send a test page view
  try {
    window.gtag('config', 'G-KXEWQGL8JY', {
      page_title: 'Analytics Verification Test',
      page_location: window.location.href,
      custom_map: {
        dimension1: 'verification_test'
      }
    });

    console.log('✅ Page view sent for real-time tracking');
    console.log('📊 Check Google Analytics Real-Time reports now');
    console.log('🔗 https://analytics.google.com/analytics/web/#/realtime');
  } catch (error) {
    console.error(`❌ Failed to send page view: ${error}`);
  }
}

// Browser-only function to be called from console
export function runAnalyticsVerification(): void {
  console.clear();
  console.log('🚀 Starting Analytics Verification...\n');

  logAnalyticsStatus();
  console.log('\n');

  const status = checkAnalyticsStatus();
  if (status.isEnabled) {
    testAnalyticsEvent('verification_test');
    console.log('\n');
    verifyRealTimeTracking();
  }

  console.log('\n📋 Next Steps:');
  if (status.isEnabled) {
    console.log('1. Check Google Analytics Real-Time reports');
    console.log('2. Navigate to different pages to test page views');
    console.log('3. Test specific events (studio views, searches, etc.)');
  } else {
    console.log('1. Fix the errors listed above');
    console.log('2. Refresh the page and run this test again');
    console.log('3. Ensure you have accepted analytics consent');
  }
}

// Make verification function available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).verifyAnalytics = runAnalyticsVerification;
  console.log('🔧 Analytics verification available: run verifyAnalytics() in console');
}