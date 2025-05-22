'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Copy, ExternalLink, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { RootState } from '@/lib/store'
import { Meeting } from '@/lib/store'

export default function MeetingDisplay() {
  const { meetings, error } = useSelector((state: RootState) => state.meetings)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, meetingId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(meetingId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeUntilMeeting = (scheduledFor: string) => {
    const now = new Date().getTime()
    const meetingTime = new Date(scheduledFor).getTime()
    const diff = meetingTime - now

    if (diff <= 0) return 'Meeting time has passed'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
        <div>
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings created yet</h3>
        <p className="text-gray-600">Create an instant meeting or schedule one for later</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
        <Calendar className="w-6 h-6" />
        <span>Your Meetings</span>
      </h3>

      {meetings.map((meeting: Meeting) => (
        <div key={meeting.id} className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{meeting.title}</h4>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  meeting.type === 'instant' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {meeting.type === 'instant' ? 'Instant' : 'Scheduled'}
                </span>
                <span>Created: {formatDateTime(meeting.createdAt)}</span>
              </div>
            </div>
          </div>

          {meeting.scheduledFor && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Scheduled for:</span>
              </div>
              <p className="text-yellow-700 mt-1">{formatDateTime(meeting.scheduledFor)}</p>
              <p className="text-yellow-600 text-sm mt-1">
                Time until meeting: {getTimeUntilMeeting(meeting.scheduledFor)}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting ID
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-gray-100 text-black border rounded-lg text-sm font-mono">
                  {meeting.meetId}
                </code>
                <button
                  onClick={() => copyToClipboard(meeting.meetId, `${meeting.id}-id`)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedId === `${meeting.id}-id` ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Link
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={meeting.meetLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-100 text-black border rounded-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(meeting.meetLink, `${meeting.id}-link`)}
                  className="p-2 text-black hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copiedId === `${meeting.id}-link` ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={meeting.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-black hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {meeting.duration && (
            <div className="mt-4 text-sm text-gray-600">
              Duration: {meeting.duration} minutes
            </div>
          )}
        </div>
      ))}
    </div>
  )
}