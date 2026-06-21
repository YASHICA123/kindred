import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchSchools, fetchSchoolDetailBySlug } from '@/lib/supabase-queries'
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
      title: `${school.name} - ${school.location || school.city || ''} | Kindred School Search`,
      description:
        school.description ||
        `Learn more about ${school.name}, a ${school.type} school in ${school.location || school.city || ''}.`,
      openGraph: {
        title: school.name,
        description:
          school.description ||
          `Learn more about ${school.name}, a ${school.type} school in ${school.location || school.city || ''}.`,
        images: school.image || school.cover_image
          ? [
              {
                url: school.image || school.cover_image,
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

    // Map database fields to the component expectations
    const mappedSchool = {
      ...school,
      image: school.image || school.cover_image,
      feeRange: school.feeRange || school.fee_range,
      rating: school.rating || school.ratings,
      reviewsList: (school.reviews || [])
        .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .map((r: any) => ({
          id: r.id,
          author: r.author,
          rating: Number(r.rating) || 5,
          title: r.title || "Parent Review",
          body: r.body,
          createdAt: r.created_at
            ? new Date(r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
            : 'Recent'
        })),
      gallery: (school.gallery || []).map((img: any) => ({
        id: img.id,
        imageUrl: img.image_url || img.imageUrl || "",
        caption: img.caption,
        category: img.category || "Campus"
      })),
      contact: school.contact || {
        phone: school.contact_phone,
        email: school.contact_email,
        website: school.contact_website
      }
    }

    return <SchoolDetail school={mappedSchool} />
  } catch (error) {
    console.error('Error loading school:', error)
    notFound()
  }
}
