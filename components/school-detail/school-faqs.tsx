"use client"

import { useState } from "react"
import { SchoolDetailData } from "./types"

interface SchoolFaqsProps {
  school: SchoolDetailData
}

export default function SchoolFaqs({ school }: SchoolFaqsProps) {
  
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const dbFaqs = school.faqs || []

  const faqsToRender = school.faqs || []

  return (
    <section 
      id="faqs" 
      className="scroll-mt-[120px]"
      style={{
        background: "#fff",
        border: "1px solid #e9edf3",
        borderRadius: "16px",
        padding: "26px 28px",
        boxShadow: "0 1px 2px rgba(15,27,51,.05),0 10px 26px -16px rgba(15,27,51,.1)"
      }}
    >
      <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "4px" }}>
        Questions
      </div>
      <h2 style={{ fontSize: "21px", fontWeight: 800, letterSpacing: "-.02em", margin: "0 0 18px", color: "#0f1b33" }}>
        Frequently asked questions
      </h2>

      {faqsToRender.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqsToRender.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div 
                key={idx} 
                style={{
                  border: "1.5px solid #eef1f5",
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    border: 0,
                    background: "#fff",
                    padding: "16px 20px",
                    fontSize: "15px",
                    fontWeight: 700,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "16px"
                  }}
                >
                  <span style={{ color: "#0f1b33" }}>{faq.question}</span>
                  <span 
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#f0f3f8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 800,
                      color: "#5b6b86",
                      flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform .2s"
                    }}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div 
                    style={{
                      padding: "0 20px 20px",
                      fontSize: "14.5px",
                      color: "#3a4a66",
                      lineHeight: 1.6,
                      borderTop: "1px solid #fcfdfe",
                      background: "#fff"
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ border: "1px solid #eef1f5", borderRadius: "12px", padding: "26px 20px", textAlign: "center", fontSize: "14.5px", color: "#6c7a92", fontWeight: 500 }}>
          Frequently Asked Questions have not been registered yet.
        </div>
      )}
    </section>
  )
}
