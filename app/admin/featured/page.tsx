"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  Calendar,
  RotateCcw,
  Plus,
  Trash2,
  Settings,
  RefreshCw,
  Crown,
  TrendingUp,
  Clock
} from 'lucide-react'
import { FeaturedListing, WeeklyFeaturedRotation } from '@/lib/featured-utils'
import { formatDistanceToNow } from 'date-fns'

export default function FeaturedManagementPage() {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([])
  const [currentWeeklyFeatured, setCurrentWeeklyFeatured] = useState<any>(null)
  const [rotationHistory, setRotationHistory] = useState<WeeklyFeaturedRotation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      const [listingsRes, currentRes, historyRes] = await Promise.all([
        fetch('/api/featured?type=admin', {
          headers: { 'authorization': 'admin-token' }
        }),
        fetch('/api/featured'),
        fetch('/api/featured/history', {
          headers: { 'authorization': 'admin-token' }
        })
      ])

      const [listings, current, history] = await Promise.all([
        listingsRes.json(),
        currentRes.json(),
        historyRes.json()
      ])

      if (listings.success) setFeaturedListings(listings.listings)
      if (current.success) setCurrentWeeklyFeatured(current)
      if (history.success) setRotationHistory(history.history)

    } catch (error) {
      console.error('Error loading data:', error)
      setAlerts({
        type: 'error',
        message: 'Failed to load featured listings data'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const performAction = async (action: string, data: any = {}) => {
    try {
      setActionLoading(action)
      
      const response = await fetch('/api/featured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'admin-token'
        },
        body: JSON.stringify({ action, ...data })
      })

      const result = await response.json()
      
      if (result.success) {
        setAlerts({
          type: 'success',
          message: result.message
        })
        
        // Reload data after successful action
        await loadData()
      } else {
        setAlerts({
          type: 'error',
          message: result.message
        })
      }
    } catch (error) {
      console.error('Error performing action:', error)
      setAlerts({
        type: 'error',
        message: 'Action failed'
      })
    } finally {
      setActionLoading(null)
    }
  }

  const clearAlert = () => setAlerts(null)

  // Statistics
  const totalEligible = featuredListings.filter(l => l.is_eligible).length
  const totalStudios = featuredListings.filter(l => l.item_type === 'studio').length
  const totalRetreats = featuredListings.filter(l => l.item_type === 'retreat').length
  const currentlyFeatured = (currentWeeklyFeatured?.featured_studios?.length || 0) + 
                           (currentWeeklyFeatured?.featured_retreats?.length || 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#5d4c42]">Featured Listings Management</h1>
          <p className="text-[#5d4c42]/80 mt-1">
            Manage weekly featured rotation and eligible items
          </p>
        </div>
        <Button onClick={loadData} variant="outline" disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {alerts && (
        <Alert 
          className={`${alerts.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
          onClick={clearAlert}
        >
          {alerts.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={alerts.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alerts.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Currently Featured</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{currentlyFeatured}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Eligible Items</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{totalEligible}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Studios</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{totalStudios}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Retreats</p>
                <p className="text-2xl font-bold text-[#5d4c42]">{totalRetreats}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => performAction('auto_populate')}
              disabled={actionLoading === 'auto_populate'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {actionLoading === 'auto_populate' ? 'Adding Items...' : 'Auto-populate Pool'}
            </Button>
            
            <Button
              onClick={() => performAction('generate_rotation')}
              disabled={actionLoading === 'generate_rotation'}
              className="bg-green-600 hover:bg-green-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {actionLoading === 'generate_rotation' ? 'Generating...' : 'Generate This Week'}
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>Auto-populate Pool:</strong> Add high-rated items (4+ stars) to the featured pool</p>
            <p>• <strong>Generate This Week:</strong> Create a new weekly rotation for this week</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Current Week
          </TabsTrigger>
          <TabsTrigger value="pool" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Featured Pool ({featuredListings.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <CurrentWeekSection 
            currentWeeklyFeatured={currentWeeklyFeatured} 
            onAction={performAction}
            actionLoading={actionLoading}
          />
        </TabsContent>

        <TabsContent value="pool" className="space-y-4">
          <FeaturedPoolSection 
            featuredListings={featuredListings}
            onAction={performAction}
            actionLoading={actionLoading}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <HistorySection rotationHistory={rotationHistory} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Current Week Section Component
function CurrentWeekSection({ 
  currentWeeklyFeatured, 
  onAction, 
  actionLoading 
}: { 
  currentWeeklyFeatured: any
  onAction: (action: string, data?: any) => void
  actionLoading: string | null
}) {
  if (!currentWeeklyFeatured) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No featured items for this week</p>
          <Button 
            onClick={() => onAction('generate_rotation')}
            disabled={actionLoading === 'generate_rotation'}
          >
            Generate Weekly Rotation
          </Button>
        </CardContent>
      </Card>
    )
  }

  const allFeatured = [
    ...(currentWeeklyFeatured.studios_data || []).map((s: any) => ({ ...s, type: 'studio' })),
    ...(currentWeeklyFeatured.retreats_data || []).map((r: any) => ({ ...r, type: 'retreat' }))
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Week of {new Date(currentWeeklyFeatured.week_start).toLocaleDateString()}</span>
            <Button 
              onClick={() => onAction('generate_rotation')}
              disabled={actionLoading === 'generate_rotation'}
              size="sm"
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allFeatured.map((item: any) => (
              <Card key={item.id} className="border border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.location}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{item.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Featured Pool Section Component
function FeaturedPoolSection({ 
  featuredListings, 
  onAction, 
  actionLoading 
}: { 
  featuredListings: FeaturedListing[]
  onAction: (action: string, data?: any) => void
  actionLoading: string | null
}) {
  if (featuredListings.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No items in featured pool</p>
          <Button 
            onClick={() => onAction('auto_populate')}
            disabled={actionLoading === 'auto_populate'}
          >
            Auto-populate Pool
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {featuredListings.map((listing) => (
        <Card key={listing.id} className={listing.is_eligible ? '' : 'opacity-60'}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {listing.item_data.image && (
                  <img 
                    src={listing.item_data.image} 
                    alt={listing.item_data.name} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{listing.item_data.name}</h4>
                    <p className="text-sm text-gray-600">{listing.item_data.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">
                        {listing.item_type}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{listing.item_data.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Priority: {listing.priority}
                      </span>
                      <span className="text-sm text-gray-500">
                        Featured: {listing.featured_count}x
                      </span>
                    </div>
                    {listing.last_featured_at && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last featured: {formatDistanceToNow(new Date(listing.last_featured_at), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={listing.priority}
                      onChange={(e) => onAction('update_priority', {
                        id: listing.id,
                        priority: parseInt(e.target.value) || 0
                      })}
                      className="w-20"
                      placeholder="Priority"
                    />
                    
                    <Button
                      size="sm"
                      variant={listing.is_eligible ? "outline" : "default"}
                      onClick={() => onAction('toggle_eligibility', {
                        id: listing.id,
                        is_eligible: !listing.is_eligible
                      })}
                      disabled={actionLoading === 'toggle_eligibility'}
                    >
                      {listing.is_eligible ? 'Disable' : 'Enable'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onAction('remove_from_pool', { id: listing.id })}
                      disabled={actionLoading === 'remove_from_pool'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// History Section Component
function HistorySection({ rotationHistory }: { rotationHistory: WeeklyFeaturedRotation[] }) {
  if (rotationHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No rotation history available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {rotationHistory.map((rotation) => (
        <Card key={rotation.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              Week of {new Date(rotation.week_start_date).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Featured Studios ({rotation.featured_studios?.length || 0})
                </h4>
                <div className="space-y-1">
                  {(rotation.featured_studios || []).map((studioId, idx) => (
                    <div key={idx} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      Studio ID: {studioId}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Featured Retreats ({rotation.featured_retreats?.length || 0})
                </h4>
                <div className="space-y-1">
                  {(rotation.featured_retreats || []).map((retreatId, idx) => (
                    <div key={idx} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      Retreat ID: {retreatId}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Algorithm: {rotation.rotation_algorithm} | 
              Created: {formatDistanceToNow(new Date(rotation.created_at), { addSuffix: true })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}