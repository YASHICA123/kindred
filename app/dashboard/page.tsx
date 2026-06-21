"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, ArrowLeft, Clock, School, ExternalLink, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { getRecentSchoolVisits } from "@/lib/supabase-data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface VisitedSchool {
  id: string
  school_id: number
  school_name: string
  school_slug: string
  visited_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [recentVisits, setRecentVisits] = useState<VisitedSchool[]>([])
  const [loadingVisits, setLoadingVisits] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [loading, router, user])

  useEffect(() => {
    async function fetchVisits() {
      if (!user) return
      try {
        const visits = await getRecentSchoolVisits(12)
        setRecentVisits(visits as VisitedSchool[])
      } catch (err) {
        console.error("Error fetching recent visits:", err)
      } finally {
        setLoadingVisits(false)
      }
    }
    if (user) fetchVisits()
  }, [user])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pt-24 lg:pt-28">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-4xl font-serif font-bold">Recently Visited Schools</h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            Schools you&apos;ve browsed recently — pick up where you left off
          </p>
        </div>

        {/* Visits Grid */}
        {loadingVisits ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : recentVisits.length === 0 ? (
          <div className="bg-card rounded-3xl border border-border p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-serif font-semibold mb-3">No schools visited yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring schools to build your browsing history. Your recently viewed schools will appear here.
            </p>
            <Link href="/discover">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                Explore Schools
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentVisits.map((visit) => (
              <Link
                key={visit.id}
                href={`/schools/${visit.school_slug}`}
                className="group bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <School className="h-5 w-5 text-primary" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                </div>
                <h3 className="font-semibold text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
                  {visit.school_name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(visit.visited_at)}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* CTA to explore more */}
        {recentVisits.length > 0 && (
          <div className="mt-10 text-center">
            <Link href="/discover">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Explore More Schools
              </Button>
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
