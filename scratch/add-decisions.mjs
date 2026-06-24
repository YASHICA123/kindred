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
    question: "Why did we optimize the school detail page layouts (visit form grid, scrollbars, header offset, and scholarships/highlights) for mobile?",
    answer: "To ensure a seamless, high-fidelity experience on mobile viewports: we converted the visit form to a responsive grid that stacks vertically, replaced scrollbar-none with scrollbar-hide to hide default browser scrollbars in the sub-navigation and gallery, added a top padding offset to prevent elements from sliding under the fixed header, filtered out empty database records from the scholarships section, and dynamically adjusted grid row spans for title-only highlights.",
    tags: ["ui", "mobile-optimization", "bug"],
    files: [
      "components/school-detail.tsx",
      "components/school-detail/school-subnav.tsx",
      "components/school-detail/school-gallery.tsx",
      "components/school-detail/school-fees.tsx",
      "components/school-detail/school-why.tsx"
    ]
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
