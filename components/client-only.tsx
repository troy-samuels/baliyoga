"use client"

import { useState, useEffect } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * ClientOnly component ensures hydration-safe rendering by only rendering 
 * children after the component has mounted on the client side.
 * This prevents hydration mismatches between server and client rendering.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}