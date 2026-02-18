"use client"

import { Calendar, FileText, Clock, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const admissionInfo = {
  classes: [
    {
      classLevel: "Nursery - Grade 3",
      ageRange: "3-8 years",
      openingDate: "January 15, 2024",
      applicationDeadline: "November 30, 2023",
      selectionProcess: [
        "Parent-school interaction",
        "Child observation & assessment",
        "Previous school records (if applicable)",
      ],
      documentsRequired: [
        "Birth certificate",
        "Address proof",
        "Parent ID proof",
        "Previous school report card (if applicable)",
        "Medical records",
      ],
    },
    {
      classLevel: "Grade 4 - 8",
      ageRange: "9-13 years",
      openingDate: "January 15, 2024",
      applicationDeadline: "November 30, 2023",
      selectionProcess: [
        "Entrance exam (Mathematics, English, Reasoning)",
        "Personal interview with child and parents",
        "Assessment of previous academic performance",
      ],
      documentsRequired: [
        "Birth certificate",
        "Address proof",
        "Parent ID proof",
        "Last 2 years report cards",
        "Transfer certificate from previous school",
        "Medical records",
      ],
    },
    {
      classLevel: "Grade 9 - 10",
      ageRange: "14-15 years",
      openingDate: "January 15, 2024",
      applicationDeadline: "November 30, 2023",
      selectionProcess: [
        "Entrance exam (Mathematics, English, Science, Social Studies)",
        "Personal interview",
        "Academic achievement evaluation",
      ],
      documentsRequired: [
        "Birth certificate",
        "Address proof",
        "Parent ID proof",
        "Last 2 years report cards",
        "Transfer certificate",
        "Medical records",
      ],
    },
    {
      classLevel: "Grade 11 - 12 (IB Program)",
      ageRange: "16-18 years",
      openingDate: "February 1, 2024",
      applicationDeadline: "December 15, 2023",
      selectionProcess: [
        "Entrance exam (Advanced level)",
        "Subject selection interview",
        "Academic potential assessment",
      ],
      documentsRequired: [
        "Mark sheets from last 2 years",
        "Transfer certificate",
        "ID proof",
        "IB syllabus comprehension test results",
        "Medical records",
      ],
    },
  ],
  feeStructure: {
    description: "Fee structure varies by class level. Payment can be made in monthly or annual installments.",
    note: "Scholarships and financial aid available based on merit and need.",
  },
}

export function SchoolAdmission() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Admissions</span>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mt-2">Admission Process & Requirements</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            We welcome applications from students who demonstrate academic potential and align with our values of holistic development.
          </p>
        </div>

        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Applications are open for the academic year 2024-25. Submit your application before the respective deadline for your grade level.
          </AlertDescription>
        </Alert>

        <div className="space-y-12">
          {admissionInfo.classes.map((classInfo, index) => (
            <div key={index} className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{classInfo.classLevel}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Age: {classInfo.ageRange}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Application Opens
                      </p>
                      <p className="font-semibold text-primary mt-1">{classInfo.openingDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                        Deadline
                      </p>
                      <p className="font-semibold text-red-600 mt-1">{classInfo.applicationDeadline}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 grid md:grid-cols-2 gap-8">
                {/* Selection Process */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    Selection Process
                  </h4>
                  <ul className="space-y-3">
                    {classInfo.selectionProcess.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    Documents Required
                  </h4>
                  <ul className="space-y-3">
                    {classInfo.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fee Note */}
        <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5">
          <h3 className="text-lg font-semibold mb-2">Fee Information</h3>
          <p className="text-muted-foreground mb-3">{admissionInfo.feeStructure.description}</p>
          <p className="text-sm font-medium text-primary">{admissionInfo.feeStructure.note}</p>
        </div>
      </div>
    </section>
  )
}
