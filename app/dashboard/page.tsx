"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogOut, School, Calendar, Heart, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface UserData {
  name: string
  email: string
  createdAt: any
  uid: string
  stats?: {
    schoolsVisited?: number
    sessionsBooked?: number
    favorites?: number
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let unsubscribeUserDoc: (() => void) | null = null

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser)

        // Realtime user data listener
        const userRef = doc(db, "users", currentUser.uid)
        unsubscribeUserDoc = onSnapshot(
          userRef,
          (snapshot) => {
            if (snapshot.exists()) {
              setUserData(snapshot.data() as UserData)
            } else {
              setUserData(null)
            }
            setLoading(false)
          },
          (error) => {
            console.error("Error fetching user data:", error)
            setLoading(false)
          },
        )
      } else {
        setUser(null)
        setUserData(null)
        setLoading(false)
        router.push("/")
      }
    })

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc()
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

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">
            Welcome back, {userData?.name || user.email.split('@')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Your personalized school discovery journey continues here
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{userData?.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">{formatDate(userData?.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-xs">{user.uid}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Schools Visited</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.stats?.schoolsVisited ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Start discovering schools</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Sessions Booked</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.stats?.sessionsBooked ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Book a counselor session</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData?.stats?.favorites ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Save your favorite schools</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Continue your school discovery journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/discover">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <School className="h-6 w-6" />
                  <span>Discover Schools</span>
                </Button>
              </Link>
              
              <Link href="/compare">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Compare Schools</span>
                </Button>
              </Link>
              
              <Link href="/counselor-connect">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Book Counselor</span>
                </Button>
              </Link>
              
              <Link href="/journey">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Sparkles className="h-6 w-6" />
                  <span>Start Journey</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
