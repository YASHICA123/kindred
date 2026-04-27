import {
  deleteUserRecord,
  getUserRecord,
  insertUserRecord,
  listUserRecords,
  upsertUserRecord,
} from './supabase-store'
import { supabaseAdmin } from './supabase'

export async function serverUpsertUserRecord(params: {
  userId: string
  bucket: string
  dataKey: string
  payload: Record<string, any>
}) {
  return upsertUserRecord(supabaseAdmin as any, params)
}

export async function serverInsertUserRecord(params: {
  userId: string
  bucket: string
  payload: Record<string, any>
  keyPrefix: string
}) {
  return insertUserRecord(supabaseAdmin as any, params)
}

export async function serverGetUserRecord(params: {
  userId: string
  bucket: string
  dataKey: string
}) {
  return getUserRecord(supabaseAdmin as any, params)
}

export async function serverListUserRecords(params: {
  userId: string
  bucket: string
}) {
  return listUserRecords(supabaseAdmin as any, params)
}

export async function serverDeleteUserRecord(params: {
  userId: string
  bucket: string
  dataKey: string
}) {
  return deleteUserRecord(supabaseAdmin as any, params)
}
