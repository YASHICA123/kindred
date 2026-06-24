"use client"

import React from "react"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApplyFormState, CallbackFormState, ReviewFormState } from "./types"

interface SchoolModalsProps {
  schoolName: string
  dropdownGrades: string[]
  
  isApplyOpen: boolean
  onCloseApply: () => void
  applyForm: ApplyFormState
  setApplyForm: React.Dispatch<React.SetStateAction<ApplyFormState>>
  onApplySubmit: (e: React.FormEvent) => void
  submittingApply: boolean

  isCallbackOpen: boolean
  onCloseCallback: () => void
  callbackForm: CallbackFormState
  setCallbackForm: React.Dispatch<React.SetStateAction<CallbackFormState>>
  onCallbackSubmit: (e: React.FormEvent) => void
  submittingCallback: boolean

  isReviewOpen: boolean
  onCloseReview: () => void
  reviewForm: ReviewFormState
  setReviewForm: React.Dispatch<React.SetStateAction<ReviewFormState>>
  onReviewSubmit: (e: React.FormEvent) => void
  submittingReview: boolean
}

export default function SchoolModals({
  schoolName,
  dropdownGrades,
  
  isApplyOpen,
  onCloseApply,
  applyForm,
  setApplyForm,
  onApplySubmit,
  submittingApply,

  isCallbackOpen,
  onCloseCallback,
  callbackForm,
  setCallbackForm,
  onCallbackSubmit,
  submittingCallback,

  isReviewOpen,
  onCloseReview,
  reviewForm,
  setReviewForm,
  onReviewSubmit,
  submittingReview
}: SchoolModalsProps) {

  return (
    <>
      {/* 1. APPLY NOW MODAL */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={onCloseApply}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-muted-foreground focus:outline-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-foreground mb-1">Direct Registration Request</h3>
              <p className="text-xs text-muted-foreground mb-6 font-semibold">Register your child's profile to start the official application journey with {schoolName}.</p>
              
              <form onSubmit={onApplySubmit} className="space-y-4 font-semibold text-xs text-[#4B5563]">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="apply-name">Parent Full Name *</label>
                  <input
                    id="apply-name"
                    type="text"
                    placeholder="Enter your name"
                    value={applyForm.parentName}
                    onChange={(e) => setApplyForm({ ...applyForm, parentName: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="apply-phone">Mobile Contact Number *</label>
                  <input
                    id="apply-phone"
                    type="tel"
                    placeholder="Enter 10 digit number"
                    value={applyForm.mobile}
                    onChange={(e) => setApplyForm({ ...applyForm, mobile: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="apply-email">Email Address (Optional)</label>
                  <input
                    id="apply-email"
                    type="email"
                    placeholder="name@example.com"
                    value={applyForm.email}
                    onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="apply-class">Admission Grade Level *</label>
                  <select
                    id="apply-class"
                    value={applyForm.childClass}
                    onChange={(e) => setApplyForm({ ...applyForm, childClass: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-extrabold cursor-pointer"
                  >
                    {dropdownGrades.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold py-6 rounded-xl mt-4 shadow-md transition-all duration-300"
                  disabled={submittingApply}
                >
                  {submittingApply ? "Submitting Registration..." : "Submit Direct Application"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. REQUEST CALLBACK MODAL */}
      {isCallbackOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={onCloseCallback}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-muted-foreground focus:outline-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-foreground mb-1">Request Callback Advice</h3>
              <p className="text-xs text-muted-foreground mb-6 font-semibold">Talk directly with our senior educational advisor to discuss curriculum comparisons and fee breaks.</p>
              
              <form onSubmit={onCallbackSubmit} className="space-y-4 font-semibold text-xs text-[#4B5563]">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="callback-name">Name *</label>
                  <input
                    id="callback-name"
                    type="text"
                    placeholder="Enter your name"
                    value={callbackForm.name}
                    onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="callback-phone">Phone Number *</label>
                  <input
                    id="callback-phone"
                    type="tel"
                    placeholder="10 digit mobile number"
                    value={callbackForm.phone}
                    onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="callback-class">Grade Level</label>
                  <select
                    id="callback-class"
                    value={callbackForm.childClass}
                    onChange={(e) => setCallbackForm({ ...callbackForm, childClass: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-extrabold cursor-pointer"
                  >
                    {dropdownGrades.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold py-6 rounded-xl mt-4 shadow-md transition-all duration-300"
                  disabled={submittingCallback}
                >
                  {submittingCallback ? "Requesting Call..." : "Call Me Back"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. WRITE A REVIEW MODAL */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={onCloseReview}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-muted-foreground focus:outline-none transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-foreground mb-1">Share School Experience</h3>
              <p className="text-xs text-muted-foreground mb-4 font-semibold">Your reviews help hundreds of other parents in search of the best education.</p>
              
              <form onSubmit={onReviewSubmit} className="space-y-4 font-semibold text-xs text-[#4B5563]">
                
                {/* Stars selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Rating Score *</label>
                  <div className="flex gap-1.5 py-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: starValue })}
                          className="focus:outline-none scale-110 cursor-pointer"
                        >
                          <Star 
                            className={`w-7 h-7 transition-colors ${
                              starValue <= reviewForm.rating
                                ? "fill-amber-500 text-amber-500" 
                                : "text-gray-200 hover:text-amber-200"
                            }`} 
                          />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="rev-author">Your Name *</label>
                  <input
                    id="rev-author"
                    type="text"
                    placeholder="e.g. Sarah Connor (Parent)"
                    value={reviewForm.author}
                    onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="rev-title">Review Summary *</label>
                  <input
                    id="rev-title"
                    type="text"
                    placeholder="e.g. Excellent academics & support"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground" htmlFor="rev-body">Detailed Experience *</label>
                  <textarea
                    id="rev-body"
                    placeholder="Detail the school curriculum, teaching staff, support system, extra activities..."
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-24 resize-none font-semibold"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/95 text-white font-extrabold py-6 rounded-xl mt-4 shadow-md transition-all duration-300"
                  disabled={submittingReview}
                >
                  {submittingReview ? "Submitting Review..." : "Publish Testimonial"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
