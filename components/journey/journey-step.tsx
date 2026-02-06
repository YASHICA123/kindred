"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, MapPin, Search, Sparkles } from "lucide-react"

interface StepOption {
  id: string
  label: string
  icon: string
  description: string
}

interface JourneyStepProps {
  step: {
    id: string
    question: string
    subtitle: string
    type: "single" | "multi" | "location"
    options: StepOption[]
    maxSelections?: number
  }
  currentAnswer?: string | string[]
  onAnswer: (answer: string | string[]) => void
  onNext: () => void
  onBack: () => void
  isFirst: boolean
  isLast: boolean
}

export function JourneyStep({ step, currentAnswer, onAnswer, onNext, onBack, isFirst, isLast }: JourneyStepProps) {
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(currentAnswer) ? currentAnswer : currentAnswer ? [currentAnswer] : [],
  )
  const [location, setLocation] = useState(typeof currentAnswer === "string" ? currentAnswer : "")

  useEffect(() => {
    if (step.type === "location") {
      onAnswer(location)
    } else if (step.type === "single") {
      if (selected.length > 0) {
        onAnswer(selected[0])
      }
    } else {
      onAnswer(selected)
    }
  }, [selected, location])

  const handleSelect = (optionId: string) => {
    if (step.type === "single") {
      setSelected([optionId])
    } else {
      setSelected((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId)
        }
        if (step.maxSelections && prev.length >= step.maxSelections) {
          return [...prev.slice(1), optionId]
        }
        return [...prev, optionId]
      })
    }
    
    // Add haptic feedback simulation
    if (typeof window !== 'undefined' && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  const canProceed = step.type === "location" ? location.length > 2 : selected.length > 0

  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col pt-16 px-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
        {/* Question */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight mb-4"
          >
            {step.question}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            {step.subtitle}
          </motion.p>
        </div>

        {/* Options */}
        {step.type !== "location" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl"
          >
            {step.options.map((option, i) => {
              const isSelected = selected.includes(option.id)
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => handleSelect(option.id)}
                  className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-105"
                      : "border-border hover:border-primary/50 hover:bg-secondary/30 hover:scale-102"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Glow effect */}
                  {isSelected && (
                    <>
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl -z-10 opacity-50" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
                      />
                    </>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city, neighborhood, or zip code"
                className="w-full pl-12 pr-12 py-4 bg-secondary/50 border-2 border-border rounded-2xl text-lg placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {["San Francisco", "New York", "Los Angeles", "Seattle", "Chicago", "Boston"].map((city) => (
                <motion.button
                  key={city}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLocation(city)}
                  className="px-4 py-2 text-sm bg-secondary/50 hover:bg-secondary rounded-full transition-colors"
                >
                  {city}
                </motion.button>
              ))}
            </div>

            {/* Location suggestions based on input */}
            {location.length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-secondary/30 rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4" />
                  <span>Finding schools near {location}...</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="py-8 border-t border-border/50 mt-auto">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-3 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary/50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isFirst ? "Exit" : "Back"}</span>
          </button>

          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              canProceed
                ? "bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            <span>{isLast ? "See my matches" : "Continue"}</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-300 ${canProceed ? "group-hover:translate-x-1" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
