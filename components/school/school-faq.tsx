"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    category: "Admissions",
    questions: [
      {
        q: "What is the admission process?",
        a: "The admission process typically involves submitting an application form, entrance examination (for certain classes), personal interview with the child and parents, and submission of required documents. The exact process varies by class level.",
      },
      {
        q: "When are applications open?",
        a: "Applications for the next academic year generally open in September-October of the previous year. The exact dates vary by class level. We recommend visiting our admissions office for current timelines.",
      },
      {
        q: "Is there an entrance exam?",
        a: "Yes, entrance exams are conducted for Grade 4 and above. The exam assesses knowledge in Mathematics, English, and reasoning skills. For IB program applicants, additional subject-specific tests may be required.",
      },
      {
        q: "Do you offer scholarships?",
        a: "Yes, we offer merit-based scholarships and financial aid based on both academic excellence and financial need. Interested candidates must apply separately for scholarship consideration.",
      },
    ],
  },
  {
    category: "Academics",
    questions: [
      {
        q: "What curriculum do you follow?",
        a: "We follow a hybrid approach combining CBSE curriculum for Classes 1-10 and the International Baccalaureate (IB) program for Classes 11-12. This provides students with both national and international perspectives.",
      },
      {
        q: "What are the learning support options?",
        a: "We offer remedial classes, tutoring sessions, dyslexia support, and personalized learning plans for students who need additional academic support. Our Learning Support Coordinator works closely with students and parents.",
      },
      {
        q: "How are students assessed?",
        a: "Assessment is continuous and comprehensive, combining formative assessments (classwork, projects, quizzes) and summative assessments (term exams). We use portfolio-based evaluation alongside traditional exams.",
      },
      {
        q: "What is the class size?",
        a: "Early Years classes have a maximum of 20 students with a 1:8 teacher-aide ratio. Primary classes (Grade 1-5) have 25-30 students per class. Secondary classes have 30-35 students per class.",
      },
    ],
  },
  {
    category: "Infrastructure & Facilities",
    questions: [
      {
        q: "What facilities does the school have?",
        a: "Our school features state-of-the-art science labs, computer labs, a 20,000+ book library, FIFA-standard sports field, Olympic-size swimming pool, modern auditorium, music and art studios, and smart classrooms with latest educational technology.",
      },
      {
        q: "Is the school environmentally friendly?",
        a: "Yes, sustainability is core to our operations. We have rainwater harvesting systems, solar panels, waste management programs, and a green campus with organic gardens where students learn about environmental conservation.",
      },
      {
        q: "What is the school's safety policy?",
        a: "Student safety is paramount. We have CCTV surveillance, trained security staff, emergency response procedures, regular safety drills, and secure entry/exit systems. All staff members undergo background checks.",
      },
    ],
  },
  {
    category: "Co-curricular Activities",
    questions: [
      {
        q: "What sports and activities are available?",
        a: "We offer a wide range of activities including cricket, football, badminton, swimming, martial arts, music, dance, debate, theatre, coding club, robotics, journalism, and environmental club. Participation in at least one co-curricular activity is encouraged.",
      },
      {
        q: "Are there exchange programs?",
        a: "Yes, we have partnerships with international schools for student exchange programs. These typically occur in Grades 9-12 and provide valuable cross-cultural learning experiences.",
      },
      {
        q: "How many field trips are conducted?",
        a: "Field trips vary by class level and curriculum requirements. Early Years classes go on monthly learning walks, primary students have 3-4 educational trips per year, and secondary students have subject-specific field studies.",
      },
    ],
  },
  {
    category: "Parents & Communication",
    questions: [
      {
        q: "How do you communicate with parents?",
        a: "We maintain regular communication through the school app, monthly newsletters, parent-teacher meetings, email updates, and annual parent-school meetings. Parents have access to their child's academic progress in real-time.",
      },
      {
        q: "Can parents visit the campus?",
        a: "Yes, we have scheduled visiting hours and welcome parents to visit classrooms and facilities. School tours can be arranged by contacting the admissions office. We also host regular parent volunteer programs.",
      },
      {
        q: "Is there a parent association?",
        a: "Yes, our dynamic Parent Association (PTA) organizes events, supports school initiatives, and provides a platform for parent engagement. Regular meetings and activities are scheduled throughout the academic year.",
      },
    ],
  },
  {
    category: "Transportation & Logistics",
    questions: [
      {
        q: "Is school transportation available?",
        a: "Yes, we provide safe and reliable transportation with GPS-enabled buses, trained drivers, and attendants. Parents can track bus locations in real-time through our mobile app.",
      },
      {
        q: "What are the meal arrangements?",
        a: "We provide balanced nutritious meals prepared in-house following national food safety standards. Vegetarian and dietary-specific meal options are available. A copy of the monthly menu is shared with parents.",
      },
      {
        q: "What is the school hours?",
        a: "School hours vary by class: Early Years (9:00 AM - 1:00 PM), Primary (9:00 AM - 3:30 PM), Secondary (9:00 AM - 4:00 PM). After-school programs extend till 5:30 PM.",
      },
    ],
  },
]

export function SchoolFAQ() {
  const [expandedId, setExpandedId] = useState<string>(`0-0`)

  const toggleFAQ = (categoryIdx: number, questionIdx: number) => {
    const id = `${categoryIdx}-${questionIdx}`
    setExpandedId(expandedId === id ? "" : id)
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Questions?</span>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mt-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Find answers to common questions about our school. Can't find what you're looking for? Contact our admissions office.
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((category, categoryIdx) => (
            <div key={categoryIdx}>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-primary" />
                {category.category}
              </h3>

              <div className="space-y-4">
                {category.questions.map((faq, questionIdx) => {
                  const id = `${categoryIdx}-${questionIdx}`
                  const isExpanded = expandedId === id

                  return (
                    <button
                      key={id}
                      onClick={() => toggleFAQ(categoryIdx, questionIdx)}
                      className="w-full text-left group"
                    >
                      <div className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors duration-200">
                        <div className="flex items-start justify-between gap-4">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {faq.q}
                          </h4>
                          <ChevronDown
                            className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/5 to-transparent text-center">
          <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Our admissions team is always happy to help. Reach out to us directly for personalized responses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:admissions@school.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+911234567890"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
