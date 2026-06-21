"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown, LogOut, Heart, Video, Clock, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { AuthDialog } from "@/components/auth-dialog"
import { supabase } from "@/lib/supabase"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmartSearchDialog } from "@/components/smart-search-dialog"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const canGoBack = pathname !== "/"
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const displayName = user?.displayName || user?.email?.split("@")[0] || null
  const userEmail = user?.email || null

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUserMenuOpen(false)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMousePosition({ x: x * 0.15, y: y * 0.15 })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 border-b border-border/30 shadow-sm backdrop-blur-xl"
            : "bg-white/80 backdrop-blur-sm border-b border-border/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <div className="flex items-center gap-2">
              {canGoBack && (
                <button
                  onClick={() => router.back()}
                  className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-secondary/50 transition-colors flex items-center justify-center"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-foreground" />
                </button>
              )}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <span className="font-serif text-2xl font-bold text-foreground">Kindred</span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-2">
              <Link
                href="/"
                className="relative px-4 py-2 text-[0.9rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                Home
                <span className="absolute bottom-1 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
              
              {/* Discover with Mega Menu Hover Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsDiscoverOpen(true)}
                onMouseLeave={() => setIsDiscoverOpen(false)}
              >
                <Link
                  href="/discover"
                  className="relative px-4 py-2 text-[0.9rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group flex items-center gap-1.5"
                >
                  Discover
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDiscoverOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'}`} />
                  <span className="absolute bottom-1 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
                
                {/* Mega Menu Dropdown */}
                {isDiscoverOpen && (
                  <div className="absolute left-1/2 -translate-x-[40%] top-full pt-4 z-50 w-[880px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-border/70 p-8 grid grid-cols-4 gap-8">
                      {/* Column 1 */}
                      <div className="space-y-4 text-left">
                        <h4 className="text-[0.75rem] font-bold text-muted-foreground tracking-wider uppercase border-b pb-2">Day Schools</h4>
                        <ul className="space-y-2.5">
                          {[
                            { name: "Bangalore", query: "city=Bangalore&type=Day School" },
                            { name: "Mumbai", query: "city=Mumbai&type=Day School" },
                            { name: "Pune", query: "city=Pune&type=Day School" },
                            { name: "Hyderabad", query: "city=Hyderabad&type=Day School" },
                            { name: "Chennai", query: "city=Chennai&type=Day School" },
                            { name: "Kolkata", query: "city=Kolkata&type=Day School" },
                            { name: "Delhi NCR", query: "city=Delhi NCR&type=Day School" },
                            { name: "Gurgaon", query: "city=Gurgaon&type=Day School" },
                          ].map((item) => (
                            <li key={item.name}>
                              <Link
                                href={`/discover?${item.query}`}
                                className="text-[0.85rem] text-[#4B5563] hover:text-primary transition-colors block py-0.5"
                                onClick={() => setIsDiscoverOpen(false)}
                              >
                                Schools in {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-4 text-left">
                        <h4 className="text-[0.75rem] font-bold text-muted-foreground tracking-wider uppercase border-b pb-2">Best Schools</h4>
                        <ul className="space-y-2.5">
                          {[
                            { name: "Bangalore", path: "/cities/bangalore" },
                            { name: "Mumbai", path: "/cities/mumbai" },
                            { name: "Pune", path: "/cities/pune" },
                            { name: "Hyderabad", path: "/cities/hyderabad" },
                            { name: "Chennai", path: "/cities/chennai" },
                            { name: "Kolkata", path: "/cities/kolkata" },
                            { name: "Delhi NCR", path: "/cities/delhi-ncr" },
                            { name: "Gurgaon", path: "/cities/gurgaon" },
                          ].map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.path}
                                className="text-[0.85rem] text-[#4B5563] hover:text-primary transition-colors block py-0.5"
                                onClick={() => setIsDiscoverOpen(false)}
                              >
                                Best Schools in {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-4 text-left">
                        <h4 className="text-[0.75rem] font-bold text-muted-foreground tracking-wider uppercase border-b pb-2">Boarding Schools</h4>
                        <ul className="space-y-2.5">
                          {[
                            { name: "Dehradun", query: "city=Dehradun&type=Boarding" },
                            { name: "Mussoorie", query: "city=Mussoorie&type=Boarding" },
                            { name: "Ajmer", query: "city=Ajmer&type=Boarding" },
                            { name: "Shimla", query: "city=Shimla&type=Boarding" },
                            { name: "Pune", query: "city=Pune&type=Boarding" },
                            { name: "Nainital", query: "city=Nainital&type=Boarding" },
                            { name: "Gwalior", query: "city=Gwalior&type=Boarding" },
                            { name: "Solan", query: "city=Solan&type=Boarding" },
                          ].map((item) => (
                            <li key={item.name}>
                              <Link
                                href={`/discover?${item.query}`}
                                className="text-[0.85rem] text-[#4B5563] hover:text-primary transition-colors block py-0.5"
                                onClick={() => setIsDiscoverOpen(false)}
                              >
                                Boarding Schools in {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Column 4 */}
                      <div className="space-y-4 text-left">
                        <h4 className="text-[0.75rem] font-bold text-muted-foreground tracking-wider uppercase border-b pb-2">CBSE & IB Schools</h4>
                        <ul className="space-y-2.5">
                          {[
                            { name: "Bangalore", query: "city=Bangalore&curriculum=CBSE" },
                            { name: "Mumbai", query: "city=Mumbai&curriculum=CBSE" },
                            { name: "Jaipur", query: "city=Jaipur&curriculum=CBSE" },
                            { name: "Delhi NCR", query: "city=Delhi NCR&curriculum=CBSE" },
                            { name: "Gurgaon", query: "city=Gurgaon&curriculum=CBSE" },
                            { name: "Mumbai (IB)", query: "city=Mumbai&curriculum=IB" },
                            { name: "Bangalore (IB)", query: "city=Bangalore&curriculum=IB" },
                            { name: "Delhi NCR (IB)", query: "city=Delhi NCR&curriculum=IB" },
                          ].map((item) => (
                            <li key={item.name}>
                              <Link
                                href={`/discover?${item.query}`}
                                className="text-[0.85rem] text-[#4B5563] hover:text-primary transition-colors block py-0.5"
                                onClick={() => setIsDiscoverOpen(false)}
                              >
                                {item.name.includes("(IB)") ? `IB Schools in ${item.name.replace(" (IB)", "")}` : `CBSE Schools in ${item.name}`}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/compare"
                className="relative px-4 py-2 text-[0.9rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                Compare
                <span className="absolute bottom-1 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
              
              <Link
                href="/free-counselling"
                className="relative px-4 py-2 text-[0.9rem] font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                Guidance
                <span className="absolute bottom-1 left-4 right-4 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {displayName ? (
                <div
                  onMouseEnter={() => setUserMenuOpen(true)}
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-[0.9rem] font-medium text-foreground transition-all duration-300 hover:shadow-sm">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                        <span className="max-w-[140px] truncate">{displayName}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        {userEmail}
                      </div>
                      <DropdownMenuItem onClick={() => router.push("/counselor-connect?tab=history")}
                        className="cursor-pointer">
                        <Video className="h-4 w-4" />
                        See your sessions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/dashboard")}
                        className="cursor-pointer">
                        <Clock className="h-4 w-4" />
                        Recent visits
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <button
                  ref={buttonRef}
                  onClick={() => setAuthDialogOpen(true)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                  }}
                  className="group relative px-6 py-3 text-[0.9rem] font-medium overflow-hidden rounded-full bg-primary text-primary-foreground transition-all duration-300 ease-out hover:shadow-lg hover:shadow-primary/25"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Begin your journey
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_2s_infinite] transition-opacity duration-300" />
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 -mr-2 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden border-t border-border/30 bg-background/98 backdrop-blur-2xl overflow-hidden transition-all duration-500 ${
            isMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col p-8 gap-2">
            {[
              { href: "/", label: "Home" },
              { href: "/discover", label: "Discover" },
              { href: "/compare", label: "Compare" },
              { href: "/free-counselling", label: "Guidance" },
            ].map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-3 text-xl font-serif hover:text-primary transition-colors duration-300"
                style={{ transitionDelay: `${i * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Mobile User / Auth Button */}
            {displayName ? (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    router.push("/counselor-connect?tab=history")
                  }}
                  className="w-full text-center py-4 bg-primary text-primary-foreground rounded-2xl text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                >
                  See your sessions
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    router.push("/dashboard")
                  }}
                  className="w-full text-center py-4 bg-secondary text-foreground rounded-2xl text-base font-medium transition-all duration-300 hover:shadow-lg"
                >
                  Recent visits
                </button>
                <button
                  onClick={async () => {
                    await handleLogout()
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-center py-4 bg-secondary text-foreground rounded-2xl text-base font-medium transition-all duration-300 hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setSearchDialogOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-center py-4 bg-secondary text-foreground rounded-2xl text-base font-medium transition-all duration-300 hover:shadow-lg"
                >
                  Search Schools
                </button>
                <button
                  onClick={() => {
                    setAuthDialogOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full text-center py-4 bg-primary text-primary-foreground rounded-2xl text-base font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                >
                  Begin your journey
                </button>
              </div>
            )}

            
          </nav>
        </div>
      </header>
      
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <SmartSearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} />
    </>
  )
}
