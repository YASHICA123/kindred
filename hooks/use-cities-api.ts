import { useState, useEffect } from 'react'
import type { CityOption } from '@/lib/discover-options'

/**
 * Hook to fetch and cache cities from API with fallback
 * 
 * @param source - Data source preference: 'all' | 'openstreetmap' | 'github'
 * @returns Cities array, loading state, and error info
 * 
 * @example
 * const { cities, isLoading, error } = useCitiesFromAPI()
 * 
 * @example
 * // Force use of OpenStreetMap source:
 * const { cities } = useCitiesFromAPI('openstreetmap')
 */
export function useCitiesFromAPI(source: 'all' | 'openstreetmap' | 'github' = 'all') {
  const [cities, setCities] = useState<CityOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/cities-list?source=${source}`, {
          // Browser will cache responses automatically
          headers: {
            'Cache-Control': 'max-age=86400', // 24 hours
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch cities: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.success && data.data) {
          setCities(data.data)
          console.log(`✅ Loaded ${data.data.length} cities from ${data.source}`)
        } else {
          throw new Error('Invalid API response')
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMsg)
        console.warn('⚠️ Failed to fetch cities from API:', errorMsg)
        // Error will be handled by component - can fall back to local data
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
  }, [source])

  return { cities, isLoading, error }
}

/**
 * Example component using the API
 * 
 * @example
 * <CitySelector onSelect={(city) => console.log(city)} />
 */
export function CitySelector({ onSelect }: { onSelect: (city: CityOption) => void }) {
  const { cities, isLoading, error } = useCitiesFromAPI()

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading cities...</div>
  }

  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>
  }

  if (cities.length === 0) {
    return <div className="text-sm text-gray-500">No cities available</div>
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Select City</label>
      <select
        onChange={(e) => {
          const city = cities.find((c) => c.city === e.target.value)
          if (city) onSelect(city)
        }}
        className="w-full px-3 py-2 border rounded-md"
      >
        <option value="">Choose a city...</option>
        {cities.map((city) => (
          <option key={city.city} value={city.city}>
            {city.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500">{cities.length} cities available</p>
    </div>
  )
}
