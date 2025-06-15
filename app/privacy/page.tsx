import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Hero Section */}
      <div className="bg-[#5d4c42] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">Privacy Policy</h1>
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
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">1. Introduction</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  At Bali Yoga, we are committed to protecting your privacy and ensuring the security of your personal 
                  information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">2. Information We Collect</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Personal Information</h3>
                    <p className="mb-2">We may collect personal information that you voluntarily provide, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Name and contact information (email, phone number)</li>
                      <li>Business information for partner applications</li>
                      <li>Feedback and review content</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Automatically Collected Information</h3>
                    <p className="mb-2">When you visit our website, we may automatically collect:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>IP address and location data</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Pages visited and time spent on site</li>
                      <li>Referring website information</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">3. How We Use Your Information</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed">
                  <p className="mb-3">We use the collected information for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and maintain our directory services</li>
                    <li>To process partner applications and manage listings</li>
                    <li>To respond to your inquiries and provide customer support</li>
                    <li>To send you updates about our services (with your consent)</li>
                    <li>To improve our website and user experience</li>
                    <li>To analyze website usage and trends</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">4. Information Sharing and Disclosure</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed space-y-4">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>With Partner Studios/Retreats:</strong> When you contact a listed business, we may share your contact information to facilitate communication</li>
                    <li><strong>Service Providers:</strong> With trusted third-party service providers who assist us in operating our website</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                    <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">5. Cookies and Tracking Technologies</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed space-y-3">
                  <p>We use cookies and similar tracking technologies to enhance your browsing experience:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                  <p>You can control cookie settings through your browser preferences.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">6. Data Security</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
                  the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">7. Data Retention</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
                  Privacy Policy, unless a longer retention period is required or permitted by law. Partner information may 
                  be retained for the duration of the business relationship.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">8. Your Rights</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed">
                  <p className="mb-3">Depending on your location, you may have the following rights regarding your personal information:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Objection:</strong> Object to certain processing of your information</li>
                    <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                  </ul>
                  <p className="mt-3">To exercise these rights, please contact us using the information provided below.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">9. Third-Party Links</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Our website may contain links to third-party websites, including partner studios and retreat centers. 
                  We are not responsible for the privacy practices or content of these external sites. We encourage you 
                  to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">10. Children's Privacy</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Our services are not intended for children under the age of 16. We do not knowingly collect personal 
                  information from children under 16. If we become aware that we have collected personal information from 
                  a child under 16, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">11. International Data Transfers</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure that 
                  such transfers are conducted in accordance with applicable data protection laws and with appropriate 
                  safeguards in place.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">12. Changes to This Privacy Policy</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                  new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this 
                  Privacy Policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">13. Contact Us</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
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
            href="/terms"
            className="rounded-lg bg-[#5d4c42] px-6 py-3 font-semibold text-white text-center transition-colors hover:bg-[#a39188]"
          >
            Terms of Service
          </a>
          <a
            href="/cookies"
            className="rounded-lg border-2 border-[#5d4c42] px-6 py-3 font-semibold text-[#5d4c42] text-center transition-colors hover:bg-[#5d4c42] hover:text-white"
          >
            Cookie Policy
          </a>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 