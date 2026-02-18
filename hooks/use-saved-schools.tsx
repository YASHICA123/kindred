"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'

interface SavedSchool {
  schoolId: string | number
  schoolName: string
  schoolImage: string
  schoolLocation: string
  savedAt: string
}

interface SavedSchoolsContextType {
  savedSchools: SavedSchool[]
  isSaved: (schoolId: string | number) => boolean
  toggleSave: (school: SavedSchool) => Promise<void>
  loading: boolean
}

const SavedSchoolsContext = createContext<SavedSchoolsContextType | undefined>(undefined)

export function SavedSchoolsProvider({ children }: { children: React.ReactNode }) {
  const [savedSchools, setSavedSchools] = useState<SavedSchool[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  // Fetch saved schools when user logs in
  useEffect(() => {
    if (user?.uid) {
      fetchSavedSchools()
    } else {
      setSavedSchools([])
    }
  }, [user?.uid])

  const fetchSavedSchools = async () => {
    if (!user?.uid) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/user/saved-schools?userId=${user.uid}`)
      const data = await response.json()
      setSavedSchools(data.savedSchools || [])
    } catch (error) {
      console.error('Error fetching saved schools:', error)
    } finally {
      setLoading(false)
    }
  }

  const isSaved = (schoolId: string | number) => {
    return savedSchools.some((school) => school.schoolId === schoolId)
  }

  const toggleSave = async (school: SavedSchool) => {
    if (!user?.uid) return

    try {
      const isSavedNow = isSaved(school.schoolId)

      if (isSavedNow) {
        // Remove from saved
        await fetch(`/api/user/saved-schools`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid, schoolId: school.schoolId }),
        })
        setSavedSchools((prev) => prev.filter((s) => s.schoolId !== school.schoolId))
      } else {
        // Add to saved
        await fetch(`/api/user/saved-schools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await user.getIdToken()}` },
          body: JSON.stringify({ userId: user.uid, ...school }),
        })
        setSavedSchools((prev) => [...prev, { ...school, savedAt: new Date().toISOString() }])
      }
    } catch (error) {
      console.error('Error toggling save:', error)
    }
  }

  return (
    <SavedSchoolsContext.Provider value={{ savedSchools, isSaved, toggleSave, loading }}>
      {children}
    </SavedSchoolsContext.Provider>
  )
}

export function useSavedSchools() {
  const context = useContext(SavedSchoolsContext)
  if (!context) {
    throw new Error('useSavedSchools must be used within SavedSchoolsProvider')
  }
  return context
}
