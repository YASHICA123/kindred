"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getSavedSchools, saveSchool, removeSavedSchool } from '@/lib/firebase-data'

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
      // First try Firebase
      const firebaseSavedSchools = await getSavedSchools()
      const schoolsList = firebaseSavedSchools.map((school) => ({
        schoolId: school.schoolId,
        schoolName: school.schoolName,
        schoolImage: school.schoolImage || '',
        schoolLocation: school.schoolLocation || '',
        savedAt: school.savedAt instanceof Object ? new Date(school.savedAt).toISOString() : school.savedAt,
      }))
      setSavedSchools(schoolsList)
    } catch (error) {
      console.error('Error fetching saved schools from Firebase:', error)
      
      // Fallback to API
      try {
        const response = await fetch(`/api/user/saved-schools?userId=${user.uid}`)
        const data = await response.json()
        setSavedSchools(data.savedSchools || [])
      } catch (apiError) {
        console.error('Error fetching saved schools from API:', apiError)
      }
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
        // Remove from Firebase
        await removeSavedSchool(school.schoolId.toString())
        setSavedSchools((prev) => prev.filter((s) => s.schoolId !== school.schoolId))
        
        // Also call API for backup
        await fetch(`/api/user/saved-schools`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.uid, schoolId: school.schoolId }),
        }).catch(err => console.warn('API deletion fallback failed:', err))
      } else {
        // Save to Firebase
        await saveSchool({
          schoolId: school.schoolId.toString(),
          schoolName: school.schoolName,
          schoolImage: school.schoolImage,
          schoolLocation: school.schoolLocation,
        })
        setSavedSchools((prev) => [...prev, { ...school, savedAt: new Date().toISOString() }])
        
        // Also call API for backup
        await fetch(`/api/user/saved-schools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${await user.getIdToken()}` },
          body: JSON.stringify({ userId: user.uid, ...school }),
        }).catch(err => console.warn('API save fallback failed:', err))
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      throw error
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
