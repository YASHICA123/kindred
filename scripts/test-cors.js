#!/usr/bin/env node

const https = require('https')
const url = 'https://enchwrptwtctikbhrpsg.supabase.co/storage/v1/object/public/school-images/The_Doon_School.jpg'

console.log('Testing full HTTP headers...\n')

const testHeaders = async () => {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS'
    }).catch(() => null)

    if (response) {
      console.log('OPTIONS Response Headers:')
      for (const [key, value] of response.headers) {
        if (key.toLowerCase().includes('access') || key.toLowerCase().includes('cache')) {
          console.log(`  ${key}: ${value}`)
        }
      }
    }

    // Try HEAD request
    const headResponse = await fetch(url, { method: 'HEAD' })
    console.log('\nHEAD Response:')
    console.log(`Status: ${headResponse.status}`)
    console.log(`Cacheable: ${headResponse.headers.get('cache-control')}`)
    console.log(`CORS Headers:`)
    console.log(`  Access-Control-Allow-Origin: ${headResponse.headers.get('access-control-allow-origin')}`)
    console.log(`  Access-Control-Allow-Methods: ${headResponse.headers.get('access-control-allow-methods')}`)
    console.log(`  Content-Type: ${headResponse.headers.get('content-type')}`)

    // Try GET request
    console.log('\nGET Request Test:')
    const getResponse = await fetch(url)
    console.log(`Status: ${getResponse.status}`)
    console.log(`Can access: YES ✅`)

  } catch (error) {
    console.error('Error:', error.message)
  }
}

testHeaders()
