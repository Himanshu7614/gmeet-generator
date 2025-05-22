import { createGoogleMeetLink } from '@/lib/googleApi'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { Session } from 'next-auth'

export async function POST(request: NextRequest) {
  try {
    // Check environment variables
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('API: Missing Google OAuth credentials:', {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET
      })
      return NextResponse.json(
        { error: 'Server configuration error - Missing Google credentials' },
        { status: 500 }
      )
    }

    console.log('API: Starting meeting creation...')
    const session = await getServerSession(authOptions) as Session & { accessToken?: string }
    
    console.log('API: Session data:', {
      hasSession: !!session,
      hasAccessToken: !!session?.accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not Set',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not Set'
    })

    if (!session) {
      console.log('API: No session found')
      return NextResponse.json(
        { error: 'No session found - Please sign in' },
        { status: 401 }
      )
    }

    if (!session.accessToken) {
      console.log('API: No access token found in session')
      return NextResponse.json(
        { error: 'No access token - Please sign in again' },
        { status: 401 }
      )
    }

    console.log('API: Session found, parsing request body...')
    const body = await request.json()
    const { title, startTime, duration, type } = body
    console.log('API: Request body:', { title, startTime, duration, type })

    console.log('API: Creating Google Meet link...')
    try {
      const result = await createGoogleMeetLink({
        title: title || (type === 'instant' ? 'Instant Meeting' : 'Scheduled Meeting'),
        startTime,
        duration: duration || 60,
        accessToken: session.accessToken
      })
      console.log('API: Google Meet link created successfully:', {
        hasMeetLink: !!result.meetLink,
        hasMeetId: !!result.meetId,
        hasEventId: !!result.eventId
      })

      return NextResponse.json({
        success: true,
        data: {
          meetLink: result.meetLink,
          meetId: result.meetId,
          eventId: result.eventId
        }
      })
    } catch (apiError) {
      console.error('API: Google API error:', apiError)
      if (apiError instanceof Error) {
        const errorMessage = apiError.message.toLowerCase()
        if (errorMessage.includes('authentication failed') || 
            errorMessage.includes('invalid access token') ||
            errorMessage.includes('invalid_grant')) {
          return NextResponse.json(
            { error: 'Authentication failed. Please sign in again.' },
            { status: 401 }
          )
        }
        if (errorMessage.includes('calendar access permission') || 
            errorMessage.includes('insufficient permission')) {
          return NextResponse.json(
            { error: 'Calendar access permission required. Please grant access.' },
            { status: 403 }
          )
        }
        if (errorMessage.includes('missing google oauth credentials')) {
          return NextResponse.json(
            { error: 'Server configuration error - Missing Google credentials' },
            { status: 500 }
          )
        }
        return NextResponse.json(
          { error: apiError.message },
          { status: 500 }
        )
      }
      throw apiError
    }
  } catch (error) {
    console.error('API: Meeting creation error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create meeting',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 