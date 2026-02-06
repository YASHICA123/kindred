"use client"

import { useState } from "react"
import { ChevronDown, BookOpen, Target, Clock, Users } from "lucide-react"

const curriculumSections = [
  {
    id: "ib",
    title: "International Baccalaureate (IB)",
    grades: "Grade 11-12",
    description: "A rigorous, internationally recognized program that develops inquiring, knowledgeable learners.",
    subjects: ["Theory of Knowledge", "Extended Essay", "CAS", "6 Subject Groups"],
    features: [
      { icon: Target, text: "Inquiry-based learning" },
      { icon: Users, text: "Collaborative projects" },
      { icon: Clock, text: "2-year program" },
    ],
  },
  {
    id: "cbse",
    title: "CBSE Curriculum",
    grades: "Grade 1-10",
    description:
      "The national curriculum emphasizing foundational skills with a balanced approach to academics and co-curricular activities.",
    subjects: ["English", "Mathematics", "Science", "Social Studies", "Hindi", "Third Language"],
    features: [
      { icon: BookOpen, text: "Comprehensive syllabus" },
      { icon: Target, text: "Board examination prep" },
      { icon: Users, text: "Activity-based learning" },
    ],
  },
  {
    id: "early-years",
    title: "Early Years Program",
    grades: "Nursery - KG",
    description: "A play-based, developmental approach that builds social, emotional, and cognitive foundations.",
    subjects: ["Language & Literacy", "Numeracy", "Creative Arts", "Physical Development", "Discovery"],
    features: [
      { icon: Target, text: "Play-based learning" },
      { icon: Users, text: "1:8 teacher ratio" },
      { icon: Clock, text: "Flexible pacing" },
    ],
  },
]

export function SchoolCurriculum() {
  const [expandedSection, setExpandedSection] = useState<string>("ib")

  return (
    <section className="py-12 lg:py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Academic Programs</span>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mt-2">Curriculum & Learning</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Multiple pathways designed to meet the unique needs and aspirations of every learner.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {curriculumSections.map((section) => (
            <div key={section.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? "" : section.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-sm text-primary font-medium">{section.grades}</span>
                  <h3 className="font-serif text-xl mt-1">{section.title}</h3>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedSection === section.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSection === section.id && (
                <div className="px-6 pb-6 border-t border-border pt-6">
                  <p className="text-muted-foreground leading-relaxed mb-6">{section.description}</p>

                  {/* Features */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {section.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                        <feature.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subjects */}
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Core Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                      {section.subjects.map((subject) => (
                        <span key={subject} className="px-3 py-1.5 bg-primary/5 text-primary text-sm rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
