import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const BUCKET_NAME = 'application-documents'

export async function POST() {
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)

  if (!bucketExists) {
    const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
      public: true,
    })

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, bucket: BUCKET_NAME })
}