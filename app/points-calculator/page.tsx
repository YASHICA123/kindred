"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BarChart3, ArrowRight, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PointsCriteria {
  label: string
  maxPoints: number
  current: number
}

interface SchoolPoints {
  name: string
  criteria: PointsCriteria[]
}

const defaultSchool: SchoolPoints = {
  name: "Your School",
  criteria: [
    { label: "Academic Performance (Last 2 years)", maxPoints: 30, current: 0 },
    { label: "Entrance Exam Score", maxPoints: 25, current: 0 },
    { label: "Extracurricular Activities", maxPoints: 15, current: 0 },
    { label: "Sports & Fitness", maxPoints: 10, current: 0 },
    { label: "Prior School Record", maxPoints: 10, current: 0 },
    { label: "Interview Performance", maxPoints: 10, current: 0 },
  ],
}

export default function PointsCalculatorPage() {
  const [school, setSchool] = useState<SchoolPoints>(defaultSchool)

  const totalPoints = school.criteria.reduce((sum, c) => sum + c.current, 0)
  const maxTotalPoints = school.criteria.reduce((sum, c) => sum + c.maxPoints, 0)
  const percentage = maxTotalPoints > 0 ? (totalPoints / maxTotalPoints) * 100 : 0

  const updateCriteria = (index: number, value: number) => {
    const newCriteria = [...school.criteria]
    newCriteria[index].current = Math.max(0, Math.min(value, newCriteria[index].maxPoints))
    setSchool({ ...school, criteria: newCriteria })
  }

  const incrementPoint = (index: number) => {
    updateCriteria(index, school.criteria[index].current + 1)
  }

  const decrementPoint = (index: number) => {
    updateCriteria(index, school.criteria[index].current - 1)
  }

  const reset = () => {
    setSchool(defaultSchool)
  }

  const getAdmissionPrediction = (): string => {
    if (percentage >= 80) return "Excellent chances"
    if (percentage >= 70) return "Strong chances"
    if (percentage >= 60) return "Good chances"
    if (percentage >= 50) return "Moderate chances"
    return "Work harder"
  }

  const getPredictionColor = (): string => {
    if (percentage >= 80) return "bg-green-50 border-green-200 text-green-900"
    if (percentage >= 70) return "bg-blue-50 border-blue-200 text-blue-900"
    if (percentage >= 60) return "bg-amber-50 border-amber-200 text-amber-900"
    if (percentage >= 50) return "bg-orange-50 border-orange-200 text-orange-900"
    return "bg-red-50 border-red-200 text-red-900"
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-primary">Admission Assessment</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl font-medium mb-6">
            Admission Points Calculator
          </h1>
          <p className="text-xl text-muted-foreground">
            Calculate your admission points and get an estimate of your chances for your target school
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-card rounded-3xl p-8 lg:p-10 border">
            {/* School Name */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">School Name (Optional)</label>
              <input
                type="text"
                value={school.name}
                onChange={(e) => setSchool({ ...school, name: e.target.value })}
                placeholder="Enter school name..."
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Points Input */}
            <div className="space-y-4 mb-10">
              <h2 className="text-lg font-semibold">Evaluation Criteria</h2>
              {school.criteria.map((criterion, index) => (
                <div
                  key={index}
                  className="bg-secondary/30 rounded-2xl p-6 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-medium">{criterion.label}</label>
                    <span className="text-sm text-muted-foreground">
                      Max: {criterion.maxPoints}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={criterion.maxPoints}
                          value={criterion.current}
                          onChange={(e) => updateCriteria(index, parseInt(e.target.value) || 0)}
                          className="w-16 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <span className="text-muted-foreground">/ {criterion.maxPoints}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementPoint(index)}
                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => incrementPoint(index)}
                        className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${(criterion.current / criterion.maxPoints) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Total Score and Prediction */}
            <div className="grid md:grid-cols-2 gap-6 mb-10 pb-10 border-b">
              {/* Total Score */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                <p className="text-muted-foreground text-sm mb-3">Total Points</p>
                <div className="font-serif text-5xl font-bold text-primary mb-2">
                  {totalPoints} / {maxTotalPoints}
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {percentage.toFixed(1)}% of maximum points
                </p>
              </div>

              {/* Admission Prediction */}
              <div className={`rounded-2xl p-6 border font-medium ${getPredictionColor()}`}>
                <p className="text-sm mb-3">Admission Chances</p>
                <p className="text-2xl font-semibold">{getAdmissionPrediction()}</p>
                <p className="text-sm mt-3">
                  {percentage >= 80
                    ? "Excellent! Your performance is outstanding."
                    : percentage >= 70
                    ? "Great! You have a strong profile."
                    : percentage >= 60
                    ? "Good! You're in the competitive range."
                    : percentage >= 50
                    ? "Fair. Consider strengthening your profile."
                    : "Keep working to improve your chances."}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                {school.criteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 px-4 bg-secondary/30 rounded-lg"
                  >
                    <span className="text-sm">{criterion.label}</span>
                    <span className="font-semibold">
                      {criterion.current}/{criterion.maxPoints}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={reset}
                variant="outline"
                className="flex-1"
              >
                Reset
              </Button>
              <Link
                href="/discover"
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Find Matching Schools
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Tips Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-card rounded-2xl p-6 border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Be Honest</h3>
              <p className="text-sm text-muted-foreground">
                Enter your actual scores for accurate predictions
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Check Criteria</h3>
              <p className="text-sm text-muted-foreground">
                Verify with your target school for specific criteria
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Get Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Speak with our counsellors for personalized advice
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
