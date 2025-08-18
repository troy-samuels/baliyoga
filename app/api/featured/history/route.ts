import { NextRequest, NextResponse } from 'next/server'
import { getWeeklyRotationsHistory } from '@/lib/featured-utils'

// GET /api/featured/history - Get weekly rotations history (admin only)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.includes('admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    const history = await getWeeklyRotationsHistory(limit)
    
    return NextResponse.json({
      success: true,
      history
    })

  } catch (error) {
    console.error('Error in GET /api/featured/history:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}