"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { auth, db } from "@/lib/firebase"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  UserCredential 
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { Loader2 } from "lucide-react"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        setSuccess("Login successful! Redirecting...")
        setTimeout(() => {
          onOpenChange(false)
          window.location.href = "/dashboard"
        }, 1000)
      } else {
        // Signup validation
        if (!formData.name) {
          setError("Name is required")
          setLoading(false)
          return
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters")
          setLoading(false)
          return
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          setLoading(false)
          return
        }

        // Create user
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
          auth, 
          formData.email, 
          formData.password
        )
        
        // Save user data to Firestore
        await setDoc(
          doc(db, "users", userCredential.user.uid),
          {
            uid: userCredential.user.uid,
            name: formData.name,
            email: formData.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            stats: {
              schoolsVisited: 0,
              sessionsBooked: 0,
              favorites: 0,
            },
          },
          { merge: true },
        )

        setSuccess("Account created! Redirecting...")
        setTimeout(() => {
          onOpenChange(false)
          window.location.href = "/dashboard"
        }, 1000)
      }
    } catch (err: any) {
      let errorMessage = "An error occurred. Please try again."
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email already in use. Please login instead."
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address"
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak"
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password"
      } else if (err.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your connection."
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError("")
    setSuccess("")
    setFormData({ name: "", email: "", password: "", confirmPassword: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">
            {isLogin ? "Welcome back" : "Begin your journey"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Logging in..." : "Creating account..."}
              </>
            ) : (
              isLogin ? "Log In" : "Sign Up"
            )}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary hover:underline"
              disabled={loading}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
