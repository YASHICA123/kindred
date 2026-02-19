"use client"

import { useState } from "react"
import { ChevronDown, SlidersHorizontal, X } from "lucide-react"

type Props = {
  selectedFilters: Record<string, string[]>
  onToggle: (category: string, option: string) => void
  onClear?: () => void
  cityOptions?: string[]
  stateOptions?: string[]
}

export const filterCategories = [
  {
    name: "Board",
    options: ["CBSE", "ICSE", "IB", "Cambridge", "State Board", "Montessori"],
  },
  {
    name: "Grade Level",
    options: ["Pre-Primary", "Primary (1-5)", "Middle (6-8)", "Secondary (9-10)", "Senior Secondary (11-12)"],
  },
  {
    name: "School Type",
    options: ["Co-educational", "Boys Only", "Girls Only", "Day School", "Boarding"],
  },
  {
    name: "Facilities",
    options: [
      "Sports Complex",
      "Swimming Pool",
      "Science Labs",
      "Library",
      "Arts Studio",
      "Music Room",
      "Counselling Cell",
      "Computer Lab",
      "Auditorium",
      "Cafeteria",
      "Health Center",
      "Gymnasium",
      "Playground",
      "Basketball Court",
      "Football Field",
      "Tennis Court",
      "Badminton Court",
      "Cricket Pitch",
      "Indoor Games",
      "Dance Studio",
      "Drama Theatre",
      "Debate Hall",
      "Robotics Lab",
      "Art Gallery",
      "Science Club",
      "Mathematics Lab",
      "Language Lab",
      "Digital Library",
      "Yoga Center",
      "Garden",
    ],
  },
  {
    name: "Distance",
    options: ["Within 1 km", "1-3 km", "3-5 km", "5-10 km", "10+ km"],
  },
  {
    name: "State",
    options: [
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi",
      "Jammu and Kashmir",
      "Ladakh",
      "Lakshadweep",
      "Puducherry",
    ],
  },
  {
    name: "Fee Range",
    options: ["Under ₹50,000", "₹50,000 - ₹1 Lakh", "₹1 - 2 Lakh", "₹2 - 5 Lakh", "Above ₹5 Lakh"],
  },
  {
    name: "City",
    options: [
      "Agra",
      "Ahmedabad",
      "Ajmer",
      "Aligarh",
      "Amaravati",
      "Amritsar",
      "Aurangabad",
      "Bareilly",
      "Belgaum",
      "Bengaluru",
      "Bhopal",
      "Bhubaneswar",
      "Bikaner",
      "Chandigarh",
      "Chennai",
      "Coimbatore",
      "Dehradun",
      "Dhanbad",
      "Durgapur",
      "Erode",
      "Faridabad",
      "Firozabad",
      "Ghaziabad",
      "Gorakhpur",
      "Gurgaon",
      "Guwahati",
      "Gwalior",
      "Hubli",
      "Hyderabad",
      "Indore",
      "Jabalpur",
      "Jaipur",
      "Jalandhar",
      "Jammu",
      "Jamshedpur",
      "Jodhpur",
      "Kalyan",
      "Kanpur",
      "Kochi",
      "Kolhapur",
      "Kolkata",
      "Kota",
      "Kurnool",
      "Lucknow",
      "Ludhiana",
      "Madurai",
      "Malda",
      "Meerut",
      "Moradabad",
      "Mumbai",
      "Mysore",
      "Nagpur",
      "Nanded",
      "Nashik",
      "Navi Mumbai",
      "Noida",
      "Patna",
      "Pune",
      "Prayagraj",
      "Raipur",
      "Rajkot",
      "Ranchi",
      "Rourkela",
      "Sagar",
      "Salem",
      "Sambalpur",
      "Sangli",
      "Thane",
      "Thiruvananthapuram",
      "Tiruchirappalli",
      "Tiruppur",
      "Udaipur",
      "Ujjain",
      "Vadodara",
      "Varanasi",
      "Vellore",
      "Vijayawada",
      "Visakhapatnam",
      "Warangal",
      "Yamunanagar",
    ],
  },
]

export function DiscoverFilters({ selectedFilters, onToggle, onClear, cityOptions, stateOptions }: Props) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Board", "Grade Level", "Fee Range", "City"])
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [cityQuery, setCityQuery] = useState("")
  const [stateQuery, setStateQuery] = useState("")

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => (prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]))
  }

  const toggleFilter = (category: string, option: string) => {
    onToggle(category, option)
  }

  const activeFilterCount = Object.values(selectedFilters || {}).flat().length

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <span className="font-medium">Filters</span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={() => {
              if (onClear) onClear()
              setCityQuery("")
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([category, options]) =>
              options.map((option) => (
                <button
                  key={`${category}-${option}`}
                  onClick={() => toggleFilter(category, option)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 transition-colors"
                >
                  {option}
                  <X className="h-3 w-3" />
                </button>
              )),
            )}
          </div>
        )}

      {/* Filter categories */}
      <div className="space-y-4">
        {filterCategories.map((category) => (
          <div key={category.name} className="border-b border-border pb-4">
            <button
              onClick={() => toggleCategory(category.name)}
              className="flex items-center justify-between w-full py-2 text-left"
            >
              <span className="font-medium text-sm">{category.name}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  expandedCategories.includes(category.name) ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCategories.includes(category.name) && (
              <div className="mt-3 space-y-2">
                {category.name === "City" && (
                  <div className="pb-2">
                    <input
                      type="search"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                      placeholder="Search cities..."
                      className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                )}

                {category.name === "State" && (
                  <div className="pb-2">
                    <input
                      type="search"
                      value={stateQuery}
                      onChange={(e) => setStateQuery(e.target.value)}
                      placeholder="Search states..."
                      className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none"
                    />
                  </div>
                )}

                {(
                  category.name === "City"
                    ? (cityOptions ?? category.options)
                    : category.name === "State"
                    ? (stateOptions ?? category.options)
                    : category.options
                )
                  .filter((option) => {
                    if (category.name === "City" && cityQuery) return option.toLowerCase().includes(cityQuery.toLowerCase())
                    if (category.name === "State" && stateQuery) return option.toLowerCase().includes(stateQuery.toLowerCase())
                    return true
                  })
                  .map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleFilter(category.name, option)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleFilter(category.name, option)
                      }
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedFilters[category.name]?.includes(option)
                          ? "bg-primary border-primary"
                          : "border-border group-hover:border-primary/50"
                      }`}
                    >
                      {selectedFilters[category.name]?.includes(option) && (
                        <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors ${
                        selectedFilters[category.name]?.includes(option)
                          ? "text-foreground font-medium"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-lg"
      >
        <SlidersHorizontal className="h-5 w-5" />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-primary-foreground text-primary text-xs rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile filter drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setIsMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-secondary rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <FilterContent />
            <button
              onClick={() => setIsMobileOpen(false)}
              className="w-full mt-6 py-3 bg-primary text-primary-foreground rounded-full font-medium"
            >
              Show Results
            </button>
          </div>
        </div>
      )}

      {/* Desktop filters */}
      <div className="hidden lg:block sticky top-24 bg-card rounded-2xl p-6 border border-border">
        <FilterContent />
      </div>
    </>
  )
}
