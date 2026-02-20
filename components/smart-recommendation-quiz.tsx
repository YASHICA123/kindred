"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Sparkles, CheckCircle, Search, X } from "lucide-react"
import Link from "next/link"
import { saveQuizAnswers } from "@/lib/firebase-data"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

const indianStates = [
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
]

type QuizQuestion = {
  id: string
  question: string
  description: string
  options?: {
    text: string
    value: string
    icon: string
  }[]
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "learning_style",
    question: "What's your child's learning style?",
    description: "This helps us understand how your child learns best",
    options: [
      { text: "Hands-on & Experiential", value: "montessori", icon: "🎨" },
      { text: "Traditional Classroom", value: "cbse", icon: "📚" },
      { text: "Project-Based Learning", value: "international", icon: "🔬" },
      { text: "Inquiry-Based", value: "ib", icon: "🤔" },
    ],
  },
  {
    id: "budget",
    question: "What's your budget range?",
    description: "Help us find schools within your financial comfort zone",
    options: [
      { text: "₹1-3 Lakhs/year", value: "budget-friendly", icon: "💰" },
      { text: "₹3-6 Lakhs/year", value: "affordable", icon: "💵" },
      { text: "₹6-12 Lakhs/year", value: "mid-range", icon: "💳" },
      { text: "₹12+ Lakhs/year", value: "premium", icon: "✨" },
    ],
  },
  {
    id: "location",
    question: "Where are you located?",
    description: "Search for your state",
  },
  {
    id: "board",
    question: "Which board interests you?",
    description: "Different boards follow different curricula",
    options: [
      { text: "CBSE", value: "cbse", icon: "📖" },
      { text: "ICSE", value: "icse", icon: "📖" },
      { text: "IB/Cambridge", value: "international", icon: "🌍" },
      { text: "No preference", value: "all", icon: "🎯" },
    ],
  },
  {
    id: "special_needs",
    question: "Does your child have special needs?",
    description: "We can help find inclusive schools if needed",
    options: [
      { text: "No special needs", value: "none", icon: "✓" },
      { text: "Learning support needed", value: "learning-support", icon: "🤝" },
      { text: "Gifted/Talented program", value: "gifted", icon: "⭐" },
      { text: "Inclusive/Special education", value: "special-education", icon: "♿" },
    ],
  },
]

type Answers = {
  [key: string]: string
}

export function SmartRecommendationQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [showResults, setShowResults] = useState(false)
  const [locationSearch, setLocationSearch] = useState("")
  const [user, setUser] = useState<any>(null)
  const [saveMessage, setSaveMessage] = useState("")

  // Check if user is logged in
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribeAuth()
  }, [])

  const filteredStates = useMemo(
    () =>
      indianStates.filter((state) =>
        state.toLowerCase().includes(locationSearch.toLowerCase())
      ),
    [locationSearch]
  )

  const handleOptionSelect = (value: string) => {
    const questionId = quizQuestions[currentStep].id
    setAnswers({
      ...answers,
      [questionId]: value,
    })

    // Auto-advance to next question (except for location)
    if (currentStep < quizQuestions.length - 1 && questionId !== "location") {
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 300)
    }
  }

  const handleLocationSelect = (state: string) => {
    setAnswers({
      ...answers,
      location: state.toLowerCase().replace(/\s+/g, "-"),
    })
    setLocationSearch("")
  }

  const handleLocationNext = () => {
    if (answers.location) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleGetRecommendations = () => {
    // Build query string from answers
    const params = new URLSearchParams()
    if (answers.learning_style) params.append("style", answers.learning_style)
    if (answers.budget) params.append("budget", answers.budget)
    if (answers.location) params.append("state", answers.location)
    if (answers.board) params.append("board", answers.board)

    const queryString = params.toString()
    window.location.href = `/discover?${queryString}`
  }

  const handleSaveAnswers = async () => {
    if (!user) {
      setSaveMessage("Please log in to save your quiz results")
      setTimeout(() => setSaveMessage(""), 3000)
      return
    }

    try {
      await saveQuizAnswers(answers)
      setSaveMessage("✅ Quiz results saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("❌ Error saving quiz results. Please try again.")
      console.error("Save error:", error)
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const progress = ((currentStep + 1) / quizQuestions.length) * 100
  const currentQuestion = quizQuestions[currentStep]
  const isAnswered = answers[currentQuestion.id]
  const isComplete = Object.keys(answers).length === quizQuestions.length
  const isLocationQuestion = currentQuestion.id === "location"

  if (showResults) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl">Your Profile is Ready! 🎉</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your preferences, we've identified schools that match your child's learning style, budget, and location.
          </p>
        </div>

        {/* Summary of answers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(answers).map(([key, value]) => {
            const question = quizQuestions.find((q) => q.id === key)
            const option = question?.options?.find((o) => o.value === value)
            const displayValue = key === "location" 
              ? value.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
              : option?.text

            return (
              <Card key={key} className="p-4 border border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                      {question?.question}
                    </p>
                    <p className="font-medium text-foreground mt-1">{displayValue}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="flex gap-4 justify-center flex-col items-center">
          {saveMessage && (
            <div className={`w-full p-4 rounded-lg flex items-center gap-2 ${
              saveMessage.includes('✅') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              <span className="text-lg">{saveMessage.includes('✅') ? '✅' : '❌'}</span>
              <span className="text-sm">{saveMessage}</span>
            </div>
          )}

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => {
                setShowResults(false)
                setCurrentStep(0)
                setAnswers({})
                setSaveMessage("")
              }}
              variant="outline"
              size="lg"
            >
              Retake Quiz
            </Button>
            <Button 
              onClick={handleSaveAnswers}
              disabled={!user}
              variant="outline"
              size="lg"
              title={user ? "Save quiz results to your profile" : "Login to save"}
            >
              Save Results
            </Button>
            <Button onClick={handleGetRecommendations} size="lg" className="bg-primary hover:bg-primary/90">
              View Recommendations
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-muted-foreground">
            Question {currentStep + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <h3 className="font-serif text-2xl lg:text-3xl font-medium">{currentQuestion.question}</h3>
          <p className="text-muted-foreground">{currentQuestion.description}</p>
        </div>

        {/* Conditional rendering for location question */}
        {isLocationQuestion ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute left-4 top-3 text-muted-foreground">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Type to find your state..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-foreground"
              />
              {locationSearch && (
                <button
                  onClick={() => setLocationSearch("")}
                  className="absolute right-4 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Selected State */}
            {answers.location && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                <span className="font-medium text-foreground">
                  ✓ {answers.location.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </span>
                <button
                  onClick={() => setAnswers({ ...answers, location: "" })}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Filtered States */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {filteredStates.map((state) => (
                <button
                  key={state}
                  onClick={() => handleLocationSelect(state)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    answers.location === state.toLowerCase().replace(/\s+/g, "-")
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-primary/2"
                  }`}
                >
                  <p className="font-medium text-foreground">{state}</p>
                </button>
              ))}
            </div>

            {filteredStates.length === 0 && locationSearch && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No states found for "{locationSearch}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Options for non-location questions */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left group ${
                  isAnswered === option.value
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border hover:border-primary/50 hover:bg-primary/2"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {option.text}
                    </p>
                  </div>
                  {isAnswered === option.value && (
                    <div className="p-1.5 rounded-full bg-primary text-white mt-1">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 justify-between">
        <Button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          variant="outline"
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        {currentStep === quizQuestions.length - 1 ? (
          <Button onClick={() => setShowResults(true)} disabled={!isComplete} className="bg-primary hover:bg-primary/90">
            Get Recommendations
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : isLocationQuestion ? (
          <Button
            onClick={handleLocationNext}
            disabled={!isAnswered}
            className="bg-primary hover:bg-primary/90"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!isAnswered}
            className="bg-primary hover:bg-primary/90"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
