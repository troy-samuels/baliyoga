import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Start with false to ensure consistent server/client rendering
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    // Mark as hydrated first
    setIsHydrated(true)
    
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
      setIsMobile(false)
    }
  }, [])

  // Return false during SSR and before hydration to prevent mismatch
  return isHydrated ? isMobile : false
}
