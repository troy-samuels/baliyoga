import Link from "next/link"

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
                { href: "/wishlist", label: "My Wishlist" },
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
            <p className="text-sm text-white/80 mb-3">
              Follow us for the latest yoga updates and wellness tips from Bali.
            </p>
            <p className="text-sm text-white/80">
              Email:{" "}
              <a href="mailto:info@baliyoga.com" className="hover:text-white">
                info@baliyoga.com
              </a>
            </p>
            <p className="text-xs text-white/60 mt-2">
              Social media coming soon!
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
