"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Eye, EyeOff } from 'lucide-react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
const AUTH_KEY = 'bali-yoga-admin-auth'
const AUTH_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

interface AdminAuthProps {
  children: React.ReactNode
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored) {
        const { timestamp } = JSON.parse(stored)
        const now = Date.now()
        
        // Check if auth hasn't expired
        if (now - timestamp < AUTH_EXPIRY) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem(AUTH_KEY)
        }
      }
    } catch (error) {
      localStorage.removeItem(AUTH_KEY)
    }
    
    setIsLoading(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password === ADMIN_PASSWORD) {
      // Store auth with timestamp
      const authData = {
        timestamp: Date.now(),
        authenticated: true
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
      setIsAuthenticated(true)
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f3e9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4c42] mx-auto"></div>
          <p className="mt-2 text-[#5d4c42]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f9f3e9] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-[#5d4c42] rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-[#5d4c42]">Admin Access</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              
              <Button type="submit" className="w-full bg-[#5d4c42] hover:bg-[#a39188]">
                Access Dashboard
              </Button>
            </form>
            
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Security Note:</strong> Admin session expires after 24 hours for security.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      {/* Logout button for authenticated users */}
      <div className="bg-[#5d4c42] text-white px-4 py-2 text-sm">
        <div className="container mx-auto flex items-center justify-between">
          <span>🔒 Admin Mode Active</span>
          <button 
            onClick={handleLogout}
            className="text-white hover:text-gray-200 underline"
          >
            Logout
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}