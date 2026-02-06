const facilities = [
  {
    category: "Academics",
    items: [
      { name: "Science Labs", count: "6", image: "/diverse-students-science-lab-modern-equipment.jpg" },
      { name: "Computer Labs", count: "4", image: "/school-computer-lab-modern-technology.jpg" },
      { name: "Library", count: "20,000+ books", image: "/school-library-modern-reading-area-students.jpg" },
    ],
  },
  {
    category: "Sports",
    items: [
      { name: "Football Field", count: "FIFA Standard", image: "/school-sports-field-aerial-view.jpg" },
      { name: "Swimming Pool", count: "Olympic Size", image: "/school-swimming-pool-indoor-facility.jpg" },
      { name: "Indoor Courts", count: "3", image: "/school-indoor-sports-basketball-court.jpg" },
    ],
  },
  {
    category: "Arts & Culture",
    items: [
      { name: "Auditorium", count: "800 seats", image: "/school-auditorium-performing-arts-stage.jpg" },
      { name: "Music Rooms", count: "5", image: "/school-music-room-instruments-studio.jpg" },
      { name: "Art Studio", count: "3", image: "/school-art-studio-creative-space.jpg" },
    ],
  },
]

export function SchoolFacilities() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Infrastructure</span>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mt-2">World-Class Facilities</h2>
        </div>

        <div className="space-y-12">
          {facilities.map((category) => (
            <div key={category.category}>
              <h3 className="font-serif text-xl mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-primary" />
                {category.category}
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <div key={item.name} className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h4 className="font-medium text-background">{item.name}</h4>
                      <p className="text-sm text-background/70 mt-1">{item.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
