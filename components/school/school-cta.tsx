import Link from "next/link"
import { ArrowRight, Calendar, FileText, Phone } from "lucide-react"

export function SchoolCTA() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-primary rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-background rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-background rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl text-primary-foreground">
                Ready to take the next step?
              </h2>
              <p className="text-primary-foreground/80 mt-4 text-lg">
                We'd love to show you around our campus and help you understand if Heritage is the right fit for your
                family.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Link
                href="#schedule"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-background text-foreground rounded-full font-medium hover:bg-background/90 transition-colors"
              >
                <Calendar className="h-5 w-5" />
                Schedule a Visit
              </Link>
              <Link
                href="#apply"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary-foreground/20 text-primary-foreground rounded-full font-medium hover:bg-primary-foreground/30 transition-colors border border-primary-foreground/30"
              >
                <FileText className="h-5 w-5" />
                Apply Now
              </Link>
            </div>
          </div>

          {/* Contact options */}
          <div className="relative z-10 mt-10 pt-8 border-t border-primary-foreground/20 grid sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary-foreground/70" />
              <div>
                <p className="text-sm text-primary-foreground/70">Admissions Office</p>
                <p className="font-medium text-primary-foreground">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary-foreground/70" />
              <div>
                <p className="text-sm text-primary-foreground/70">Open House</p>
                <p className="font-medium text-primary-foreground">Every Saturday, 10 AM</p>
              </div>
            </div>
            <Link
              href="/compare?schools=1"
              className="flex items-center gap-2 text-primary-foreground font-medium hover:gap-3 transition-all"
            >
              Compare with other schools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
