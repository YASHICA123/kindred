'use client'

import { useEffect, useState } from 'react'

export default function ImageTestPage() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  const imageUrl = 'https://enchwrptwtctikbhrpsg.supabase.co/storage/v1/object/public/school-images/The_Doon_School.jpg'

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Image Loading Test</h1>

      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Image URL:</h2>
        <code className="block bg-gray-100 p-4 rounded text-sm break-all mb-4">
          {imageUrl}
        </code>

        <h2 className="text-xl font-semibold mb-4">Test 1: Direct Image Tag</h2>
        <div className="border-2 border-gray-300 rounded p-4 bg-gray-50">
          <img
            src={imageUrl}
            alt="Test image"
            onLoad={() => {
              console.log('✅ Image loaded successfully!')
              setImageLoaded(true)
            }}
            onError={(e) => {
              const err = `Failed to load: ${e.type}`
              console.error('❌ Image failed to load:', err)
              setImageError(err)
            }}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="mt-4">
          {imageLoaded && (
            <p className="text-green-600 font-semibold">✅ Image loaded successfully!</p>
          )}
          {imageError && (
            <p className="text-red-600 font-semibold">❌ {imageError}</p>
          )}
          {!imageLoaded && !imageError && (
            <p className="text-blue-600 font-semibold">⏳ Loading...</p>
          )}
        </div>

        <h2 className="text-xl font-semibold mt-6 mb-4">Test 2: Fetch Test</h2>
        <div className="bg-gray-100 p-4 rounded">
          <button
            onClick={async () => {
              try {
                const r = await fetch(imageUrl)
                alert(`Status: ${r.status} - Content-Type: ${r.headers.get('content-type')}`)
              } catch (e) {
                alert(`Fetch failed: ${e}`)
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Fetch
          </button>
        </div>
      </div>
    </div>
  )
}
