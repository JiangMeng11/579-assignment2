// Converted from 1_slide_report_generator-3sX3F5eSTtKoMAMCG4SwYAiluTGAmJ.py
interface Summary {
  "Top Tasks Done": string[]
  "Top Blockers": string[]
  "Top Wins": string[]
  "Top Risks": string[]
}

export function generateSlide(summary: Summary): string[] {
  const bullets: string[] = []

  // Add top blocker if available
  if (summary["Top Blockers"] && summary["Top Blockers"].length > 0) {
    bullets.push(`Biggest Blocker: ${summary["Top Blockers"][0]}`)
  }

  // Add top risk if available
  if (summary["Top Risks"] && summary["Top Risks"].length > 0) {
    bullets.push(`Top Risk: ${summary["Top Risks"][0]}`)
  }

  // Add top 1-2 completed tasks
  if (summary["Top Tasks Done"]) {
    for (const task of summary["Top Tasks Done"].slice(0, 2)) {
      bullets.push(`Task Completed: ${task}`)
    }
  }

  // Add top 1-2 wins
  if (summary["Top Wins"]) {
    for (const win of summary["Top Wins"].slice(0, 1)) {
      bullets.push(`Major Win: ${win}`)
    }
  }

  // Limit to maximum 5 bullet points
  return bullets.slice(0, 5)
}
