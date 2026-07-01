import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kindred.school'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/oauth/',
        '/api/',
        '/journey/',
        '/common-application/',
        '/smart-recommender/',
        '/*?*', // Disallow crawling of URLs with query params to avoid indexing filter variants
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
