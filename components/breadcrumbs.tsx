"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export interface BreadcrumbTrailItem {
  label: string
  href?: string
}

interface BreadcrumbTrailProps {
  items: BreadcrumbTrailItem[]
}

export function BreadcrumbTrail({ items }: BreadcrumbTrailProps) {
  const pathname = usePathname()
  
  // Base URL for schema mapping. Using NEXT_PUBLIC_SITE_URL or defaulting to a fallback.
  const baseUrl = (typeof window !== "undefined" ? window.location.origin : "") || "https://kindred.school"

  // Construct JSON-LD Schema markup
  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `${baseUrl}${item.href}` : `${baseUrl}${pathname || ""}`,
      })),
    ],
  }

  return (
    <div className="w-full" data-testid="breadcrumb-trail">
      {/* Dynamic JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />
      
      <Breadcrumb>
        <BreadcrumbList className="text-[#8a96aa] font-semibold text-[13px] gap-1.5">
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="text-[#8a96aa] hover:text-primary transition-colors font-semibold">
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <React.Fragment key={index}>
                <BreadcrumbSeparator className="text-[#8a96aa]">›</BreadcrumbSeparator>
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="text-[#0f1b33] font-semibold">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild className="text-[#8a96aa] hover:text-primary transition-colors font-semibold">
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
