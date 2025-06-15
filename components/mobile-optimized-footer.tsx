import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function MobileOptimizedFooter() {
  return (
    <footer className="bg-[#5d4c42] px-4 py-6 text-white sm:py-8 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">About Bali Yoga</h3>
            <p className="text-sm text-white/80">
              Connecting yogis with the best studios, retreats, and wellness experiences across the island of Bali.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/become-a-partner", label: "Become a Partner" },
                { href: "/blog", label: "Blog" },
                { href: "/faq", label: "FAQ" },
                { href: "/admin", label: "Admin" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/terms", label: "Terms of Service" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/cookies", label: "Cookie Policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Connect With Us</h3>
            <div className="flex space-x-3 sm:space-x-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "YouTube" },
              ].map(({ icon: Icon, label }) => (
                <Link key={label} href="#" className="text-white/80 hover:text-white">
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{label}</span>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-sm text-white/80 sm:mt-4">
              Email:{" "}
              <a href="mailto:info@baliyoga.com" className="hover:text-white">
                info@baliyoga.com
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-white/20 pt-6 text-center text-sm text-white/60 sm:mt-8 sm:pt-8">
          <p>&copy; {new Date().getFullYear()} Bali Yoga. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
