import { google } from 'googleapis'

export interface CreateMeetingParams {
  title?: string
  startTime?: string
  duration?: number
  accessToken: string
}

export async function createGoogleMeetLink({
  title = 'Instant Meeting',
  startTime,
  duration = 60,
  accessToken
}: CreateMeetingParams) {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.error('Missing Google OAuth credentials:', {
        hasClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET
      })
      throw new Error('Missing Google OAuth credentials')
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NEXTAUTH_URL
    )
    
    oauth2Client.setCredentials({ 
      access_token: accessToken,
      scope: 'https://www.googleapis.com/auth/calendar'
    })

    // Verify the access token
    try {
      const tokenInfo = await oauth2Client.getTokenInfo(accessToken)

    } catch (tokenError) {
      console.error('Google API: Token validation failed:', tokenError)
      if (tokenError instanceof Error) {
        if (tokenError.message.includes('invalid_grant')) {
          throw new Error('Authentication failed. Please sign in again.')
        }
        if (tokenError.message.includes('invalid_token')) {
          throw new Error('Invalid access token. Please sign in again.')
        }
      }
      throw new Error('Token validation failed')
    }

    const calendar = google.calendar({ 
      version: 'v3', 
      auth: oauth2Client 
    })

    const start = startTime ? new Date(startTime) : new Date()
    const end = new Date(start.getTime() + duration * 60000)

    const event = {
      summary: title,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      attendees: [],
    }

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
      })


      const meetLink = response.data.conferenceData?.entryPoints?.find(
        entry => entry.entryPointType === 'video'
      )?.uri

      const meetId = response.data.conferenceData?.conferenceId

      if (!meetLink || !meetId) {
        console.error('Google API: Missing meet link or ID in response:', {
          hasMeetLink: !!meetLink,
          hasMeetId: !!meetId,
          responseData: response.data
        })
        throw new Error('Failed to create Google Meet link')
      }

      return {
        meetLink,
        meetId,
        eventId: response.data.id
      }
    } catch (calendarError) {
      console.error('Google API: Calendar error:', calendarError)
      if (calendarError instanceof Error) {
        if (calendarError.message.includes('insufficient permission')) {
          throw new Error('Calendar access permission required. Please grant access.')
        }
        if (calendarError.message.includes('invalid_grant')) {
          throw new Error('Authentication failed. Please sign in again.')
        }
      }
      throw new Error('Failed to create calendar event')
    }
  } catch (error) {
    console.error('Google API: Detailed error:', error)
    if (error instanceof Error) {
      console.error('Google API: Error message:', error.message)
      console.error('Google API: Error stack:', error.stack)
      throw error
    }
    throw new Error('Failed to create meeting. Please try again.')
  }
}