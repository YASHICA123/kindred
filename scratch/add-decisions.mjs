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
    question: "Why did we redesign the mobile bottom sticky bar styles and hide the global navigation bar on the school detail page?",
    answer: "To match the reference design, we updated the bottom action bar with specific colors/labels: Apply Now (primary blue), Schedule Visit (secondary green), and Get Callback (white with blue outline). We also introduced a hideMobileNav prop to the Footer component to prevent the global mobile menu bar from overlaying and blocking the page-specific action buttons.",
    tags: ["ui", "mobile-optimization"],
    files: ["components/school-detail.tsx", "components/footer.tsx"]
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
