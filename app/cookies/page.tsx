import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Hero Section */}
      <div className="bg-[#5d4c42] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">Cookie Policy</h1>
          <p className="mt-4 text-lg opacity-90">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-[#e6ceb3]">
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8 text-[#5d4c42]">
              
              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">1. What Are Cookies?</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                  They are widely used to make websites work more efficiently and to provide information to website owners 
                  about how users interact with their sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">2. How We Use Cookies</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Bali Yoga uses cookies to enhance your browsing experience, analyze website traffic, and understand where 
                  our visitors are coming from. We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#5d4c42]/80">
                  <li>To remember your preferences and settings</li>
                  <li>To analyze how our website is used and improve its performance</li>
                  <li>To provide personalized content and recommendations</li>
                  <li>To ensure the security and proper functioning of our website</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">3. Types of Cookies We Use</h2>
                
                <div className="space-y-6">
                  <div className="bg-[#f9f3e9] p-6 rounded-lg border border-[#e6ceb3]">
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-3">Essential Cookies</h3>
                    <p className="text-[#5d4c42]/80 mb-2">
                      These cookies are necessary for the website to function properly. They enable basic functions like 
                      page navigation and access to secure areas of the website.
                    </p>
                    <p className="text-sm text-[#5d4c42]/60">
                      <strong>Duration:</strong> Session cookies (deleted when you close your browser)
                    </p>
                  </div>

                  <div className="bg-[#f9f3e9] p-6 rounded-lg border border-[#e6ceb3]">
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-3">Analytics Cookies</h3>
                    <p className="text-[#5d4c42]/80 mb-2">
                      These cookies help us understand how visitors interact with our website by collecting and reporting 
                      information anonymously. This helps us improve our website's performance and user experience.
                    </p>
                    <p className="text-sm text-[#5d4c42]/60">
                      <strong>Duration:</strong> Up to 2 years<br />
                      <strong>Third-party services:</strong> Google Analytics (if applicable)
                    </p>
                  </div>

                  <div className="bg-[#f9f3e9] p-6 rounded-lg border border-[#e6ceb3]">
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-3">Functional Cookies</h3>
                    <p className="text-[#5d4c42]/80 mb-2">
                      These cookies enable the website to provide enhanced functionality and personalization. They may be 
                      set by us or by third-party providers whose services we have added to our pages.
                    </p>
                    <p className="text-sm text-[#5d4c42]/60">
                      <strong>Duration:</strong> Up to 1 year<br />
                      <strong>Examples:</strong> Language preferences, location settings
                    </p>
                  </div>

                  <div className="bg-[#f9f3e9] p-6 rounded-lg border border-[#e6ceb3]">
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-3">Performance Cookies</h3>
                    <p className="text-[#5d4c42]/80 mb-2">
                      These cookies collect information about how you use our website, such as which pages you visit most 
                      often. This data helps us optimize our website's performance and user experience.
                    </p>
                    <p className="text-sm text-[#5d4c42]/60">
                      <strong>Duration:</strong> Up to 1 year<br />
                      <strong>Data collected:</strong> Page views, time spent on pages, bounce rate
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">4. Third-Party Cookies</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Some cookies on our website are set by third-party services that appear on our pages. We may use the 
                  following third-party services that set cookies:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#5d4c42]/80">
                  <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                  <li><strong>Google Maps:</strong> For displaying location information and maps</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing functionality (if applicable)</li>
                </ul>
                <p className="text-[#5d4c42]/80 leading-relaxed mt-4">
                  These third-party services have their own privacy policies and cookie policies, which we encourage you to review.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">5. Managing Your Cookie Preferences</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed space-y-4">
                  <p>You have several options for managing cookies:</p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Browser Settings</h3>
                    <p className="mb-2">Most web browsers allow you to control cookies through their settings preferences:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Block all cookies</li>
                      <li>Block third-party cookies only</li>
                      <li>Delete cookies when you close your browser</li>
                      <li>Get notified when a website tries to set a cookie</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Browser-Specific Instructions</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                      <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                      <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">6. Impact of Disabling Cookies</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  While you can disable cookies, please note that doing so may affect your experience on our website:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[#5d4c42]/80">
                  <li>Some features may not work properly or at all</li>
                  <li>You may need to re-enter information more frequently</li>
                  <li>Personalized content and recommendations may not be available</li>
                  <li>We may not be able to remember your preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">7. Updates to This Cookie Policy</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
                  operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
                  updated policy on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">8. Contact Us</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                </p>
                <div className="bg-[#f9f3e9] p-4 rounded-lg border border-[#e6ceb3]">
                  <p className="text-[#5d4c42]/80">
                    Email: privacy@baliyoga.com<br />
                    Address: Ubud, Bali, Indonesia<br />
                    Phone: +62 361 123 4567
                  </p>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/privacy"
            className="rounded-lg bg-[#5d4c42] px-6 py-3 font-semibold text-white text-center transition-colors hover:bg-[#a39188]"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="rounded-lg border-2 border-[#5d4c42] px-6 py-3 font-semibold text-[#5d4c42] text-center transition-colors hover:bg-[#5d4c42] hover:text-white"
          >
            Terms of Service
          </a>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 