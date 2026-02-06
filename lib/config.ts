// Environment variables configuration
export const config = {
  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI || '',
    database: process.env.MONGODB_DB || 'kindred_schools',
  },

  // Security
  security: {
    adminApiKey: process.env.ADMIN_API_KEY || '',
    jwtSecret: process.env.JWT_SECRET || '',
  },

  // App
  app: {
    name: 'Kindred School Search',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    environment: process.env.NODE_ENV || 'development',
  },
}

// Validation
export function validateConfig() {
  const errors: string[] = []

  if (!config.mongodb.uri) {
    errors.push('MONGODB_URI is required')
  }

  if (config.app.environment === 'production' && !config.security.adminApiKey) {
    errors.push('ADMIN_API_KEY is required in production')
  }

  if (errors.length > 0) {
    console.error('Configuration errors:', errors)
    if (config.app.environment === 'production') {
      throw new Error(`Configuration errors: ${errors.join(', ')}`)
    }
  }

  return errors
}
