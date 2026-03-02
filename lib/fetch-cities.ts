import type { CityOption } from '@/lib/discover-options'

/**
 * Fetch cities from the API endpoint
 * Falls back to local data if API fails
 */
export async function fetchCitiesFromAPI(source: 'all' | 'openstreetmap' | 'github' = 'all'): Promise<CityOption[]> {
  try {
    const response = await fetch(`/api/cities-list?source=${source}`, {
      cache: 'force-cache', // Cache aggressively since cities data doesn't change often
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.warn('Failed to fetch cities from API:', error)
    // Return empty array - component will fall back to imported constant
    return []
  }
}

/**
 * Fetch cities with caching
 * Caches in memory to avoid repeated API calls in the same session
 */
let cachedCities: CityOption[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function fetchCitiesWithCache(
  source: 'all' | 'openstreetmap' | 'github' = 'all'
): Promise<CityOption[]> {
  const now = Date.now()

  // Return cached data if still valid
  if (cachedCities && now - cacheTimestamp < CACHE_DURATION) {
    return cachedCities
  }

  const cities = await fetchCitiesFromAPI(source)
  
  if (cities.length > 0) {
    cachedCities = cities
    cacheTimestamp = now
  }

  return cities
}
