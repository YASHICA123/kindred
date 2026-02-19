import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchSchools, fetchSchoolDetailBySlug } from '@/lib/strapi'
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
    const school = await fetchSchoolDetailBySlug(slug)

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
    
    const requestedSlug = String(slug).toLowerCase().trim()
    const cleanedSlug = requestedSlug.replace(/^the-/, "")

    let school = await fetchSchoolDetailBySlug(requestedSlug)
    if (!school && cleanedSlug !== requestedSlug) {
      school = await fetchSchoolDetailBySlug(cleanedSlug)
    }

    if (!school) {
      console.error(`School not found for "${requestedSlug}".`)
      notFound()
    }

    return <SchoolDetail school={school} />
  } catch (error) {
    console.error('Error loading school:', error)
    notFound()
  }
}
