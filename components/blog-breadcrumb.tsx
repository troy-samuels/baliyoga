import Link from "next/link"
import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BlogBreadcrumbProps {
  items: BreadcrumbItem[]
}

export function BlogBreadcrumb({ items }: BlogBreadcrumbProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://baliyoga.com${item.href}` : undefined,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-[#5d4c42]/70">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="mx-2 h-4 w-4" />}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-[#a39188] transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#5d4c42] font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}