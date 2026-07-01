import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchSchools, fetchSchoolDetailBySlug } from '@/lib/supabase-queries'
import SchoolDetail from '@/components/school-detail'
import { BreadcrumbTrailItem } from '@/components/breadcrumbs'

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kindred.school'

    return {
      title: `${school.name} - ${school.location || school.city || ''} | Kindred School Search`,
      description:
        school.description ||
        `Learn more about ${school.name}, a ${school.type || 'premium'} school in ${school.location || school.city || ''}.`,
      alternates: {
        canonical: `${siteUrl}/schools/${slug}`,
      },
      openGraph: {
        title: school.name,
        description:
          school.description ||
          `Learn more about ${school.name}, a ${school.type || 'premium'} school in ${school.location || school.city || ''}.`,
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

    // Dynamic breadcrumb generation using real state/city metadata
    const stateName = (school as any).states?.name || school.state
    const stateSlug = (school as any).states?.slug
    const cityName = (school as any).cities?.name || school.city
    const citySlug = (school as any).cities?.slug

    const breadcrumbs: BreadcrumbTrailItem[] = [
      { label: 'Schools', href: '/discover' }
    ]
    if (stateName && stateSlug) {
      breadcrumbs.push({ label: stateName, href: `/states/${stateSlug}` })
    }
    if (cityName && citySlug) {
      breadcrumbs.push({ label: cityName, href: `/cities/${citySlug}` })
    }
    breadcrumbs.push({ label: school.name })

    // JSON-LD Schema markup for Google rich snippets
    const schoolSchema = {
      "@context": "https://schema.org",
      "@type": "School",
      "name": school.name,
      "description": school.description || `Learn more about ${school.name}, a school located in ${school.city || ""}, ${school.state || ""}.`,
      "image": school.image || school.cover_image,
      "telephone": school.contact_phone || undefined,
      "email": school.contact_email || undefined,
      "url": school.contact_website || undefined,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": school.location || "",
        "addressLocality": school.city || "",
        "addressRegion": school.state || "",
        "addressCountry": "IN",
      },
      ...(school.rating && {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": school.rating,
          "bestRating": "5",
          "reviewCount": school.reviews?.length || 1,
        }
      }),
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
        />
        <SchoolDetail school={mappedSchool} breadcrumbs={breadcrumbs} />
      </>
    )
  } catch (error) {
    console.error('Error loading school:', error)
    notFound()
  }
}
