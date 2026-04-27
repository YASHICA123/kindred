import type { SupabaseClient } from '@supabase/supabase-js'

export const USER_DATA_TABLE = 'user_data_store'

export type StoreRow = {
  id?: string
  user_id: string
  bucket: string
  data_key: string
  payload: Record<string, any>
  created_at?: string
  updated_at?: string
}

function buildKey(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function makeStoreKey(prefix: string): string {
  return buildKey(prefix)
}

export async function upsertUserRecord(
  client: SupabaseClient,
  params: {
    userId: string
    bucket: string
    dataKey: string
    payload: Record<string, any>
  },
) {
  const now = new Date().toISOString()

  const { data, error } = await client
    .from(USER_DATA_TABLE)
    .upsert(
      {
        user_id: params.userId,
        bucket: params.bucket,
        data_key: params.dataKey,
        payload: params.payload,
        updated_at: now,
      },
      { onConflict: 'user_id,bucket,data_key' },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as StoreRow
}

export async function insertUserRecord(
  client: SupabaseClient,
  params: {
    userId: string
    bucket: string
    payload: Record<string, any>
    keyPrefix: string
  },
) {
  const now = new Date().toISOString()
  const dataKey = buildKey(params.keyPrefix)

  const { data, error } = await client
    .from(USER_DATA_TABLE)
    .insert({
      user_id: params.userId,
      bucket: params.bucket,
      data_key: dataKey,
      payload: params.payload,
      created_at: now,
      updated_at: now,
    })
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return data as StoreRow
}

export async function getUserRecord(
  client: SupabaseClient,
  params: {
    userId: string
    bucket: string
    dataKey: string
  },
) {
  const { data, error } = await client
    .from(USER_DATA_TABLE)
    .select('*')
    .eq('user_id', params.userId)
    .eq('bucket', params.bucket)
    .eq('data_key', params.dataKey)
    .maybeSingle()

  if (error) {
    throw error
  }

  return (data as StoreRow | null) ?? null
}

export async function listUserRecords(
  client: SupabaseClient,
  params: {
    userId: string
    bucket: string
  },
) {
  const { data, error } = await client
    .from(USER_DATA_TABLE)
    .select('*')
    .eq('user_id', params.userId)
    .eq('bucket', params.bucket)
    .order('updated_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data || []) as StoreRow[]
}

export async function deleteUserRecord(
  client: SupabaseClient,
  params: {
    userId: string
    bucket: string
    dataKey: string
  },
) {
  const { error } = await client
    .from(USER_DATA_TABLE)
    .delete()
    .eq('user_id', params.userId)
    .eq('bucket', params.bucket)
    .eq('data_key', params.dataKey)

  if (error) {
    throw error
  }
}
