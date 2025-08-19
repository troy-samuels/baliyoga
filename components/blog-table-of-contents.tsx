"use client"

import { useEffect, useState } from "react"
import { ChevronRight } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface BlogTableOfContentsProps {
  content: string
}

export function BlogTableOfContents({ content }: BlogTableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Parse headings from content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headingElements = doc.querySelectorAll('h2, h3')
    
    const items: TOCItem[] = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`
      heading.id = id
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1])
      }
    })
    
    setHeadings(items)
  }, [content])

  useEffect(() => {
    // Track scroll position for active heading
    const handleScroll = () => {
      const headingElements = headings.map(({ id }) => 
        document.getElementById(id)
      ).filter(Boolean)

      const visibleHeadings = headingElements.filter((el) => {
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top >= 0 && rect.top <= window.innerHeight / 2
      })

      if (visibleHeadings[0]) {
        setActiveId(visibleHeadings[0].id)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  if (headings.length < 3) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <aside className="sticky top-24 hidden lg:block">
      <nav className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-semibold text-[#5d4c42]">Table of Contents</h3>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={`flex items-center text-left text-sm transition-colors ${
                  activeId === heading.id
                    ? 'text-[#a39188] font-medium'
                    : 'text-[#5d4c42]/70 hover:text-[#5d4c42]'
                }`}
              >
                {activeId === heading.id && (
                  <ChevronRight className="mr-1 h-3 w-3" />
                )}
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}