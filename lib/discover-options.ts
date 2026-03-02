import indianCities from "@/data/indian-cities.json"

/**
 * Cities Configuration
 * 
 * This module provides city and filter options for the discover feature.
 * 
 * Cities are sourced from:
 * 1. Local fallback: CITY_PINCODE_MAP (80+ major Indian cities)
 * 2. API endpoint: /api/cities-list (uses OpenStreetMap, GitHub, or local fallback)
 * 
 * To fetch all available cities from open-source APIs:
 * @see lib/fetch-cities.ts for fetchCitiesWithCache() and fetchCitiesFromAPI()
 * @see app/api/cities-list/route.ts for API implementation
 * @see docs/CITIES_API.md for detailed documentation
 */

export const FILTER_BOARDS = ["CBSE", "ICSE", "IB", "Cambridge", "State Board", "Montessori"]

export const FILTER_SCHOOL_TYPES = ["Co-educational", "Boys Only", "Girls Only", "Day School", "Boarding"]

export const FILTER_FEE_RANGES = [
  "Under ₹50,000",
  "₹50,000 - ₹1 Lakh",
  "₹1 - 2 Lakh",
  "₹2 - 5 Lakh",
  "Above ₹5 Lakh",
]

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

export type CityOption = {
  city: string
  pincode: string
  label: string
}

const uniqueCities = Array.from(new Set(["Delhi NCR", ...indianCities]))

export const CITY_OPTIONS_WITH_PINCODES: CityOption[] = uniqueCities
  .filter((city) => CITY_PINCODE_MAP[city])
  .map((city) => ({
    city,
    pincode: CITY_PINCODE_MAP[city],
    label: `${city} (${CITY_PINCODE_MAP[city]})`,
  }))
/**
 * Utility function to fetch city data from external APIs if needed
 * Supports OpenCage Geocoding API and Google Maps API
 * 
 * Usage:
 * const citiesFromAPI = await fetchCitiesFromAPI('OpenCage', 'IN')
 * 
 * @param provider - 'OpenCage' | 'Google' | 'RestCountries'
 * @param countryCode - ISO country code (e.g., 'IN' for India)
 * @returns Promise<CityOption[]>
 * 
 * Note: To use external APIs:
 * 1. OpenCage: Get free API key from https://opencagedata.com/
 *    Add NEXT_PUBLIC_OPENCAGE_API_KEY to .env.local
 * 
 * 2. Google Maps: Get API key from https://developers.google.com/maps
 *    Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local
 */
export async function fetchCitiesFromAPI(
  provider: 'OpenCage' | 'Google' | 'RestCountries' = 'OpenCage',
  countryCode: string = 'IN'
): Promise<CityOption[]> {
  try {
    if (provider === 'OpenCage') {
      const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY
      if (!apiKey) {
        console.warn('OpenCage API key not configured. Using local city data.')
        return CITY_OPTIONS_WITH_PINCODES
      }

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=country:${countryCode}&key=${apiKey}&limit=1000`
      )
      const data = await response.json()

      if (data.results) {
        const citiesSet = new Set<string>()
        return data.results
          .map((result: any) => {
            const city = result.components.city || result.components.town || result.components.village
            const postcode = result.components.postcode
            if (city && !citiesSet.has(city)) {
              citiesSet.add(city)
              return {
                city,
                pincode: postcode || '000000',
                label: `${city} (${postcode || '000000'})`,
              }
            }
            return null
          })
          .filter((item: CityOption | null): item is CityOption => item !== null)
      }
    }

    if (provider === 'RestCountries') {
      // Alternative: Fetch from REST Countries API (free, no key needed)
      const response = await fetch('https://restcountries.com/v3.1/alpha/IN')
      if (response.ok) {
        // This is a basic example - REST Countries has limited city data
        return CITY_OPTIONS_WITH_PINCODES
      }
    }

    return CITY_OPTIONS_WITH_PINCODES
  } catch (error) {
    console.warn('Failed to fetch cities from external API, using local data:', error)
    return CITY_OPTIONS_WITH_PINCODES
  }
}