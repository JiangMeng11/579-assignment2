// Converted from work_signals_updated-rEnLAFWzV8FNcqd3H5jRxiK4jcU8Tt.py
import { parse } from "csv-parse/sync"

interface WorkSignal {
  section: string
  text: string
  changedSinceLastWeek: boolean
  reportDate: string
  feedback?: string
}

export async function processWorkSignals(fileBuffer: Buffer): Promise<WorkSignal[]> {
  // Parse CSV data
  const records = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
  })

  // Map records to work signals
  const workSignals = records.map((record: any) => ({
    section: record.Section || "Unknown",
    text: record.Feedback || "", // Using Feedback as the main text content
    changedSinceLastWeek: (record.Changed_Since_Last_Week || "").toLowerCase() === "yes",
    reportDate: record.Report_Date || new Date().toISOString().split("T")[0],
    feedback: record.Feedback || "",
    leadershipViewed: record.Leadership_Viewed === "Yes",
  }))

  return workSignals
}

export function analyzeWorkSignals(workSignals: WorkSignal[]) {
  // Calculate % Updated per Section
  const sectionUpdates = new Map<string, { total: number; updated: number }>()

  workSignals.forEach((signal) => {
    const section = signal.section
    if (!sectionUpdates.has(section)) {
      sectionUpdates.set(section, { total: 0, updated: 0 })
    }

    const data = sectionUpdates.get(section)!
    data.total += 1
    if (signal.changedSinceLastWeek) {
      data.updated += 1
    }
  })

  const engagementSummary = Array.from(sectionUpdates.entries())
    .map(([section, data]) => ({
      section,
      updateRate: data.updated / data.total,
    }))
    .sort((a, b) => b.updateRate - a.updateRate)

  // Calculate % Low-Quality Feedback per Section
  const lowQualityKeywords = [
    "needs clarity",
    "duplicate",
    "remove",
    "not relevant",
    "why is this",
    "who owns this",
    "update next week",
  ]

  const isLowQuality = (text: string) => {
    text = text.toLowerCase()
    return lowQualityKeywords.some((keyword) => text.includes(keyword))
  }

  const sectionQuality = new Map<string, { total: number; lowQuality: number }>()

  workSignals.forEach((signal) => {
    const section = signal.section
    if (!sectionQuality.has(section)) {
      sectionQuality.set(section, { total: 0, lowQuality: 0 })
    }

    const data = sectionQuality.get(section)!
    data.total += 1
    if (isLowQuality(signal.text)) {
      data.lowQuality += 1
    }
  })

  const qualitySummary = Array.from(sectionQuality.entries())
    .map(([section, data]) => ({
      section,
      lowQualityRate: data.lowQuality / data.total,
    }))
    .sort((a, b) => b.lowQualityRate - a.lowQualityRate)

  // Top Root Causes (Reasons for Rework)
  const feedbackText = workSignals
    .map((s) => s.feedback || "")
    .join(" ")
    .toLowerCase()
  const rootCausePhrases = [
    "duplicate info",
    "needs clarity",
    "remove this",
    "update next week",
    "who owns this",
    "why is this",
  ]

  const feedbackCounter = rootCausePhrases
    .map((phrase) => ({
      phrase,
      count: (feedbackText.match(new RegExp(phrase, "g")) || []).length,
    }))
    .sort((a, b) => b.count - a.count)

  return {
    engagementSummary,
    qualitySummary,
    feedbackCounter,
  }
}

export function categorizeSignals(workSignals: WorkSignal[]) {
  const tasks: string[] = []
  const blockers: string[] = []
  const wins: string[] = []
  const risks: string[] = []

  // Keywords to help categorize signals
  const blockerKeywords = ["blocked", "blocker", "stuck", "waiting", "delayed", "issue", "missing"]
  const winKeywords = [
    "completed",
    "launched",
    "shipped",
    "success",
    "milestone",
    "achievement",
    "increased",
    "improved",
  ]
  const riskKeywords = [
    "risk",
    "concern",
    "warning",
    "potential issue",
    "might",
    "could",
    "below target",
    "vulnerabilities",
  ]

  workSignals.forEach((signal) => {
    const text = signal.text.toLowerCase()

    // Categorize based on keywords
    if (blockerKeywords.some((keyword) => text.includes(keyword))) {
      blockers.push(signal.text)
    } else if (winKeywords.some((keyword) => text.includes(keyword))) {
      wins.push(signal.text)
    } else if (riskKeywords.some((keyword) => text.includes(keyword))) {
      risks.push(signal.text)
    } else {
      // Default to task if no specific category is matched
      tasks.push(signal.text)
    }
  })

  return { tasks, blockers, wins, risks }
}
