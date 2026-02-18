const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

type StrapiImage = {
  data?: {
    attributes?: {
      url?: string
    }
  }
}

// Normalize Strapi v4 responses where most fields live under `attributes`
function normalizeSchool(item: any) {
  const attrs = item?.attributes ?? item ?? {}
  const img: StrapiImage | undefined = attrs.image ?? item?.image
  const imageUrl = (img as any)?.data?.attributes?.url || (img as any)?.attributes?.url || (img as any)?.url
  
  const name = attrs.Name || attrs.name || "Unnamed School"
  
  // Generate slug from name if not provided
  let slug = (attrs.slug || name)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")  // remove special chars
    .replace(/\s+/g, "-")       // spaces to hyphens
    .replace(/-+/g, "-")        // collapse multiple hyphens
    .replace(/^-|-$/g, "")      // trim hyphens from start/end

  return {
    id: item?.id ?? attrs.id,
    slug,
    name,
    location: attrs.location || "",
    city: attrs.city || "",
    type: attrs.type || "",
    curriculum: attrs.curriculum || "",
    rating: attrs.Ratings ?? attrs.rating ?? 0,
    reviews: attrs.reviews ?? 0,
    students: attrs.students ?? 0,
    feeRange: attrs.fee_range ?? attrs.feeRange ?? "",
    established: attrs.established ?? "",
    description: attrs.description,
    highlights: attrs.highlights,
    facilities: attrs.facilities,
    contact: attrs.contact,
    image: imageUrl ? `${STRAPI_URL}${imageUrl}` : "/placeholder.svg",
  }
}

export async function fetchSchools() {
  try {
    const url = `${STRAPI_URL}/api/schools?populate=image`
    console.log('Fetching schools from:', url)
    
    const res = await fetch(url, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Strapi unavailable (${res.status})`)
      return []
    }

    const json = await res.json()
    const data = Array.isArray(json?.data) ? json.data : []
    
    return data.map(normalizeSchool)
  } catch (error) {
    console.error('Error fetching from Strapi:', error)
    return []
  }
}

// Fetch schools from Strapi only - no mock fallback
export async function fetchSchoolsFromStrapiOnly() {
  try {
    const url = `${STRAPI_URL}/api/schools?populate=image`
    console.log('Fetching schools from Strapi (no fallback):', url)
    
    const res = await fetch(url, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Strapi unavailable (${res.status}), returning empty array`)
      return []
    }

    const json = await res.json()
    const data = Array.isArray(json?.data) ? json.data : []
    
    if (data.length === 0) {
      console.warn('Strapi returned no schools')
      return []
    }
    
    return data.map(normalizeSchool)
  } catch (error) {
    console.error('Error fetching from Strapi:', error)
    return []
  }
}
