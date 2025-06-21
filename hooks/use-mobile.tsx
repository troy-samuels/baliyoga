import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        try {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        } catch (error) {
          console.warn('Error updating mobile state:', error)
        }
      }
      
      mql.addEventListener("change", onChange)
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      
      return () => {
        try {
          mql.removeEventListener("change", onChange)
        } catch (error) {
          console.warn('Error removing mobile listener:', error)
        }
      }
    } catch (error) {
      console.warn('Error setting up mobile detection:', error)
      // Fallback to false for mobile on error
      setIsMobile(false)
    }
  }, [])

  return !!isMobile
}
