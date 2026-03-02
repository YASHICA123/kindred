import { NextRequest, NextResponse } from 'next/server'

interface CityData {
  city: string
  pincode: string
  label: string
}

/**
 * GET /api/cities-list
 * 
 * Fetches comprehensive list of Indian cities with postal codes
 * Uses open-source data from:
 * - Local database (fallback)
 * - OpenStreetMap/Nominatim API (free, no key needed)
 * - Public GitHub repository with Indian postal code data
 */
export async function GET(request: NextRequest) {
  try {
    const source = request.nextUrl.searchParams.get('source') || 'all'

    // Try fetching from public open-source API first
    let cities: CityData[] = []

    if (source === 'all' || source === 'openstreetmap') {
      cities = await fetchFromOpenStreetMap()
    }

    if (cities.length === 0 && (source === 'all' || source === 'github')) {
      cities = await fetchFromGitHub()
    }

    if (cities.length === 0) {
      cities = getLocalCities()
    }

    return NextResponse.json({
      success: true,
      source: cities.length > 0 ? 'api' : 'local',
      count: cities.length,
      data: cities,
    })
  } catch (error) {
    console.error('❌ Error fetching cities:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cities',
      },
      { status: 500 }
    )
  }
}

/**
 * Fetch Indian cities from free OpenStreetMap/Nominatim API
 * Completely free, no authentication needed
 * Rate limit: 1 request per second
 */
async function fetchFromOpenStreetMap(): Promise<CityData[]> {
  try {
    // Search for cities in India using Nominatim
    const response = await fetch(
      'https://nominatim.openstreetmap.org/search?country=in&city=*&format=json&limit=1000',
      {
        headers: {
          'User-Agent': 'Kindred-Schools-App/1.0 (+https://kindred-schools.vercel.app)',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`OpenStreetMap API error: ${response.status}`)
    }

    const data = await response.json()
    const citiesMap = new Map<string, string>()

    // Extract unique cities and postal codes
    for (const result of data) {
      const address = result.address
      const city = address.city || address.town || address.village
      const postcode = address.postcode

      if (city && !citiesMap.has(city)) {
        citiesMap.set(city, postcode || '000000')
      }
    }

    // Convert map to array
    const cities: CityData[] = Array.from(citiesMap.entries()).map(([city, pincode]) => ({
      city,
      pincode,
      label: `${city} (${pincode})`,
    }))

    return cities.sort((a, b) => a.city.localeCompare(b.city))
  } catch (error) {
    console.warn('⚠️ OpenStreetMap API failed, trying alternative source:', error)
    return []
  }
}

/**
 * Fetch Indian cities from public GitHub repository
 * Uses open-source Indian postal code database
 * Repository: https://github.com/saurabhdaware/indian-cities
 */
async function fetchFromGitHub(): Promise<CityData[]> {
  try {
    // Fetch from public GitHub repository with Indian postal codes
    const response = await fetch(
      'https://raw.githubusercontent.com/saurabhdaware/indian-cities/master/cities.json'
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const citiesData = await response.json()

    // Transform data to match our format
    const cities: CityData[] = citiesData
      .slice(0, 500) // Limit to first 500 cities for performance
      .map((city: any) => ({
        city: city.name || city.city,
        pincode: city.postalCode || city.postal_code || '000000',
        label: `${city.name || city.city} (${city.postalCode || city.postal_code || '000000'})`,
      }))

    return cities.sort((a, b) => a.city.localeCompare(b.city))
  } catch (error) {
    console.warn('⚠️ GitHub repository fetch failed:', error)
    return []
  }
}

/**
 * Fallback: Return local hardcoded cities list
 */
function getLocalCities(): CityData[] {
  const CITY_PINCODE_MAP: Record<string, string> = {
    "Delhi NCR": "110001",
    "Delhi": "110001",
    "Agra": "282001",
    "Ahmedabad": "380001",
    "Ajmer": "305001",
    "Aligarh": "202001",
    "Amaravati": "522020",
    "Amritsar": "143001",
    "Aurangabad": "431001",
    "Bareilly": "243001",
    "Belgaum": "590001",
    "Bengaluru": "560001",
    "Bhopal": "462001",
    "Bhubaneswar": "751001",
    "Bikaner": "334001",
    "Chandigarh": "160017",
    "Chennai": "600001",
    "Coimbatore": "641001",
    "Dehradun": "248001",
    "Dhanbad": "826001",
    "Durgapur": "713201",
    "Erode": "638001",
    "Faridabad": "121001",
    "Firozabad": "283203",
    "Ghaziabad": "201001",
    "Gorakhpur": "273001",
    "Gurgaon": "122001",
    "Guwahati": "781001",
    "Gwalior": "474001",
    "Hubli": "580020",
    "Hyderabad": "500001",
    "Indore": "452001",
    "Jabalpur": "482001",
    "Jaipur": "302001",
    "Jalandhar": "144001",
    "Jammu": "180001",
    "Jamshedpur": "831001",
    "Jodhpur": "342001",
    "Kalyan": "421301",
    "Kanpur": "208001",
    "Kochi": "682001",
    "Kolhapur": "416003",
    "Kolkata": "700001",
    "Kota": "324001",
    "Kurnool": "518001",
    "Lucknow": "226001",
    "Ludhiana": "141001",
    "Madurai": "625001",
    "Malda": "732101",
    "Meerut": "250001",
    "Moradabad": "244001",
    "Mumbai": "400001",
    "Mysore": "570001",
    "Nagpur": "440001",
    "Nanded": "431601",
    "Nashik": "422001",
    "Navi Mumbai": "400703",
    "Noida": "201301",
    "Patna": "800001",
    "Pune": "411001",
    "Prayagraj": "211001",
    "Raipur": "492001",
    "Rajkot": "360001",
    "Ranchi": "834001",
    "Rourkela": "769001",
    "Sagar": "470001",
    "Salem": "636001",
    "Sambalpur": "768001",
    "Sangli": "416416",
    "Thane": "400601",
    "Thiruvananthapuram": "695001",
    "Tiruchirappalli": "620001",
    "Trichy": "620001",
    "Tiruppur": "641601",
    "Udaipur": "313001",
    "Ujjain": "456001",
    "Vadodara": "390001",
    "Varanasi": "221001",
    "Vellore": "632001",
    "Vijayawada": "520001",
    "Visakhapatnam": "530001",
    "Warangal": "506002",
    "Yamunanagar": "135001",
  }

  return Object.entries(CITY_PINCODE_MAP)
    .map(([city, pincode]) => ({
      city,
      pincode,
      label: `${city} (${pincode})`,
    }))
    .sort((a, b) => a.city.localeCompare(b.city))
}
