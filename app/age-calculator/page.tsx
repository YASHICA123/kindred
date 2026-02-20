"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calculator, Calendar, Target, ArrowRight, Save, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { saveAgeCalculation, getAgeCalculation } from "@/lib/firebase-data"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

const gradeStructure = [
  { grade: "Nursery", minAge: 2.5, maxAge: 3.5 },
  { grade: "LKG", minAge: 3.5, maxAge: 4.5 },
  { grade: "UKG", minAge: 4.5, maxAge: 5.5 },
  { grade: "Grade 1", minAge: 5.5, maxAge: 6.5 },
  { grade: "Grade 2", minAge: 6.5, maxAge: 7.5 },
  { grade: "Grade 3", minAge: 7.5, maxAge: 8.5 },
  { grade: "Grade 4", minAge: 8.5, maxAge: 9.5 },
  { grade: "Grade 5", minAge: 9.5, maxAge: 10.5 },
  { grade: "Grade 6", minAge: 10.5, maxAge: 11.5 },
  { grade: "Grade 7", minAge: 11.5, maxAge: 12.5 },
  { grade: "Grade 8", minAge: 12.5, maxAge: 13.5 },
  { grade: "Grade 9", minAge: 13.5, maxAge: 14.5 },
  { grade: "Grade 10", minAge: 14.5, maxAge: 15.5 },
  { grade: "Grade 11", minAge: 15.5, maxAge: 16.5 },
  { grade: "Grade 12", minAge: 16.5, maxAge: 17.5 },
]

export default function AgeCalculatorPage() {
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [admissionYear, setAdmissionYear] = useState(new Date().getFullYear().toString())
  const [user, setUser] = useState<any>(null)
  const [saveMessage, setSaveMessage] = useState("")

  // Load from Firestore on mount
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        try {
          const saved = await getAgeCalculation()
          if (saved) {
            setDateOfBirth(saved.dateOfBirth)
            setAdmissionYear(saved.admissionYear)
          }
        } catch (error) {
          console.error("Error loading age calculation:", error)
        }
      }
    })

    return () => unsubscribeAuth()
  }, [])

  const handleSave = async () => {
    if (!user) {
      setSaveMessage("Please log in to save your results")
      return
    }

    if (!dateOfBirth) {
      setSaveMessage("Please enter a date of birth first")
      return
    }

    try {
      await saveAgeCalculation({
        dateOfBirth,
        admissionYear,
        currentAge: calculations.currentAge,
        admissionAge: calculations.admissionAge,
        admissionAgeDecimal: calculations.admissionAgeDecimal || "0",
        eligibleGrades: calculations.eligibleGrades,
      })
      setSaveMessage("✅ Calculation saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("❌ Error saving calculation. Please try again.")
      console.error("Save error:", error)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const calculations = useMemo(() => {
    if (!dateOfBirth) {
      return {
        currentAge: null,
        admissionAge: null,
        eligibleGrades: [],
      }
    }

    const dob = new Date(dateOfBirth)
    const today = new Date()
    const admissionDate = new Date(`${admissionYear}-04-01`)

    // Calculate current age
    let currentAge = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      currentAge--
    }

    // Calculate age at admission
    let admissionAge = admissionDate.getFullYear() - dob.getFullYear()
    const admissionMonthDiff = admissionDate.getMonth() - dob.getMonth()
    if (
      admissionMonthDiff < 0 ||
      (admissionMonthDiff === 0 && admissionDate.getDate() < dob.getDate())
    ) {
      admissionAge--
    }

    const admissionAgeDecimal =
      admissionAge +
      (admissionDate.getMonth() - dob.getMonth() + monthDiff) / 12

    // Find eligible grades
    const eligibleGrades = gradeStructure.filter(
      (grade) => admissionAgeDecimal >= grade.minAge && admissionAgeDecimal <= grade.maxAge
    )

    return {
      currentAge: currentAge,
      admissionAge: admissionAge,
      admissionAgeDecimal: admissionAgeDecimal.toFixed(1),
      eligibleGrades,
    }
  }, [dateOfBirth, admissionYear])

  const getPossibleGrades = () => {
    if (!dateOfBirth) return []
    const ageDecimal = parseFloat(calculations.admissionAgeDecimal || "0")
    return gradeStructure.filter(
      (grade) => ageDecimal >= grade.minAge - 0.5 && ageDecimal <= grade.maxAge + 0.5
    )
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary">Admission Planning</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            Age Eligibility Calculator
          </h1>
          <p className="text-xl text-muted-foreground">
            Find out which class your child is eligible for and plan their admission accordingly
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-card rounded-3xl p-8 lg:p-10 border">
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Date of Birth Input */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Child's Date of Birth
                  </span>
                </label>
                <Input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Admission Year Input */}
              <div>
                <label className="block text-sm font-semibold mb-3">
                  <span className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Admission Year (April)
                  </span>
                </label>
                <select
                  value={admissionYear}
                  onChange={(e) => setAdmissionYear(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Results */}
            {dateOfBirth && (
              <div className="space-y-8">
                {/* Age Information */}
                <div className="grid md:grid-cols-2 gap-6 pb-8 border-b">
                  <div className="bg-secondary/50 rounded-2xl p-6">
                    <p className="text-muted-foreground text-sm mb-2">Current Age</p>
                    <p className="font-serif text-4xl font-bold text-primary">
                      {calculations.currentAge} years
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-2xl p-6">
                    <p className="text-muted-foreground text-sm mb-2">
                      Age in April {admissionYear}
                    </p>
                    <p className="font-serif text-4xl font-bold text-primary">
                      {calculations.admissionAge} years{" "}
                      <span className="text-2xl">({calculations.admissionAgeDecimal} years)</span>
                    </p>
                  </div>
                </div>

                {/* Eligible and Nearest Grades */}
                <div className="space-y-6">
                  {calculations.eligibleGrades.length > 0 ? (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Eligible Grade(s)</h3>
                        <div className="flex flex-wrap gap-3">
                          {calculations.eligibleGrades.map((grade) => (
                            <div
                              key={grade.grade}
                              className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-full"
                            >
                              <span className="font-semibold text-primary">{grade.grade}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Nearest Eligible Grades</h3>
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                          <p className="text-amber-900 mb-4">
                            Your child doesn't strictly fit the standard age criteria, but these grades are closest:
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {getPossibleGrades().map((grade) => (
                              <div
                                key={grade.grade}
                                className="px-6 py-3 bg-amber-100/50 border border-amber-200 rounded-full"
                              >
                                <span className="font-semibold text-amber-900">{grade.grade}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-amber-800 mt-4">
                            Note: Please check with the school for flexible age criteria or special exceptions.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Grade Structure Table */}
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-semibold mb-4">Class-wise Age Criteria</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold">Grade</th>
                            <th className="text-left py-3 px-4 font-semibold">Minimum Age</th>
                            <th className="text-left py-3 px-4 font-semibold">Maximum Age</th>
                            <th className="text-left py-3 px-4 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gradeStructure.map((grade) => {
                            const admissionAge = parseFloat(
                              calculations.admissionAgeDecimal || "0"
                            )
                            const isEligible =
                              admissionAge >= grade.minAge && admissionAge <= grade.maxAge
                            const isNear =
                              admissionAge >= grade.minAge - 0.5 &&
                              admissionAge <= grade.maxAge + 0.5

                            return (
                              <tr
                                key={grade.grade}
                                className={`border-b ${
                                  isEligible
                                    ? "bg-primary/5"
                                    : isNear
                                    ? "bg-amber-50/50"
                                    : ""
                                }`}
                              >
                                <td className="py-3 px-4 font-medium">{grade.grade}</td>
                                <td className="py-3 px-4">{grade.minAge.toFixed(1)} years</td>
                                <td className="py-3 px-4">{grade.maxAge.toFixed(1)} years</td>
                                <td className="py-3 px-4">
                                  {isEligible ? (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                      Eligible
                                    </span>
                                  ) : isNear ? (
                                    <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                                      Similar
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">-</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-10 pt-8 border-t">
                  {saveMessage && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
                      saveMessage.includes('✅') 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{saveMessage}</span>
                    </div>
                  )}

                  <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      onClick={handleSave}
                      disabled={!user || !dateOfBirth}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title={user ? "Save calculation to your profile" : "Login to save"}
                    >
                      <Save className="h-4 w-4" />
                      Save Results
                    </Button>
                    <Link
                      href="/discover"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    >
                      Find Schools for this Class
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/journey"
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-secondary text-foreground border border-border rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Take the Guided Journey
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Cards */}
          {!dateOfBirth && (
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-card rounded-2xl p-6 border">
                <Calendar className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Standard Dates</h3>
                <p className="text-sm text-muted-foreground">
                  Most schools follow April-March academic years with admission in April
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 border">
                <Target className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Flexibility</h3>
                <p className="text-sm text-muted-foreground">
                  Some schools may have flexible age criteria - verify with your preferred schools
                </p>
              </div>
              <div className="bg-card rounded-2xl p-6 border">
                <Calculator className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Plan Ahead</h3>
                <p className="text-sm text-muted-foreground">
                  Use this calculator to plan admissions and identify suitable schools
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
