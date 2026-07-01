import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/providers/auth-provider"
import { SavedSchoolsProvider } from "@/hooks/use-saved-schools"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kindred.school'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kindred - Where Every Child Belongs",
  description:
    "An emotionally intelligent guide to discovering the perfect school. Find where your child truly belongs through thoughtful insights and meaningful connections.",
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico?v=3" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <SavedSchoolsProvider>
            {children}
            <Analytics />
          </SavedSchoolsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
