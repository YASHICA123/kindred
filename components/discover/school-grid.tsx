"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { fetchSchools } from "@/lib/strapi"

type Props = {
  filters?: Record<string, string[]>
}

export function SchoolGrid({ filters }: Props) {
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchSchools()
      .then((data) => {
        if (mounted) setSchools(data)
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [])

  function matchesFilters(school: any) {
    if (!filters) return true
    const normalize = (v: any): string[] => {
      if (v == null) return []
      if (Array.isArray(v)) {
        return v
          .map((x) => {
            if (!x) return ""
            if (typeof x === "string") return x
            if (typeof x === "object") return (x.name || x.Name || x.title || x.Type || "").toString()
            return String(x)
          })
          .filter(Boolean)
      }
      if (typeof v === "object") {
        const str = v.name || v.Name || v.title || v.Type || v.curriculum || ""
        return str ? [String(str)] : []
      }
      return [String(v)]
    }

    const matchAny = (field: any, allowed: string[]) => {
      if (!allowed || !allowed.length) return true
      const vals = normalize(field).map((x) => x.toLowerCase())
      if (!vals.length) return false
      return allowed.some((f) => {
        const needle = f.toLowerCase()
        return vals.some((v) => v === needle || v.includes(needle) || needle.includes(v))
      })
    }

    if (!matchAny(school.curriculum, filters.curriculum || [])) return false
    if (!matchAny(school.type, filters.type || [])) return false
    if (!matchAny(school.feeRange || school.fee, filters.fee || [])) return false
    // City filter: match against `city` or fallback to `location`
    if (!matchAny(school.city || school.location, filters.city || [])) return false

    // State filter: some entries may have `state`, otherwise try `location`
    if (!matchAny(school.state ?? school.location ?? null, filters.state || [])) return false

    return true
  }

  const visible = schools.filter(matchesFilters)

  if (loading) return <div className="h-96 bg-secondary animate-pulse rounded-2xl" />
  if (!schools.length) return <p className="text-center py-20">No schools found</p>

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        <div>Active filters: {Object.keys(filters || {}).length ? JSON.stringify(filters) : "(none)"}</div>
      </div>
      <p className="text-muted-foreground mb-6">
        Showing <span className="font-medium text-foreground">{visible.length}</span> schools
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((s) => (
          <Link
            key={s.id}
            href={`/schools/${s.slug || s.id}`}
            className="group block bg-card rounded-2xl overflow-hidden border hover:shadow-lg transition"
          >
            <div className="aspect-video overflow-hidden relative">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
            </div>

            <div className="p-5">
              <h3 className="text-lg font-medium">{s.name}</h3>

              <p className="text-sm text-muted-foreground mt-1">
                {s.location}, {s.city}
              </p>

              <p className="text-xs text-muted-foreground mt-2">curriculum: {JSON.stringify(s.curriculum)}</p>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <span className="text-sm">{s.students}</span>
                <span className="text-sm font-medium text-primary">{s.feeRange}/yr</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
