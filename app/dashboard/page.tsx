"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { SavedSchoolsList } from "@/components/profile/saved-schools-list"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
        router.push("/")
      }
    })

    return () => {
      unsubscribeAuth()
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
              K
            </div>
            <span className="font-serif text-2xl font-bold">Kindred</span>
          </Link>
          
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <h1 className="text-4xl font-serif font-bold mb-2">
            My Shortlisted Schools
          </h1>
          <p className="text-muted-foreground">
            View and manage all the schools you've saved
          </p>
        </div>

        {/* Saved Schools List */}
        <div className="bg-white rounded-2xl border border-border p-8">
          <SavedSchoolsList />
        </div>
      </main>
    </div>
  )
}
