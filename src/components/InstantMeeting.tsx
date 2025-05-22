'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Video, Loader2 } from 'lucide-react'
import { addMeeting, setError, setLoading } from '@/lib/store'

export default function InstantMeeting() {
  const [isCreating, setIsCreating] = useState(false)
  const dispatch = useDispatch()

  const createInstantMeeting = async () => {
    setIsCreating(true)
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      console.log('Creating instant meeting...')
       "use server"
      const response = await fetch('/api/meetings', {
       
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'instant',
          title: 'Instant Meeting',
        }),
      })
      console.log('API Response:', response.status)

      const result = await response.json()
      console.log('API Result:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create meeting')
      }

      const meeting = {
        id: Date.now().toString(),
        title: 'Instant Meeting',
        meetLink: result.data.meetLink,
        meetId: result.data.meetId,
        createdAt: new Date().toISOString(),
        type: 'instant' as const,
      }

      dispatch(addMeeting(meeting))
    } catch (error) {
      console.error('Error creating meeting:', error)
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create meeting'))
    } finally {
      setIsCreating(false)
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center space-x-3 mb-4">
        <Video className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Instant Meeting</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Create a Google Meet link instantly for immediate use
      </p>
      
      <button
        onClick={createInstantMeeting}
        disabled={isCreating}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isCreating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Creating Meeting...</span>
          </>
        ) : (
          <>
            <Video className="w-5 h-5" />
            <span>Create Instant Meeting</span>
          </>
        )}
      </button>
    </div>
  )
} 