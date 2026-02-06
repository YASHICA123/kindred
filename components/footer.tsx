"use client"

import Link from "next/link"
import { Instagram, Linkedin, Twitter, Sparkles, ArrowUpRight } from "lucide-react"

const footerLinks = {
  discover: [
    { name: "All Schools", href: "/discover" },
    { name: "By City", href: "/discover?view=cities" },
    { name: "By Philosophy", href: "/discover?view=curriculum" },
    { name: "Compare Schools", href: "/compare" },
  ],
  resources: [
    { name: "Parent Guides", href: "#guides" },
    { name: "Admission Help", href: "#admission" },
    { name: "School Visits", href: "#visits" },
    { name: "FAQs", href: "#faqs" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Partner with Us", href: "#partner" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/30">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        {/* Top section - CTA */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-16 border-b border-border/30">
          <div>
            <h3 className="font-serif text-2xl lg:text-3xl mb-2">Ready to find the perfect school?</h3>
            <p className="text-muted-foreground">Start your journey with Kindred today.</p>
          </div>
          <Link
            href="/discover"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
          >
            Get started
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Links grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 py-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-serif text-2xl">Kindred</span>
            </Link>
            <p className="mt-5 text-muted-foreground max-w-sm leading-relaxed">
              A thoughtful approach to school discovery. Helping families find educational environments where children
              truly belong.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="p-2.5 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium mb-5 text-foreground">Discover</h4>
            <ul className="space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-5 text-foreground">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-5 text-foreground">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 link-underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-muted-foreground">2026 Kindred. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="#privacy" className="hover:text-foreground transition-colors link-underline">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-foreground transition-colors link-underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
