"use client"

import { IndianRupee, Check, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const feeData = [
  {
    classLevel: "Nursery - KG",
    semester: 2,
    tuitionFee: "2,50,000",
    registrationFee: "15,000",
    developmentFee: "50,000",
    transportFee: "60,000",
    mealFee: "24,000",
    total: "6,98,000",
    description: "Annual tuition with semester structure",
  },
  {
    classLevel: "Grade 1 - 3",
    semester: 2,
    tuitionFee: "3,00,000",
    registrationFee: "15,000",
    developmentFee: "75,000",
    transportFee: "72,000",
    mealFee: "30,000",
    total: "8,67,000",
    description: "Annual tuition with semester structure",
  },
  {
    classLevel: "Grade 4 - 5",
    semester: 2,
    tuitionFee: "3,75,000",
    registrationFee: "20,000",
    developmentFee: "1,00,000",
    transportFee: "72,000",
    mealFee: "30,000",
    total: "10,97,000",
    description: "Annual tuition with semester structure",
  },
  {
    classLevel: "Grade 6 - 8",
    semester: 2,
    tuitionFee: "4,25,000",
    registrationFee: "25,000",
    developmentFee: "1,25,000",
    transportFee: "84,000",
    mealFee: "36,000",
    total: "12,95,000",
    description: "Annual tuition with semester structure",
  },
  {
    classLevel: "Grade 9 - 10",
    semester: 2,
    tuitionFee: "5,00,000",
    registrationFee: "25,000",
    developmentFee: "1,50,000",
    transportFee: "84,000",
    mealFee: "36,000",
    total: "14,95,000",
    description: "Annual tuition with semester structure",
  },
  {
    classLevel: "Grade 11 - 12 (IB)",
    semester: 2,
    tuitionFee: "6,50,000",
    registrationFee: "30,000",
    developmentFee: "2,00,000",
    transportFee: "84,000",
    mealFee: "36,000",
    total: "18,00,000",
    description: "Annual tuition - International Baccalaureate Program",
  },
]

const additionalCharges = [
  { item: "Technology Fee (Annual)", amount: "5,000", applies: "All classes" },
  { item: "Sports Equipment & Coaching", amount: "Included", applies: "All classes" },
  { item: "Field Trips & Excursions", amount: "Included", applies: "All classes" },
  { item: "Library Fee", amount: "2,000", applies: "Grade 1+", optional: true },
  { item: "Arts & Music Classes", amount: "Included", applies: "All classes" },
  { item: "Special Coaching (Optional)", amount: "10,000-20,000", applies: "As needed", optional: true },
]

const paymentOptions = [
  {
    name: "Annual Payment",
    description: "Pay full fees at the beginning of the academic year",
    discount: "2% discount",
  },
  {
    name: "Semester Payment",
    description: "Divided into 2 installments (April & October)",
    discount: "No discount",
  },
  {
    name: "Quarterly Payment",
    description: "Divided into 4 installments (Apr, Jul, Oct, Jan)",
    discount: "1% processing fee",
  },
  {
    name: "Monthly Payment",
    description: "Monthly installments throughout the academic year",
    discount: "2% processing fee",
  },
]

export function SchoolFees() {
  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-14">
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Financial Information</span>
          <h2 className="font-serif text-2xl lg:text-3xl xl:text-4xl mt-2">Fee Structure</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Transparent and flexible payment options for all families. Scholarships and financial aid available based on merit and need.
          </p>
        </div>

        <Alert className="mb-8 border-primary/20 bg-primary/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            All fees are subject to annual review. Fee increase, if any, will be notified in advance. Admission fees and development fees are non-refundable once enrollment is confirmed.
          </AlertDescription>
        </Alert>

        {/* Fee Table */}
        <div className="mb-12 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary/5 border-b-2 border-border">
                <th className="px-6 py-4 text-left font-semibold text-foreground">Class Level</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Tuition Fee</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Registration</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Development</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Transport</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Meals</th>
                <th className="px-6 py-4 text-right font-semibold text-primary">Annual Total</th>
              </tr>
            </thead>
            <tbody>
              {feeData.map((classData, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-primary/2 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{classData.classLevel}</p>
                      <p className="text-xs text-muted-foreground mt-1">{classData.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">₹ {classData.tuitionFee}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">₹ {classData.registrationFee}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">₹ {classData.developmentFee}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">₹ {classData.transportFee}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">₹ {classData.mealFee}</td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-semibold text-primary">₹ {classData.total}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Additional Charges */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              Additional Charges & Inclusions
            </h3>
            <div className="space-y-4">
              {additionalCharges.map((charge, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/2 transition-colors">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{charge.item}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {charge.applies} {charge.optional && <span className="text-yellow-600 font-medium">(Optional)</span>}
                    </p>
                  </div>
                  <p className="font-semibold text-primary flex-shrink-0">{charge.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              Payment Options
            </h3>
            <div className="space-y-4">
              {paymentOptions.map((option, idx) => (
                <div key={idx} className="p-5 rounded-xl border-2 border-border hover:border-primary/50 transition-colors bg-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{option.name}</p>
                      <p className="text-sm text-muted-foreground mt-2">{option.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm">
                    <span className={option.discount.includes("discount") ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {option.discount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="p-8 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <h3 className="text-lg font-semibold mb-6">Important Notes</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                ✓
              </span>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Scholarships Available:</span> Merit-based and need-based scholarships are available. Eligible students can apply during the admission process.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                ✓
              </span>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Financial Aid:</span> For families facing financial hardship, we offer need-based financial assistance and payment plan flexibility.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                ✓
              </span>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Fee Concessions:</span> Sibling discounts of 10% available for the second and subsequent children.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                ✓
              </span>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Late Fee Policy:</span> A fine of ₹500 is charged for overdue fee payments. Automatic reminders are sent 10 days before the due date.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Have questions about the fee structure?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:admissions@school.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Admissions
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
            >
              Download Fee Details
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
