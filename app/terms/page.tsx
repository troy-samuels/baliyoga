import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Hero Section */}
      <div className="bg-[#5d4c42] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-5xl">Terms of Service</h1>
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
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">1. Acceptance of Terms</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  By accessing and using the Bali Yoga website ("Service"), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">2. Description of Service</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Bali Yoga is a directory platform that connects users with yoga studios, retreat centers, and related 
                  wellness services in Bali, Indonesia. We provide information, reviews, and contact details to help users 
                  find suitable yoga experiences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">3. User Responsibilities</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed space-y-3">
                  <p>As a user of our service, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate and truthful information when submitting reviews or partner applications</li>
                    <li>Use the service only for lawful purposes</li>
                    <li>Not attempt to gain unauthorized access to our systems or data</li>
                    <li>Respect the intellectual property rights of Bali Yoga and third parties</li>
                    <li>Not post or transmit any harmful, offensive, or inappropriate content</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">4. Partner Listings</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Bali Yoga serves as a platform for yoga studios and retreat centers to showcase their services. We do not 
                  guarantee the accuracy of all information provided by partners, nor do we endorse any specific business. 
                  Users should verify details directly with service providers before making bookings or commitments.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">5. Booking and Payments</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Bali Yoga does not process bookings or payments directly. All transactions are between users and the 
                  respective yoga studios or retreat centers. We are not responsible for any disputes, cancellations, 
                  or issues arising from these direct transactions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">6. Intellectual Property</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  The content, organization, graphics, design, compilation, magnetic translation, digital conversion, 
                  and other matters related to the Bali Yoga website are protected under applicable copyrights, trademarks, 
                  and other proprietary rights. Copying, redistribution, or publication of any such matters is strictly prohibited.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">7. Privacy Policy</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                  to understand our practices regarding the collection and use of your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">8. Disclaimers</h2>
                <div className="text-[#5d4c42]/80 leading-relaxed space-y-3">
                  <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
                  Bali Yoga excludes all representations, warranties, conditions, and terms including:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>The accuracy, completeness, or reliability of partner information</li>
                    <li>The quality or safety of services provided by listed partners</li>
                    <li>The availability of services or accuracy of pricing information</li>
                    <li>Any technical issues or interruptions to our service</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">9. Limitation of Liability</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  In no event shall Bali Yoga be liable for any direct, indirect, punitive, incidental, special, 
                  consequential damages or any damages whatsoever including, without limitation, damages for loss of use, 
                  data, or profits, arising out of or in any way connected with the use or performance of the Bali Yoga website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">10. Modifications to Terms</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  Bali Yoga reserves the right to change these terms and conditions at any time. Your continued use of the 
                  website following any changes shall constitute your acceptance of such changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">11. Termination</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  We may terminate or suspend your access to our service immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">12. Governing Law</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  These Terms shall be interpreted and governed by the laws of Indonesia. Any disputes arising from these 
                  terms or your use of the service shall be subject to the exclusive jurisdiction of the Indonesian courts.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-[#5d4c42] mb-4">13. Contact Information</h2>
                <p className="text-[#5d4c42]/80 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-[#f9f3e9] p-4 rounded-lg border border-[#e6ceb3]">
                  <p className="text-[#5d4c42]/80">
                    Email: legal@baliyoga.com<br />
                    Address: Ubud, Bali, Indonesia
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
            href="/contact"
            className="rounded-lg border-2 border-[#5d4c42] px-6 py-3 font-semibold text-[#5d4c42] text-center transition-colors hover:bg-[#5d4c42] hover:text-white"
          >
            Contact Us
          </a>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 