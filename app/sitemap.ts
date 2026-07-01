import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kindred.school'

  // Static routes
  const staticRoutes = [
    '',
    '/schools',
    '/about',
    '/contact',
    '/free-counselling',
    '/points-calculator',
    '/age-calculator',
    '/boards',
    '/school-types',
    '/age-groups',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  try {
    // 1. Fetch dynamic schools
    const { data: schools } = await supabase
      .from('schools')
      .select('slug, updated_at')

    const schoolRoutes = (schools || []).map((school: any) => ({
      url: `${siteUrl}/schools/${school.slug}`,
      lastModified: school.updated_at ? new Date(school.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 2. Fetch dynamic states
    const { data: states } = await supabase
      .from('states')
      .select('slug, updated_at')

    const stateRoutes = (states || []).map((state: any) => ({
      url: `${siteUrl}/schools/state/${state.slug}`,
      lastModified: state.updated_at ? new Date(state.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // 3. Fetch dynamic state-cities from school_search_view to get actual combinations that have schools
    const { data: cityStates } = await supabase
      .from('school_search_view')
      .select('state_slug, city_slug')

    // De-duplicate combinations
    const uniqueCombinations = new Map<string, { state_slug: string; city_slug: string }>()
    if (cityStates) {
      for (const row of cityStates) {
        if (row.state_slug && row.city_slug) {
          const key = `${row.state_slug}/${row.city_slug}`
          uniqueCombinations.set(key, { state_slug: row.state_slug, city_slug: row.city_slug })
        }
      }
    }

    const cityRoutes = Array.from(uniqueCombinations.values()).map((combo) => ({
      url: `${siteUrl}/schools/state/${combo.state_slug}/${combo.city_slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticRoutes, ...schoolRoutes, ...stateRoutes, ...cityRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}
