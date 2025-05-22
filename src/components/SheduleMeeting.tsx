'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Calendar, Clock, Loader2 } from 'lucide-react'
import { addMeeting, setError, setLoading } from '@/lib/store'

export default function ScheduledMeeting() {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
  })
  const [isCreating, setIsCreating] = useState(false)
  const dispatch = useDispatch()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const isFormValid = () => {
    const { title, date, time } = formData
    if (!title.trim() || !date || !time) return false
    
    const scheduledDateTime = new Date(`${date}T${time}`)
    return scheduledDateTime > new Date()
  }

  const createScheduledMeeting = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted', formData)
    
    if (!isFormValid()) {
      console.log('Form validation failed')
      dispatch(setError('Please fill all fields and ensure the meeting is scheduled for a future time'))
      return
    }

    setIsCreating(true)
    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      console.log('Creating meeting...')
      const startTime = new Date(`${formData.date}T${formData.time}`).toISOString()
      console.log('Start time:', startTime)

      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'scheduled',
          title: formData.title,
          startTime,
          duration: formData.duration,
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
        title: formData.title,
        meetLink: result.data.meetLink,
        meetId: result.data.meetId,
        createdAt: new Date().toISOString(),
        scheduledFor: startTime,
        duration: formData.duration,
        type: 'scheduled' as const,
      }

      dispatch(addMeeting(meeting))
      
      // Reset form
      setFormData({
        title: '',
        date: '',
        time: '',
        duration: 60,
      })
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to create meeting'))
    } finally {
      setIsCreating(false)
      dispatch(setLoading(false))
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const now = new Date().toTimeString().slice(0, 5)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center space-x-3 mb-4">
        <Calendar className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Schedule Meeting</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Schedule a Google Meet for a specific date and time
      </p>

      <form onSubmit={createScheduledMeeting} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter meeting title"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              min={today}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              min={formData.date === today ? now : undefined}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border text-black   border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isCreating || !isFormValid()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scheduling Meeting...</span>
            </>
          ) : (
            <>
              <Clock className="w-5 h-5" />
              <span>Schedule Meeting</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}