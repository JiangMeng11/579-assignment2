// In a real application, this would connect to a database
// For this example, we'll use localStorage in the browser

interface ReportItem {
  type: "blocker" | "risk" | "task" | "win"
  content: string
}

interface Report {
  id: string
  generatedAt: string
  items: ReportItem[]
  acknowledged: boolean
  acknowledgedAt?: string
  useAutoSummarization: boolean
  enablePriorityScoring: boolean
}

// Mock storage for reports
let reports: Report[] = [
  {
    id: "1",
    generatedAt: "2025-04-14T12:00:00Z",
    items: [
      { type: "risk", content: "Security audit identified 3 critical vulnerabilities requiring immediate patching" },
      { type: "risk", content: "Q2 revenue projections 15% below target due to delayed product launch" },
      { type: "blocker", content: "API integration with payment processor blocked by missing documentation" },
      { type: "win", content: "Customer retention increased 12% following new onboarding implementation" },
      { type: "task", content: "Sprint velocity improved 8% this quarter through process optimization" },
    ],
    acknowledged: false,
    useAutoSummarization: true,
    enablePriorityScoring: true,
  },
]

// In a real app, this would be a database call
export async function saveReport(report: Report): Promise<void> {
  // In a server environment, this would save to a database
  reports = [report, ...reports]

  // For browser-only storage
  if (typeof window !== "undefined") {
    localStorage.setItem("reports", JSON.stringify(reports))
  }
}

export async function getLatestReport(): Promise<Report | null> {
  // Load reports from storage if available
  if (typeof window !== "undefined") {
    const storedReports = localStorage.getItem("reports")
    if (storedReports) {
      reports = JSON.parse(storedReports)
    }
  }

  // Return the most recent report
  return reports.length > 0 ? reports[0] : null
}

export async function getReportById(id: string): Promise<Report | null> {
  // Load reports from storage if available
  if (typeof window !== "undefined") {
    const storedReports = localStorage.getItem("reports")
    if (storedReports) {
      reports = JSON.parse(storedReports)
    }
  }

  // Find the report by ID
  return reports.find((report) => report.id === id) || null
}

export async function updateReportAcknowledgment(id: string, acknowledged: boolean): Promise<void> {
  // Load reports from storage if available
  if (typeof window !== "undefined") {
    const storedReports = localStorage.getItem("reports")
    if (storedReports) {
      reports = JSON.parse(storedReports)
    }
  }

  // Update the report
  reports = reports.map((report) => {
    if (report.id === id) {
      return {
        ...report,
        acknowledged,
        acknowledgedAt: acknowledged ? new Date().toISOString() : undefined,
      }
    }
    return report
  })

  // Save back to storage
  if (typeof window !== "undefined") {
    localStorage.setItem("reports", JSON.stringify(reports))
  }
}

export async function getAllReports(): Promise<Report[]> {
  // Load reports from storage if available
  if (typeof window !== "undefined") {
    const storedReports = localStorage.getItem("reports")
    if (storedReports) {
      reports = JSON.parse(storedReports)
    }
  }

  return reports
}
