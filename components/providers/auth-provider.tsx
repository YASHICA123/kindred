"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  user_metadata: SupabaseUser["user_metadata"]
  getIdToken: () => Promise<string>
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function mapSupabaseUser(session: Session | null): AuthUser | null {
  const user = session?.user

  if (!user) {
    return null
  }

  return {
    uid: user.id,
    email: user.email ?? null,
    displayName:
      (user.user_metadata?.name as string | undefined) ?? user.email?.split("@")[0] ?? null,
    user_metadata: user.user_metadata,
    getIdToken: async () => {
      const { data } = await supabase.auth.getSession()
      return data.session?.access_token ?? ""
    },
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initializeSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!isMounted) {
        return
      }

      if (error) {
        console.error("Error loading Supabase session:", error)
      }

      setUser(mapSupabaseUser(data.session))
      setLoading(false)
    }

    initializeSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapSupabaseUser(session))
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    return { user: null, loading: false }
  }
  return context
}
