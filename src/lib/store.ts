// src/lib/store.ts
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Meeting {
  id: string
  title?: string
  meetLink: string
  meetId: string
  createdAt: string
  scheduledFor?: string
  duration?: number
  type: 'instant' | 'scheduled'
}

interface MeetingState {
  meetings: Meeting[]
  isLoading: boolean
  error: string | null
}

const initialState: MeetingState = {
  meetings: [],
  isLoading: false,
  error: null,
}

const meetingSlice = createSlice({
  name: 'meetings',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    addMeeting: (state, action: PayloadAction<Meeting>) => {
      state.meetings.unshift(action.payload)
    },
    clearMeetings: (state) => {
      state.meetings = []
    },
  },
})

export const { setLoading, setError, addMeeting, clearMeetings } = meetingSlice.actions

export const store = configureStore({
  reducer: {
    meetings: meetingSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch