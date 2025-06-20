import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-[#5d4c42] px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">About Bali Yoga</h3>
            <p className="text-sm text-white/80">
              Connecting yogis with the best studios, retreats, and wellness experiences across the island of Bali.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/80 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-white/80 hover:text-white">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-white/80 hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-white/80 hover:text-white">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <p className="text-sm text-white/80 mb-4">
              Follow us for the latest yoga updates and wellness tips from Bali.
            </p>
            <p className="text-sm text-white/80">
              Email: <a href="mailto:info@baliyoga.com">info@baliyoga.com</a>
            </p>
            <p className="text-xs text-white/60 mt-2">
              Social media coming soon!
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Bali Yoga. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
