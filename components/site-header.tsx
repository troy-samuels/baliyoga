import Link from "next/link"

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 bg-[#f9f3e9] px-4 py-4 shadow-sm md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="rounded-full bg-[#e6ceb3] px-6 py-2 text-xl font-bold text-[#5d4c42]">BALI YOGA</div>
        </Link>
        <div className="hidden items-center space-x-1 rounded-full bg-[#a39188] px-4 py-2 md:flex">
          <Link href="/studios" className="px-4 py-1 text-white hover:text-[#e6ceb3]">
            Studios
          </Link>
          <Link href="/retreats" className="px-4 py-1 text-white hover:text-[#e6ceb3]">
            Retreats
          </Link>
          <Link href="/blog" className="px-4 py-1 text-white hover:text-[#e6ceb3]">
            Blog
          </Link>
          <Link href="/contact" className="px-4 py-1 text-white hover:text-[#e6ceb3]">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
