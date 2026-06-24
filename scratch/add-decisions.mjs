import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const decisionsPath = 'c:/Users/yashi/Downloads/kindred/.continuity/decisions.json'

function generateId() {
  // Simple uuid v4 generator or use randomUUID
  return crypto ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
}

const newDecisions = [
  {
    question: "Why did we add a fixed action footer at the bottom of the desktop web view on the school detail page?",
    answer: "To provide persistent CTA visibility and enhance conversions on desktop/web, we expanded the sticky bottom bar to render on all viewports. On desktop, it showcases the school thumbnail, name, location, and fees on the left, and the three primary action buttons on the right.",
    tags: ["ui", "refactor"],
    files: ["components/school-detail.tsx"]
  }
]

function appendDecisions() {
  const fileContent = fs.readFileSync(decisionsPath, 'utf8')
  const decisions = JSON.parse(fileContent)

  for (const nd of newDecisions) {
    const id = generateId()
    const now = new Date().toISOString()
    const decisionObj = {
      id: id,
      question: nd.question,
      answer: nd.answer,
      timestamp: now,
      tags: nd.tags,
      files: nd.files,
      status: "active",
      priority: "medium",
      relationships: {
        supersedes: [],
        supersededBy: [],
        relatedTo: [],
        causes: [],
        causedBy: []
      },
      metadata: {
        status: "active"
      },
      commitHashes: [],
      history: [
        {
          timestamp: now,
          action: "created"
        }
      ],
      provenance: {
        author: {
          name: "Antigravity",
          email: "antigravity@google.com"
        },
        source: "cli-fallback",
        timestamp: now
      }
    }
    decisions.push(decisionObj)
    console.log(`Prepared decision: ${id.substring(0, 8)} - "${nd.question}"`)
  }

  fs.writeFileSync(decisionsPath, JSON.stringify(decisions, null, 2), 'utf8')
  console.log("Successfully wrote decisions to decisions.json!")
}

appendDecisions()
