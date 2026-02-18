const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const MOCK_SCHOOLS = [
  {
    id: 1,
    slug: "heritage-school",
    Name: "Heritage School",
    name: "Heritage School",
    location: "Mumbai",
    city: "Mumbai",
    type: "CBSE",
    curriculum: "CBSE",
    Ratings: 4.8,
    rating: 4.8,
    reviews: 125,
    students: 450,
    fee_range: "₹2,50,000 - ₹4,00,000",
    feeRange: "₹2,50,000 - ₹4,00,000",
    established: "2005",
    description: "Heritage School is a premier CBSE institution dedicated to holistic education and character building.",
    highlights: ["ISO Certified", "STEM Lab", "Sports Excellence", "Multilingual Education"],
    facilities: ["Basketball Court", "Science Lab", "Computer Lab", "Library"],
    contact: {
      phone: "+91 22 1234 5678",
      email: "info@heritageschool.com",
      website: "www.heritageschool.com"
    },
    image: "/placeholder.svg"
  },
  {
    id: 2,
    slug: "st-johns-academy",
    Name: "St. John's Academy",
    name: "St. John's Academy",
    location: "Bangalore",
    city: "Bangalore",
    type: "ICSE",
    curriculum: "ICSE",
    Ratings: 4.7,
    rating: 4.7,
    reviews: 98,
    students: 380,
    fee_range: "₹2,00,000 - ₹3,50,000",
    feeRange: "₹2,00,000 - ₹3,50,000",
    established: "1998",
    description: "St. John's Academy is committed to providing quality education with emphasis on values and discipline.",
    highlights: ["Scholarship Programs", "Cultural Activities", "Debate Club", "Music Program"],
    facilities: ["Swimming Pool", "Auditorium", "Cafeteria", "Art Studio"],
    contact: {
      phone: "+91 80 9876 5432",
      email: "contact@stjohns.edu",
      website: "www.stjohns.edu"
    },
    image: "/placeholder.svg"
  },
  {
    id: 3,
    slug: "modern-vidhyapith",
    Name: "Modern Vidhyapith",
    name: "Modern Vidhyapith",
    location: "Delhi",
    city: "Delhi",
    type: "State Board",
    curriculum: "State Board",
    Ratings: 4.6,
    rating: 4.6,
    reviews: 87,
    students: 520,
    fee_range: "₹1,50,000 - ₹2,50,000",
    feeRange: "₹1,50,000 - ₹2,50,000",
    established: "2002",
    description: "Modern Vidhyapith offers comprehensive education with focus on innovation and modern teaching methods.",
    highlights: ["Tech Integration", "Student Exchange", "Green Campus", "Mentorship"],
    facilities: ["Technology Center", "Garden", "Gym", "Medical Room"],
    contact: {
      phone: "+91 11 5678 9012",
      email: "admissions@modernvidhya.org",
      website: "www.modernvidhya.org"
    },
    image: "/placeholder.svg"
  }
]

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
    const url = `${STRAPI_URL}/api/schools?populate=image&publicationState=live,preview`
    console.log('Fetching schools from:', url)
    
    const res = await fetch(url, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Strapi Error (${res.status}):`, await res.text())
      return MOCK_SCHOOLS.map(normalizeSchool)
    }

    const json = await res.json()
    const data = Array.isArray(json?.data) ? json.data : []
    
    console.log(`Strapi returned ${data.length} schools`)
    
    if (data.length === 0) {
      console.warn('No schools found in Strapi, using mock data')
      return MOCK_SCHOOLS.map(normalizeSchool)
    }
    
    return data.map(normalizeSchool)
  } catch (error) {
    console.error('Error fetching from Strapi:', error)
    return MOCK_SCHOOLS.map(normalizeSchool)
  }
}

// Fetch schools from Strapi only - no mock fallback
export async function fetchSchoolsFromStrapiOnly() {
  try {
    const url = `${STRAPI_URL}/api/schools?populate=image&publicationState=live,preview`
    console.log('Fetching schools from Strapi (no fallback):', url)
    
    const res = await fetch(url, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Strapi Error (${res.status}):`, await res.text())
      return []
    }

    const json = await res.json()
    const data = Array.isArray(json?.data) ? json.data : []
    
    console.log(`Strapi returned ${data.length} schools`)
    
    if (data.length === 0) {
      console.warn('No schools found in Strapi')
      return []
    }
    
    return data.map(normalizeSchool)
  } catch (error) {
    console.error('Error fetching from Strapi:', error)
    return []
  }
}
