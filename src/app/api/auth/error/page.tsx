'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 space-y-2">
            <p className="text-center text-sm text-red-600">
              Error: {error || 'Unknown error'}
            </p>
            {errorDescription && (
              <p className="text-center text-sm text-gray-600">
                {errorDescription}
              </p>
            )}
            <p className="text-center text-sm text-gray-500 mt-4">
              Please check your environment variables and Google OAuth configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
} 