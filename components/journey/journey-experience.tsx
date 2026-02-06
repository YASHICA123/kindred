"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { JourneyIntro } from "./journey-intro"
import { JourneyStep } from "./journey-step"
import { JourneyResults } from "./journey-results"
import { Sparkles } from "lucide-react"
import Link from "next/link"

const journeySteps = [
  {
    id: "child-age",
    question: "How old is your child?",
    subtitle: "This helps us find age-appropriate programs",
    type: "single" as const,
    options: [
      { id: "toddler", label: "2-3 years", icon: "🌱", description: "Early learners" },
      { id: "preschool", label: "4-5 years", icon: "🌿", description: "Pre-kindergarten" },
      { id: "elementary-early", label: "6-8 years", icon: "🌳", description: "Early elementary" },
      { id: "elementary-late", label: "9-11 years", icon: "🌲", description: "Upper elementary" },
      { id: "middle", label: "12-14 years", icon: "🏔️", description: "Middle school" },
    ],
  },
  {
    id: "learning-style",
    question: "How does your child learn best?",
    subtitle: "Every child has their unique way of absorbing the world",
    type: "multi" as const,
    options: [
      { id: "hands-on", label: "Hands-on activities", icon: "🎨", description: "Learning by doing" },
      { id: "visual", label: "Visual learning", icon: "👁️", description: "Pictures & diagrams" },
      { id: "reading", label: "Reading & writing", icon: "📚", description: "Traditional study" },
      { id: "discussion", label: "Group discussions", icon: "💬", description: "Collaborative learning" },
      { id: "independent", label: "Self-paced exploration", icon: "🔍", description: "Independent discovery" },
    ],
  },
  {
    id: "priorities",
    question: "What matters most to you?",
    subtitle: "Select up to 3 priorities that shape your decision",
    type: "multi" as const,
    maxSelections: 3,
    options: [
      { id: "academics", label: "Strong academics", icon: "📖", description: "Rigorous curriculum" },
      { id: "arts", label: "Arts & creativity", icon: "🎭", description: "Creative expression" },
      { id: "sports", label: "Sports & fitness", icon: "⚽", description: "Physical development" },
      { id: "nature", label: "Outdoor learning", icon: "🌿", description: "Nature connection" },
      { id: "tech", label: "Technology focus", icon: "💻", description: "Digital literacy" },
      { id: "community", label: "Strong community", icon: "🤝", description: "Family involvement" },
    ],
  },
  {
    id: "environment",
    question: "What environment feels right?",
    subtitle: "Picture where your child would thrive",
    type: "single" as const,
    options: [
      { id: "small", label: "Small & intimate", icon: "🏠", description: "Under 200 students" },
      { id: "medium", label: "Balanced community", icon: "🏫", description: "200-500 students" },
      { id: "large", label: "Large & diverse", icon: "🏛️", description: "500+ students" },
      { id: "flexible", label: "Flexible / hybrid", icon: "🌐", description: "Mix of settings" },
    ],
  },
  {
    id: "location",
    question: "Where are you searching?",
    subtitle: "We'll find schools in your area",
    type: "location" as const,
    options: [],
  },
]

export function JourneyExperience() {
  const [currentStep, setCurrentStep] = useState(-1) // -1 = intro
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [isComplete, setIsComplete] = useState(false)

  const progress = currentStep >= 0 ? ((currentStep + 1) / journeySteps.length) * 100 : 0

  const handleStart = () => {
    setCurrentStep(0)
  }

  const handleAnswer = (stepId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [stepId]: answer }))
  }

  const handleNext = () => {
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    } else if (currentStep === 0) {
      setCurrentStep(-1)
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header - minimal during journey */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="font-serif text-2xl font-medium tracking-tight">Kindred</span>
            </Link>

            {currentStep >= 0 && !isComplete && (
              <button
                onClick={() => setCurrentStep(-1)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <AnimatePresence>
        {currentStep >= 0 && !isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-0 right-0 z-40"
          >
            <div className="max-w-2xl mx-auto px-6">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground font-medium">
                  {currentStep + 1} of {journeySteps.length}
                </span>
                <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="relative z-10 pt-20">
        <AnimatePresence mode="wait">
          {currentStep === -1 && !isComplete && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <JourneyIntro onStart={handleStart} />
            </motion.div>
          )}

          {currentStep >= 0 && !isComplete && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <JourneyStep
                step={journeySteps[currentStep]}
                currentAnswer={answers[journeySteps[currentStep].id]}
                onAnswer={(answer) => handleAnswer(journeySteps[currentStep].id, answer)}
                onNext={handleNext}
                onBack={handleBack}
                isFirst={currentStep === 0}
                isLast={currentStep === journeySteps.length - 1}
              />
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <JourneyResults answers={answers} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
