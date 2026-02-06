"use client"

import React, { useEffect, useState } from "react"
import { fetchSchools } from "@/lib/strapi"
import { CompareCards } from "./compare-cards"
import { CompareDetails } from "./compare-details"

export default function CompareClient() {
  const [allSchools, setAllSchools] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedA, setSelectedA] = useState<number | null>(null)
  const [selectedB, setSelectedB] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    fetchSchools()
      .then((data) => {
        if (!mounted) return
        const sorted = data.slice().sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
        setAllSchools(sorted)
        setSelectedA(sorted[0]?.id ?? null)
        setSelectedB(sorted[1]?.id ?? null)
      })
      .catch(() => setAllSchools([]))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return null

  const options = allSchools || []

  const handleAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value)
    setSelectedA(id)
    if (id === selectedB) {
      // if user selected same as B, clear B
      setSelectedB(null)
    }
  }

  const handleBChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value)
    setSelectedB(id)
    if (id === selectedA) {
      setSelectedA(null)
    }
  }

  const selectedSchools = [
    options.find((s) => s.id === selectedA),
    options.find((s) => s.id === selectedB),
  ].filter(Boolean) as any[]

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground block mb-1">Compare school A</label>
            <select value={selectedA ?? ""} onChange={handleAChange} className="w-full rounded-md p-2 border">
              <option value="">Select a school</option>
              {options.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm text-muted-foreground block mb-1">Compare school B</label>
            <select value={selectedB ?? ""} onChange={handleBChange} className="w-full rounded-md p-2 border">
              <option value="">Select a school</option>
              {options
                .filter((s) => s.id !== selectedA)
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </section>

      {/* Pass selected schools to the cards and details */}
      <CompareCards schools={selectedSchools} />
      <CompareDetails schools={selectedSchools} />
    </div>
  )
}
