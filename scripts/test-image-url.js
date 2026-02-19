#!/usr/bin/env node

const https = require('https')

const imageUrl = 'https://enchwrptwtctikbhrpsg.supabase.co/storage/v1/object/public/school-images/The_Doon_School.jpg'

console.log('Testing image URL accessibility from Node.js...\n')
console.log(`URL: ${imageUrl}\n`)

const testFetch = async () => {
  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    })

    console.log(`Status: ${response.status}`)
    console.log(`Status Text: ${response.statusText}`)
    console.log(`Content-Type: ${response.headers.get('content-type')}`)
    console.log(`Content-Length: ${response.headers.get('content-length')}`)
    
    const buffer = await response.arrayBuffer()
    console.log(`\nFile size: ${buffer.byteLength} bytes`)
    
    if (buffer.byteLength === 0) {
      console.log('❌ ERROR: File is empty!')
    } else if (response.status === 200) {
      console.log('✅ Image file exists and is accessible!')
    } else {
      console.log(`⚠️ Unexpected status code: ${response.status}`)
    }

  } catch (error) {
    console.error('❌ Error fetching image:', error.message)
  }
}

testFetch()
