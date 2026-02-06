import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchSchools } from '@/lib/strapi'
import SchoolDetail from '@/components/school-detail'

interface PageProps {
  params: {
    slug: string
  }
}

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const schools = await fetchSchools()

    return schools.map((school: any) => ({
      slug: school.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Dynamic SEO metadata
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  try {
    const { slug } = await params
    const schools = await fetchSchools()
    const school = schools.find((s: any) => s.slug === slug)

    if (!school) {
      return {
        title: 'School Not Found',
        description: 'The requested school could not be found.',
      }
    }

    return {
      title: `${school.name} - ${school.location} | Kindred School Search`,
      description:
        school.description ||
        `Learn more about ${school.name}, a ${school.type} school in ${school.location}.`,
      openGraph: {
        title: school.name,
        description:
          school.description ||
          `Learn more about ${school.name}, a ${school.type} school in ${school.location}.`,
        images: school.image
          ? [
              {
                url: school.image,
              },
            ]
          : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'School Details',
    }
  }
}


export default async function SchoolPage({ params }: PageProps) {
  try {
    const { slug } = await params
    
    if (!slug) {
      console.error('No slug provided in params')
      notFound()
    }
    
    const schools = await fetchSchools()
    
    if (!schools || schools.length === 0) {
      console.warn('No schools returned from fetchSchools()')
      notFound()
    }
    
    let requestedSlug = String(slug).toLowerCase().trim()
    // Remove "the-" prefix if present (common in school names)
    const cleanedSlug = requestedSlug.replace(/^the-/, "")
    
    console.log(`Looking for school. Original slug: "${requestedSlug}", Cleaned: "${cleanedSlug}"`)
    console.log(`Available schools:`, schools.map(s => ({ id: s.id, slug: s.slug, name: s.name })))
    
    // Try 1: exact slug match
    let school = schools.find((s: any) => (s.slug || '').toLowerCase().trim() === requestedSlug)
    
    // Try 2: slug match without "the-" prefix
    if (!school) {
      school = schools.find((s: any) => {
        const sSlug = (s.slug || '').toLowerCase().trim()
        return sSlug === cleanedSlug || sSlug === requestedSlug
      })
    }
    
    // Try 3: ID match (if numeric)
    if (!school) {
      const asNum = Number(requestedSlug)
      if (!isNaN(asNum)) {
        school = schools.find((s: any) => s.id === asNum)
      }
    }
    
    // Try 4: name contains search
    if (!school) {
      const searchTerms = cleanedSlug.split('-')
      school = schools.find((s: any) => {
        const schoolName = (s.name || '').toLowerCase()
        return searchTerms.some(term => schoolName.includes(term)) || schoolName.includes(cleanedSlug)
      })
    }
    
    // Try 5: first word match
    if (!school && cleanedSlug.length > 0) {
      const firstWord = cleanedSlug.split('-')[0]
      school = schools.find((s: any) => {
        const schoolName = (s.name || '').toLowerCase()
        return schoolName.startsWith(firstWord)
      })
    }

    if (!school) {
      console.error(`School not found for "${requestedSlug}". Using first school as fallback.`)
      school = schools[0]
    }

    console.log(`Found school:`, { id: school.id, name: school.name, slug: school.slug })
    return <SchoolDetail school={school} />
  } catch (error) {
    console.error('Error loading school:', error)
    notFound()
  }
}
