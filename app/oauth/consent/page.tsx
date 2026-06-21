"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuthContext } from "@/components/providers/auth-provider"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Loader2, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  Globe,
  User,
  Mail,
  FileText
} from "lucide-react"

function ConsentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user: authUser, loading: authLoading } = useAuthContext()
  
  const authorizationId = searchParams.get("authorization_id")
  
  const [details, setDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [error, setError] = useState("")
  
  // Inline Login/Signup States
  const [isLogin, setIsLogin] = useState(true)
  const [authFormLoading, setAuthFormLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [authSuccess, setAuthSuccess] = useState("")
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  // Fetch authorization request details
  useEffect(() => {
    if (!authorizationId) {
      setError("Missing authorization_id parameter. Unable to continue.")
      setLoadingDetails(false)
      return
    }

    if (authLoading) return // Wait for auth state to resolve

    if (!authUser) {
      // User is not logged in, stop loading details (will show login UI)
      setLoadingDetails(false)
      return
    }

    const fetchDetails = async () => {
      try {
        setLoadingDetails(true)
        setError("")
        
        const { data, error: fetchErr } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId)
        
        if (fetchErr) {
          throw fetchErr
        }

        if (data && "redirect_url" in data) {
          // Consent was already granted previously, redirect back immediately
          window.location.href = (data as any).redirect_url
          return
        }

        setDetails(data)
      } catch (err: any) {
        console.error("Error fetching authorization details:", err)
        setError(err.message || "Failed to retrieve authorization details. Please verify your link.")
      } finally {
        setLoadingDetails(false)
      }
    }

    fetchDetails()
  }, [authorizationId, authUser, authLoading])

  // Handle Approve Authorization
  const handleApprove = async () => {
    if (!authorizationId) return
    try {
      setLoadingDetails(true)
      setError("")
      const { data, error: approveErr } = await supabase.auth.oauth.approveAuthorization(authorizationId)
      
      if (approveErr) {
        throw approveErr
      }

      if (data?.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        setError("Approval completed, but no redirect URL was returned.")
      }
    } catch (err: any) {
      console.error("Approval error:", err)
      setError(err.message || "An error occurred while approving authorization.")
      setLoadingDetails(false)
    }
  }

  // Handle Deny Authorization
  const handleDeny = async () => {
    if (!authorizationId) return
    try {
      setLoadingDetails(true)
      setError("")
      const { data, error: denyErr } = await supabase.auth.oauth.denyAuthorization(authorizationId)
      
      if (denyErr) {
        throw denyErr
      }

      if (data?.redirect_url) {
        window.location.href = data.redirect_url
      } else {
        router.push("/")
      }
    } catch (err: any) {
      console.error("Denial error:", err)
      setError(err.message || "An error occurred while denying authorization.")
      setLoadingDetails(false)
    }
  }

  // Inline Login/Signup Submit handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthSuccess("")
    setAuthFormLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: authForm.email,
          password: authForm.password,
        })

        if (error) throw error
        setAuthSuccess("Logged in successfully! Loading authorization details...")
      } else {
        if (!authForm.name) {
          setAuthError("Name is required")
          setAuthFormLoading(false)
          return
        }
        if (authForm.password.length < 6) {
          setAuthError("Password must be at least 6 characters")
          setAuthFormLoading(false)
          return
        }
        if (authForm.password !== authForm.confirmPassword) {
          setAuthError("Passwords do not match")
          setAuthFormLoading(false)
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email: authForm.email,
          password: authForm.password,
          options: {
            data: {
              name: authForm.name,
            },
          },
        })

        if (error) throw error

        if (data.session) {
          setAuthSuccess("Account created successfully! Loading authorization details...")
        } else {
          // Attempt auto-login using verification bypass trigger
          try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: authForm.email,
              password: authForm.password,
            })
            if (signInError) throw signInError
            setAuthSuccess("Account created and verified! Loading authorization details...")
          } catch (autoLoginErr) {
            setAuthSuccess("Account created! Please check your email to confirm your account.")
          }
        }
      }
    } catch (err: any) {
      let msg = err.message || "Authentication failed. Please try again."
      const normalized = msg.toLowerCase()
      if (normalized.includes("already registered")) {
        msg = "Email already in use. Please log in instead."
      } else if (normalized.includes("invalid login credentials")) {
        msg = "Invalid email or password"
      }
      setAuthError(msg)
    } finally {
      setAuthFormLoading(false)
    }
  }

  // Parse space-separated scopes
  const parseScopes = (scopeStr: string) => {
    if (!scopeStr) return []
    return scopeStr.split(" ").map((s) => {
      const scope = s.trim()
      let label = scope
      let desc = "Access metadata for this permission"
      let icon = <Lock className="h-4 w-4 text-emerald-600" />

      if (scope === "openid") {
        label = "Sign in using your account credentials"
        desc = "Authenticates you and links your session"
        icon = <User className="h-4 w-4 text-emerald-600" />
      } else if (scope === "email") {
        label = "Access your email address"
        desc = "Used to contact you or verify your profile"
        icon = <Mail className="h-4 w-4 text-emerald-600" />
      } else if (scope === "profile") {
        label = "Access your profile information"
        desc = "Full name, display name, and avatar settings"
        icon = <FileText className="h-4 w-4 text-emerald-600" />
      }

      return { scope, label, desc, icon }
    })
  }

  // Render Full Page Loading state
  if (authLoading || (loadingDetails && authUser)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#FAF6F0] to-[#F5EBE0] p-6">
        <Loader2 className="h-10 w-10 text-emerald-800 animate-spin mb-4" />
        <p className="text-stone-600 font-sans tracking-wide">Loading authorization context...</p>
      </div>
    )
  }

  // Render Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#FAF6F0] to-[#F5EBE0] p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/60 p-8 max-w-md w-full text-center">
          <ShieldAlert className="h-14 w-14 text-rose-600 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-stone-900 mb-2">Authorization Failed</h2>
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">{error}</p>
          <Button onClick={() => router.push("/")} className="w-full bg-stone-950 hover:bg-stone-900 text-white rounded-lg">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  // Render Login Card if not authenticated
  if (!authUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#FAF6F0] to-[#F5EBE0] p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200/60 p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif text-stone-950 mb-1">
              {isLogin ? "Sign in to Kindred" : "Create Kindred Account"}
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed px-4">
              To proceed with authorizing the third-party application request, please sign in.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  required={!isLogin}
                  disabled={authFormLoading}
                  className="rounded-lg border-stone-200"
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                required
                disabled={authFormLoading}
                className="rounded-lg border-stone-200"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required
                disabled={authFormLoading}
                className="rounded-lg border-stone-200"
              />
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={authForm.confirmPassword}
                  onChange={(e) => setAuthForm({ ...authForm, confirmPassword: e.target.value })}
                  required={!isLogin}
                  disabled={authFormLoading}
                  className="rounded-lg border-stone-200"
                />
              </div>
            )}

            {authError && (
              <Alert variant="destructive" className="rounded-lg">
                <AlertDescription className="text-xs">{authError}</AlertDescription>
              </Alert>
            )}

            {authSuccess && (
              <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200 rounded-lg">
                <AlertDescription className="text-xs">{authSuccess}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg h-11" disabled={authFormLoading}>
              {authFormLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Logging in..." : "Signing up..."}
                </>
              ) : (
                isLogin ? "Sign In" : "Register & Sign In"
              )}
            </Button>
          </form>

          <div className="text-center mt-6 text-xs text-stone-600 border-t border-stone-100 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setAuthError("")
                setAuthSuccess("")
              }}
              className="text-emerald-800 hover:underline font-medium"
              disabled={authFormLoading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render Consent screen
  const clientName = details?.client?.name || "Third-Party Application"
  const clientWebsite = details?.client?.uri || ""
  const clientLogo = details?.client?.logo_uri || ""
  const scopesList = parseScopes(details?.scope || "")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-[#FAF6F0] to-[#F5EBE0] p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200/60 p-8 max-w-md w-full">
        {/* App Logo or Branding details */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-16 w-16 bg-[#FAF6F0] rounded-2xl flex items-center justify-center border border-stone-200/60 shadow-inner mb-4 overflow-hidden">
            {clientLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={clientLogo} alt={clientName} className="h-full w-full object-cover" />
            ) : (
              <Globe className="h-8 w-8 text-stone-600" />
            )}
          </div>
          <h1 className="text-xl font-serif text-stone-950 px-2 leading-tight">
            Authorize <span className="text-emerald-950 font-semibold">{clientName}</span>
          </h1>
          {clientWebsite && (
            <a 
              href={clientWebsite} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-stone-500 hover:underline mt-1 flex items-center gap-1 font-sans"
            >
              {clientWebsite} <ArrowRight className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Informational Message */}
        <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 mb-6 text-xs text-stone-600 leading-relaxed">
          <p>
            This application is requesting access to perform actions on your behalf using your Kindred account. Review the requested permissions below.
          </p>
        </div>

        {/* Scopes Section */}
        <div className="space-y-4 mb-6">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Requested Permissions</p>
          <div className="space-y-3">
            {scopesList.length > 0 ? (
              scopesList.map((item) => (
                <div key={item.scope} className="flex items-start gap-3 p-3 bg-stone-50/50 rounded-xl border border-stone-100">
                  <div className="mt-0.5 p-1 bg-emerald-50 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-stone-950">{item.label}</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-3 p-3 bg-stone-50/50 rounded-xl border border-stone-100">
                <div className="mt-0.5 p-1 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-stone-950">Basic Account Access</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Read profile settings and identity details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Account Info */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-4 mb-6 text-xs">
          <span className="text-stone-500">Authorizing as:</span>
          <span className="font-medium text-stone-900 font-mono">{authUser?.email}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleApprove}
            className="w-full bg-emerald-800 hover:bg-emerald-950 text-white rounded-lg h-11 text-sm font-medium"
          >
            Authorize Access
          </Button>
          <Button 
            onClick={handleDeny} 
            variant="outline"
            className="w-full border-stone-200 hover:bg-stone-50 text-stone-700 rounded-lg h-11 text-sm font-medium"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ConsentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-[#FAF6F0] to-[#F5EBE0] p-6">
        <Loader2 className="h-10 w-10 text-emerald-800 animate-spin mb-4" />
        <p className="text-stone-600 font-sans tracking-wide">Loading authorization interface...</p>
      </div>
    }>
      <ConsentContent />
    </Suspense>
  )
}
