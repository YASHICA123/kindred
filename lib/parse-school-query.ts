/**
 * Parse School Query Helper
 * 
 * Extracts state, city, board, type, fees, and sort intent from natural language queries.
 * 
 * Examples:
 * - "best schools in Delhi" → { stateSlug: "delhi", sort: "rating_desc" }
 * - "best IB schools in Gurgaon" → { stateSlug: "haryana", citySlug: "gurgaon", board: "IB", sort: "rating_desc" }
 * - "top CBSE schools in Noida under 2 lakh" → { citySlug: "noida", board: "CBSE", feesMax: 200000 }
 * - "cheap schools in Mumbai" → { stateSlug: "maharashtra", citySlug: "mumbai", sort: "fees_asc" }
 */

export interface ParsedSchoolQuery {
  stateSlug?: string
  citySlug?: string
  board?: string
  type?: string
  feesMin?: number
  feesMax?: number
  sort?: "rating_desc" | "fees_asc" | "name_asc"
  keyword?: string // Any other keywords in the query
}

export interface SchoolQueryDictionaries {
  states: Array<{ name: string; slug: string }>
  cities: Array<{ name: string; slug: string; state_slug?: string }>
  boards: string[]
  types: string[]
}

/**
 * Parse natural language school query
 */
export function parseSchoolQuery(
  query: string,
  dictionaries: SchoolQueryDictionaries
): ParsedSchoolQuery {
  const result: ParsedSchoolQuery = {}
  const lowerQuery = query.toLowerCase()

  // Extract sort intent keywords
  const bestKeywords = ["best", "top", "premium", "excellent", "leading"]
  const cheapKeywords = ["cheap", "affordable", "budget", "low fees", "under", "inexpensive"]

  if (bestKeywords.some((kw) => lowerQuery.includes(kw))) {
    result.sort = "rating_desc"
  } else if (cheapKeywords.some((kw) => lowerQuery.includes(kw))) {
    result.sort = "fees_asc"
  }

  // Extract board/curriculum keywords
  const boardKeywords = ["cbse", "icse", "ib", "cambridge", "state board", "montessori", "igcse"]
  for (const board of boardKeywords) {
    if (lowerQuery.includes(board)) {
      result.board = board
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
      break
    }
  }

  // Extract school type keywords
  const typeKeywords = ["day school", "boarding", "co-ed", "co-educational", "boys only", "girls only"]
  for (const type of typeKeywords) {
    if (lowerQuery.includes(type)) {
      result.type =
        type === "co-ed"
          ? "Co-educational"
          : type
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
      break
    }
  }

  // Extract fees range intent
  const feesPatterns = [
    { pattern: /under\s*₹?\s*(\d+(?:,\d+)?)\s*(k|lakh|lac)/i, factor: (match: string) => (match.includes("k") ? 1000 : 100000) },
    { pattern: /(\d+(?:,\d+)?)\s*-\s*(\d+(?:,\d+)?)\s*(k|lakh|lac)/i, factor: (match: string) => (match.includes("k") ? 1000 : 100000) },
    { pattern: /above\s*₹?\s*(\d+(?:,\d+)?)\s*(k|lakh|lac)/i, factor: (match: string) => (match.includes("k") ? 1000 : 100000) },
  ]

  // Check "under X" pattern
  const underMatch = lowerQuery.match(/under\s*₹?\s*(\d+(?:,\d+)?)\s*(k|lakh|lac)?/i)
  if (underMatch) {
    const amount = parseInt(underMatch[1].replace(/,/g, ""))
    const unit = underMatch[2]?.toLowerCase() || "lakh"
    result.feesMax = unit === "k" ? amount * 1000 : amount * 100000
  }

  // Check "X to Y" pattern
  const rangeMatch = lowerQuery.match(/(\d+(?:,\d+)?)\s*-\s*(\d+(?:,\d+)?)\s*(k|lakh|lac)?/i)
  if (rangeMatch) {
    const min = parseInt(rangeMatch[1].replace(/,/g, ""))
    const max = parseInt(rangeMatch[2].replace(/,/g, ""))
    const unit = rangeMatch[3]?.toLowerCase() || "lakh"
    const factor = unit === "k" ? 1000 : 100000
    result.feesMin = min * factor
    result.feesMax = max * factor
  }

  // Check "above X" pattern
  const aboveMatch = lowerQuery.match(/above\s*₹?\s*(\d+(?:,\d+)?)\s*(k|lakh|lac)?/i)
  if (aboveMatch) {
    const amount = parseInt(aboveMatch[1].replace(/,/g, ""))
    const unit = aboveMatch[2]?.toLowerCase() || "lakh"
    result.feesMin = unit === "k" ? amount * 1000 : amount * 100000
  }

  // Extract state
  for (const state of dictionaries.states) {
    if (lowerQuery.includes(state.name.toLowerCase())) {
      result.stateSlug = state.slug
      break
    }
  }

  // Extract city (prioritize cities from selected state if available)
  for (const city of dictionaries.cities) {
    if (lowerQuery.includes(city.name.toLowerCase())) {
      // If we found a state, only match cities in that state
      if (result.stateSlug && city.state_slug && city.state_slug !== result.stateSlug) {
        continue
      }
      result.citySlug = city.slug
      // If city has state info and we didn't find state yet, use it
      if (!result.stateSlug && city.state_slug) {
        result.stateSlug = city.state_slug
      }
      break
    }
  }

  // Extract generic keywords (for future use)
  const keywords = query
    .split(/[\s,]+/)
    .filter((word) => word.length > 2 && !["and", "the", "for"].includes(word.toLowerCase()))
    .join(" ")
  if (keywords) {
    result.keyword = keywords
  }

  return result
}

/**
 * Build query string from parsed parameters (for API calls or logging)
 */
export function buildQueryString(parsed: ParsedSchoolQuery): string {
  const parts: string[] = []

  if (parsed.stateSlug) parts.push(`state:${parsed.stateSlug}`)
  if (parsed.citySlug) parts.push(`city:${parsed.citySlug}`)
  if (parsed.board) parts.push(`board:${parsed.board}`)
  if (parsed.type) parts.push(`type:${parsed.type}`)
  if (parsed.feesMin) parts.push(`feesMin:${parsed.feesMin}`)
  if (parsed.feesMax) parts.push(`feesMax:${parsed.feesMax}`)
  if (parsed.sort) parts.push(`sort:${parsed.sort}`)
  if (parsed.keyword) parts.push(`keyword:${parsed.keyword}`)

  return parts.join(" | ")
}

/**
 * Rotate through example search queries for placeholder text
 */
export const SEARCH_QUERY_EXAMPLES = [
  "Best schools in Delhi",
  "Top IB schools in Gurgaon",
  "CBSE schools in Noida under ₹2 lakh",
  "Affordable boarding schools in Dehradun",
  "Girls schools in Bengaluru",
  "Cambridge board schools in Pune",
  "Best schools in Mumbai",
  "Montessori schools in Nainital",
]

/**
 * Get a rotating placeholder based on time (changes every 5 seconds)
 */
export function getRotatingPlaceholder(): string {
  const now = Math.floor(Date.now() / 5000)
  const index = now % SEARCH_QUERY_EXAMPLES.length
  return SEARCH_QUERY_EXAMPLES[index]
}

/**
 * Format fees range for display
 */
export function formatFeesRange(min?: number, max?: number): string {
  if (!min && !max) return ""

  const format = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`
    return `₹${val}`
  }

  if (min && max) return `${format(min)} - ${format(max)}`
  if (min) return `From ${format(min)}`
  if (max) return `Up to ${format(max)}`
  return ""
}
