"use client"

import { useEffect } from 'react'
import { initializeSecurity } from '@/lib/security-utils'

export function SecurityInitializer() {
  useEffect(() => {
    // Initialize security utilities on app load
    initializeSecurity()
  }, [])

  // This component doesn't render anything
  return null
} 