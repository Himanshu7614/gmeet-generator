// src/app/page.tsx
'use client'

import { useEffect } from 'react'
import AuthButton from '@/components/AuthButton'
import { clearMeetings, RootState } from '../lib/store'
import { useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { Video } from 'lucide-react'
import ScheduledMeeting from '@/components/SheduleMeeting'
import MeetingDisplay from '@/components/MeetingDisplay'
import InstantMeeting from '@/components/InstantMeeting'

export default function Home() {
  const { data: session, status } = useSession()
  const { isLoading } = useSelector((state: RootState) => state.meetings)
  const dispatch = useDispatch()

  // Clear meetings when user logs out
  useEffect(() => {
    if (status === 'unauthenticated') {
      dispatch(clearMeetings())
    }
  }, [status, dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Video className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Google Meet Scheduler
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Create instant meetings or schedule them for later
          </p>
        </div>

        {/* Authentication Section */}
        <div className="mb-8">
          <AuthButton />
        </div>

        {/* Main Content */}
        {session && (
          <>
            {/* Loading Indicator */}
            {isLoading && (
              <div className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating meeting...</span>
              </div>
            )}

            {/* Meeting Creation Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <InstantMeeting />
              <ScheduledMeeting />
            </div>

            {/* Meeting Display Section */}
            <div className="mt-8">
              <MeetingDisplay />
            </div>
          </>
        )}
      </div>
    </div>
  )
}