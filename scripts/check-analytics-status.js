#!/usr/bin/env node

/**
 * Analytics Status Checker
 * Verifies that analytics configuration is correct
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Analytics Configuration Status...\n');

let allTestsPassed = true;

function checkTest(condition, successMessage, errorMessage) {
  if (condition) {
    console.log(`✅ ${successMessage}`);
  } else {
    console.log(`❌ ${errorMessage}`);
    allTestsPassed = false;
  }
}

// Test 1: Check environment variables
try {
  const envPath = path.join(__dirname, '..', '.env.local');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasGA = envContent.includes('NEXT_PUBLIC_GA_ID=G-KXEWQGL8JY');
  checkTest(hasGA,
    'Environment variable NEXT_PUBLIC_GA_ID is set correctly',
    'Environment variable NEXT_PUBLIC_GA_ID is missing or incorrect'
  );
} catch (error) {
  checkTest(false, '', '.env.local file not found');
}

// Test 2: Check analytics.ts configuration
try {
  const analyticsPath = path.join(__dirname, '..', 'lib', 'analytics.ts');
  const analyticsContent = fs.readFileSync(analyticsPath, 'utf8');
  const hasTrackingId = analyticsContent.includes('G-KXEWQGL8JY');
  const hasExport = analyticsContent.includes('export const GA_TRACKING_ID');
  checkTest(hasTrackingId && hasExport,
    'Analytics configuration file is correct',
    'Analytics configuration file has issues'
  );
} catch (error) {
  checkTest(false, '', 'lib/analytics.ts file not found');
}

// Test 3: Check components integration
try {
  const clientProvidersPath = path.join(__dirname, '..', 'components', 'client-providers.tsx');
  const clientContent = fs.readFileSync(clientProvidersPath, 'utf8');
  const hasAnalytics = clientContent.includes('<Analytics />');
  const hasPrivacyBanner = clientContent.includes('<PrivacyBanner />');
  checkTest(hasAnalytics && hasPrivacyBanner,
    'Analytics components are properly integrated',
    'Analytics components are missing from ClientProviders'
  );
} catch (error) {
  checkTest(false, '', 'components/client-providers.tsx file not found');
}

// Test 4: Check layout for no duplicate analytics
try {
  const layoutPath = path.join(__dirname, '..', 'app', 'layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  const hasHardcodedGA = layoutContent.includes('gtag.js');
  checkTest(!hasHardcodedGA,
    'No duplicate analytics scripts in layout',
    'Duplicate analytics scripts found in layout.tsx'
  );
} catch (error) {
  checkTest(false, '', 'app/layout.tsx file not found');
}

// Test 5: Check if testing tool exists
try {
  const testToolPath = path.join(__dirname, '..', 'public', 'test-analytics.html');
  const exists = fs.existsSync(testToolPath);
  checkTest(exists,
    'Analytics testing tool is available',
    'Analytics testing tool not found'
  );
} catch (error) {
  checkTest(false, '', 'Error checking test tool');
}

// Summary
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 ALL TESTS PASSED!');
  console.log('\n📋 Next Steps:');
  console.log('1. Deploy your changes to production');
  console.log('2. Visit your live site at: https://your-domain.com');
  console.log('3. Test analytics with: https://your-domain.com/test-analytics.html');
  console.log('4. Check Google Analytics Real-Time reports');
  console.log('5. Verify events are tracking properly');
} else {
  console.log('❌ SOME TESTS FAILED');
  console.log('\n🔧 Fix the issues above before deploying');
}

console.log('\n📊 Analytics Configuration:');
console.log('- Tracking ID: G-KXEWQGL8JY');
console.log('- Privacy-first implementation with consent banner');
console.log('- Custom event tracking for studios, retreats, and user actions');
console.log('- Core Web Vitals performance monitoring');
console.log('- Real-time analytics with DebugView support');

console.log('\n🔗 Useful Links:');
console.log('- Google Analytics: https://analytics.google.com');
console.log('- Real-Time Reports: https://analytics.google.com/analytics/web/#/realtime');
console.log('- DebugView: https://analytics.google.com/analytics/web/#/debugview');

process.exit(allTestsPassed ? 0 : 1);