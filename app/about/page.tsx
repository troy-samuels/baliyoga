import { MobileOptimizedHeader } from "@/components/mobile-optimized-header"
import { MobileOptimizedFooter } from "@/components/mobile-optimized-footer"
import { Heart, Users, MapPin, Award, Target, Eye } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f9f3e9]">
      <MobileOptimizedHeader />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-20 md:py-32"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/placeholder.svg?height=600&width=1200&text=About+Bali+Yoga')"
        }}
      >
        <div className="mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">About Bali Yoga</h1>
          <p className="mt-4 text-lg md:text-xl opacity-90">
            Connecting souls with authentic yoga experiences across the Island of the Gods
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#5d4c42] mb-6">Our Story</h2>
            <div className="space-y-4 text-[#5d4c42]/80 leading-relaxed">
              <p>
                Bali Yoga was born from a simple yet profound realization: finding authentic yoga experiences 
                in Bali shouldn't be overwhelming or confusing. As yoga practitioners ourselves, we experienced 
                firsthand the challenge of discovering genuine studios and retreats that truly embody the spirit 
                of yoga.
              </p>
              <p>
                Founded in 2023, we set out to create a comprehensive platform that connects yoga enthusiasts 
                with the most authentic and transformative experiences across Bali. From the spiritual heart of 
                Ubud to the vibrant beaches of Canggu, we've personally visited and curated every studio and 
                retreat on our platform.
              </p>
              <p>
                Our mission goes beyond just listing yoga studios. We're building a community that celebrates 
                the ancient wisdom of yoga while embracing the unique spiritual energy that makes Bali so special. 
                Every recommendation comes from our heart, ensuring that your yoga journey in Bali is nothing 
                short of extraordinary.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#e6ceb3] p-8">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-[#5d4c42]">150+</div>
                <div className="text-sm text-[#5d4c42]/80">Verified Studios</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5d4c42]">50+</div>
                <div className="text-sm text-[#5d4c42]/80">Retreat Centers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5d4c42]">10K+</div>
                <div className="text-sm text-[#5d4c42]/80">Happy Yogis</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#5d4c42]">25+</div>
                <div className="text-sm text-[#5d4c42]/80">Yoga Styles</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="rounded-2xl bg-[#f9f3e9] p-8 border border-[#e6ceb3]">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-full bg-[#5d4c42] p-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#5d4c42]">Our Mission</h2>
              </div>
              <p className="text-[#5d4c42]/80 leading-relaxed">
                To make authentic yoga experiences in Bali accessible to everyone by connecting practitioners 
                with verified, high-quality studios and retreats. We believe that yoga is a transformative 
                practice that should be available to all, regardless of experience level or background.
              </p>
            </div>

            <div className="rounded-2xl bg-[#f9f3e9] p-8 border border-[#e6ceb3]">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-full bg-[#5d4c42] p-3">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-[#5d4c42]">Our Vision</h2>
              </div>
              <p className="text-[#5d4c42]/80 leading-relaxed">
                To become the most trusted platform for yoga experiences in Bali, fostering a global community 
                of practitioners who find healing, growth, and connection through authentic yoga practices in 
                one of the world's most spiritual destinations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-[#5d4c42] text-center mb-12">Our Values</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto mb-4 rounded-full bg-[#e6ceb3] p-4 w-16 h-16 flex items-center justify-center">
              <Heart className="h-8 w-8 text-[#5d4c42]" />
            </div>
            <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Authenticity</h3>
            <p className="text-sm text-[#5d4c42]/80">
              We only feature genuine yoga experiences that honor traditional practices and values.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 rounded-full bg-[#e6ceb3] p-4 w-16 h-16 flex items-center justify-center">
              <Users className="h-8 w-8 text-[#5d4c42]" />
            </div>
            <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Community</h3>
            <p className="text-sm text-[#5d4c42]/80">
              Building connections between practitioners, teachers, and studios across Bali.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 rounded-full bg-[#e6ceb3] p-4 w-16 h-16 flex items-center justify-center">
              <Award className="h-8 w-8 text-[#5d4c42]" />
            </div>
            <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Quality</h3>
            <p className="text-sm text-[#5d4c42]/80">
              Every studio and retreat is personally verified to meet our high standards.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 rounded-full bg-[#e6ceb3] p-4 w-16 h-16 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-[#5d4c42]" />
            </div>
            <h3 className="text-lg font-semibold text-[#5d4c42] mb-2">Local Impact</h3>
            <p className="text-sm text-[#5d4c42]/80">
              Supporting local Balinese communities and sustainable tourism practices.
            </p>
          </div>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="bg-[#e6ceb3] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl font-bold text-[#5d4c42] text-center mb-12">What Makes Us Different</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#5d4c42] mb-4">Personal Curation</h3>
              <p className="text-[#5d4c42]/80">
                Every studio and retreat is personally visited and evaluated by our team. We don't just list 
                places – we experience them ourselves to ensure they meet our standards for authenticity and quality.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#5d4c42] mb-4">Local Expertise</h3>
              <p className="text-[#5d4c42]/80">
                Our team lives and breathes Bali. We understand the local culture, speak the language, and have 
                deep relationships with the yoga community across the island.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#5d4c42] mb-4">Holistic Approach</h3>
              <p className="text-[#5d4c42]/80">
                We consider not just the yoga classes, but the entire experience – from the energy of the space 
                to the qualifications of teachers and the impact on local communities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-[#5d4c42] mb-6">Ready to Begin Your Journey?</h2>
        <p className="text-lg text-[#5d4c42]/80 mb-8">
          Discover authentic yoga experiences that will transform your practice and connect you with the 
          spiritual heart of Bali.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/studios"
            className="rounded-lg bg-[#5d4c42] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#a39188]"
          >
            Explore Studios
          </a>
          <a
            href="/retreats"
            className="rounded-lg border-2 border-[#5d4c42] px-8 py-3 font-semibold text-[#5d4c42] transition-colors hover:bg-[#5d4c42] hover:text-white"
          >
            Find Retreats
          </a>
        </div>
      </div>

      <MobileOptimizedFooter />
    </div>
  )
} 