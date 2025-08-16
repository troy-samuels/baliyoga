"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Eye, 
  Heart, 
  TrendingUp, 
  Users, 
  Calendar,
  RefreshCw,
  Download,
  Trash2,
  BarChart3,
  Activity
} from 'lucide-react'
import { getAnalyticsSummary, clearAnalyticsData, getAnalyticsData } from '@/lib/analytics-utils'
import { getPopularityScores } from '@/lib/popularity-utils'

interface AnalyticsSummary {
  pageViews: {
    total: number
    last24h: number
    last7d: number
    last30d: number
    popular: Array<{ path: string; views: number }>
  }
  wishlist: {
    totalActions: number
    adds24h: number
    adds7d: number
    adds30d: number
    popularItems: Array<{ item: string; adds: number }>
  }
  lastUpdated: string
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [popularityScores, setPopularityScores] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<string>('')

  const loadAnalytics = () => {
    setIsLoading(true)
    try {
      const summary = getAnalyticsSummary()
      const scores = getPopularityScores()
      setAnalytics(summary)
      setPopularityScores(scores)
      setLastRefresh(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData()
      loadAnalytics()
    }
  }

  const handleExportData = () => {
    try {
      const data = getAnalyticsData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bali-yoga-analytics-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (!analytics) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#5d4c42]">Analytics Dashboard</h1>
          <p className="text-[#5d4c42]/70">
            Track page views, wishlist activity, and popularity scores
          </p>
          {lastRefresh && (
            <p className="text-sm text-[#5d4c42]/50 mt-1">
              Last updated: {lastRefresh}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={loadAnalytics} 
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleClearData} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pageViews.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.pageViews.last24h} in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist Actions</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.wishlist.totalActions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.wishlist.adds24h} adds in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pageViews.last7d.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Page views this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Popular Items</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(popularityScores).length}</div>
            <p className="text-xs text-muted-foreground">
              Items with popularity scores
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="page-views" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="page-views">Page Views</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist Activity</TabsTrigger>
          <TabsTrigger value="popularity">Popularity Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="page-views" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Page Views Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Page Views Summary</CardTitle>
                <CardDescription>Views across different time periods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last 24 hours</span>
                  <Badge variant="secondary">{analytics.pageViews.last24h}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last 7 days</span>
                  <Badge variant="secondary">{analytics.pageViews.last7d}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last 30 days</span>
                  <Badge variant="secondary">{analytics.pageViews.last30d}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total</span>
                  <Badge>{analytics.pageViews.total}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Most Popular Pages */}
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Pages</CardTitle>
                <CardDescription>Top 10 visited pages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.pageViews.popular.slice(0, 10).map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {index + 1}. {page.path}
                        </span>
                      </div>
                      <Badge variant="outline">{page.views}</Badge>
                    </div>
                  ))}
                  {analytics.pageViews.popular.length === 0 && (
                    <p className="text-sm text-gray-500">No page views recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wishlist Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Wishlist Activity</CardTitle>
                <CardDescription>Adds and removes across time periods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adds last 24 hours</span>
                  <Badge variant="secondary">{analytics.wishlist.adds24h}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adds last 7 days</span>
                  <Badge variant="secondary">{analytics.wishlist.adds7d}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Adds last 30 days</span>
                  <Badge variant="secondary">{analytics.wishlist.adds30d}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total actions</span>
                  <Badge>{analytics.wishlist.totalActions}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Most Wishlisted Items */}
            <Card>
              <CardHeader>
                <CardTitle>Most Wishlisted Items</CardTitle>
                <CardDescription>Top 10 items added to wishlists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.wishlist.popularItems.slice(0, 10).map((item, index) => (
                    <div key={item.item} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {index + 1}. {item.item}
                        </span>
                      </div>
                      <Badge variant="outline">{item.adds}</Badge>
                    </div>
                  ))}
                  {analytics.wishlist.popularItems.length === 0 && (
                    <p className="text-sm text-gray-500">No wishlist activity recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="popularity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popularity Scores</CardTitle>
              <CardDescription>
                Internal ranking scores used for search and recommendations (hidden from users)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(popularityScores)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 20)
                  .map(([itemId, score]) => (
                    <div key={itemId} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {itemId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={score >= 10 ? "default" : score >= 5 ? "secondary" : "outline"}
                        >
                          {score}
                        </Badge>
                        {score >= 20 && <span className="text-xs">🔥</span>}
                        {score >= 10 && score < 20 && <span className="text-xs">📈</span>}
                        {score >= 5 && score < 10 && <span className="text-xs">⭐</span>}
                      </div>
                    </div>
                  ))}
                {Object.keys(popularityScores).length === 0 && (
                  <p className="text-sm text-gray-500">No popularity scores recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Data Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Analytics data is stored locally in the browser</p>
            <p>• Data collection excludes development mode and admin pages</p>
            <p>• Popularity scores are hidden from users but influence search rankings</p>
            <p>• Data is automatically trimmed to prevent storage bloat (max 10,000 items)</p>
            <p>• Last data update: {formatDate(analytics.lastUpdated)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}