"use client"

import { motion } from "framer-motion"
import { ArrowRight, Heart, Compass, Star } from "lucide-react"

interface JourneyIntroProps {
  onStart: () => void
}

export function JourneyIntro({ onStart }: JourneyIntroProps) {
  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative element */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-flex">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
                <Compass className="w-10 h-10 text-primary" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                <Star className="w-3 h-3 text-accent" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6"
          >
            <span className="block">Let{"'"}s find the</span>
            <span className="text-gradient">perfect school</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-lg mx-auto"
          >
            Answer a few questions about your child and what matters most to your family. We{"'"}ll match you with schools
            that align with your values.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mb-12"
          >
            {[
              { icon: Heart, label: "Personalized" },
              { icon: Compass, label: "5 questions" },
              { icon: Star, label: "2 minutes" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <item.icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              <span>Begin your journey</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </motion.div>

          {/* Trust note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 text-sm text-muted-foreground/60"
          >
            No account required. Your privacy is our priority.
          </motion.p>
        </div>
      </div>

    </>
  )
}
