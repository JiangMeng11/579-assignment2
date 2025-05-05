// Converted from priorityscorefunction-N9eKuoalwd0ljTgrwTSCBQUckkBqHc.py
interface WorkSignal {
  section: string
  text: string
  changedSinceLastWeek: boolean
  reportDate: string
  feedback?: string
}

interface PrioritizedSignals {
  tasks: string[]
  blockers: string[]
  wins: string[]
  risks: string[]
}

interface ScoredItem {
  text: string
  score: number
  type: "task" | "blocker" | "win" | "risk"
}

export async function prioritizeSignals(workSignals: WorkSignal[]): Promise<PrioritizedSignals> {
  // Default weights
  const weights = {
    urgency: 0.4,
    impact: 0.3,
    recency: 0.2,
    votes: 0.1,
  }

  // Default impact mapping
  const impactMapping: Record<string, number> = {
    "Sprint velocity": 5,
    "Hiring pipeline": 4,
    "Marketing campaigns": 3,
    "Design progress": 3,
    "Tech Debt": 4,
    "Product Launches": 5,
    "Customer Feedback": 4,
    "Support Issues": 4,
    "Internal Operations": 3,
    "Sales Performance": 5,
    Security: 5,
  }

  // Calculate scores for each signal
  const scoredItems: ScoredItem[] = workSignals.map((signal) => {
    // Calculate urgency score
    const urgency = signal.changedSinceLastWeek ? 5 : 2

    // Calculate impact score based on section
    const impact = impactMapping[signal.section] || 3

    // Calculate recency score
    const reportDate = new Date(signal.reportDate)
    const now = new Date()
    const daysSince = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24))
    const recencyScore = Math.max(0.5, 1 - daysSince / 14)

    // Calculate votes score
    const votes = signal.feedback?.includes("👍") ? 1 : 0

    // Calculate priority score
    const priorityScore =
      weights.urgency * urgency +
      weights.impact * impact +
      weights.recency * recencyScore * 5 +
      weights.votes * votes * 5

    // Determine type
    let type: "task" | "blocker" | "win" | "risk" = "task"
    const text = signal.text.toLowerCase()

    if (
      text.includes("blocked") ||
      text.includes("blocker") ||
      text.includes("stuck") ||
      text.includes("waiting") ||
      text.includes("delayed") ||
      text.includes("issue") ||
      text.includes("missing")
    ) {
      type = "blocker"
    } else if (
      text.includes("risk") ||
      text.includes("concern") ||
      text.includes("warning") ||
      text.includes("potential") ||
      text.includes("might") ||
      text.includes("could") ||
      text.includes("below target") ||
      text.includes("vulnerabilities")
    ) {
      type = "risk"
    } else if (
      text.includes("completed") ||
      text.includes("launched") ||
      text.includes("shipped") ||
      text.includes("success") ||
      text.includes("milestone") ||
      text.includes("achievement") ||
      text.includes("increased") ||
      text.includes("improved")
    ) {
      type = "win"
    }

    return {
      text: signal.text,
      score: priorityScore,
      type,
    }
  })

  // Sort by score (descending)
  scoredItems.sort((a, b) => b.score - a.score)

  // Separate by type
  const tasks = scoredItems.filter((item) => item.type === "task").map((item) => item.text)
  const blockers = scoredItems.filter((item) => item.type === "blocker").map((item) => item.text)
  const wins = scoredItems.filter((item) => item.type === "win").map((item) => item.text)
  const risks = scoredItems.filter((item) => item.type === "risk").map((item) => item.text)

  return { tasks, blockers, wins, risks }
}
