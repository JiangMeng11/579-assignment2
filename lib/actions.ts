"use server"

import { revalidatePath } from "next/cache"
import { processWorkSignals, categorizeSignals } from "@/lib/work-signals"
import { prioritizeSignals } from "@/lib/priority-score"
import { adjustTone } from "@/lib/tone-adjuster"
import { generateSlide } from "@/lib/slide-generator"
import { saveReport, updateReportAcknowledgment, getReportById } from "@/lib/report-service"
import { recordAcknowledgement } from "@/lib/report-acknowledgement"

export async function generateReport(formData: FormData) {
  try {
    const inputType = formData.get("inputType") as string
    const useAutoSummarization = formData.get("useAutoSummarization") === "true"
    const enablePriorityScoring = formData.get("enablePriorityScoring") === "true"

    let workSignals

    if (inputType === "file") {
      // Get the uploaded file
      const file = formData.get("file") as File
      if (!file) {
        throw new Error("No file uploaded")
      }

      // Process the file to extract work signals
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      workSignals = await processWorkSignals(buffer)
    } else if (inputType === "demo") {
      // Use demo data
      workSignals = getDemoWorkSignals()
    } else if (inputType === "text") {
      // Process raw text input
      const text = formData.get("text") as string
      if (!text) {
        throw new Error("No text input provided")
      }

      // Convert text to work signals
      workSignals = processTextInput(text)
    } else {
      throw new Error("Invalid input type")
    }

    // Prioritize signals (if enabled)
    const prioritizedSignals = enablePriorityScoring
      ? await prioritizeSignals(workSignals)
      : categorizeSignals(workSignals)

    // Generate summary
    const summary = {
      "Top Tasks Done": prioritizedSignals.tasks.slice(0, 2),
      "Top Blockers": prioritizedSignals.blockers.slice(0, 1),
      "Top Wins": prioritizedSignals.wins.slice(0, 1),
      "Top Risks": prioritizedSignals.risks.slice(0, 1),
    }

    // Generate slide content
    const slideContent = generateSlide(summary)

    // Adjust tone for executive audience (if enabled)
    const adjustedContent = useAutoSummarization ? await adjustTone(slideContent) : slideContent

    // Format into report items
    const reportItems = adjustedContent.map((content) => {
      if (content.startsWith("Biggest Blocker:")) {
        return { type: "blocker", content: content.replace("Biggest Blocker:", "").trim() }
      } else if (content.startsWith("Top Risk:")) {
        return { type: "risk", content: content.replace("Top Risk:", "").trim() }
      } else if (content.startsWith("Task Completed:")) {
        return { type: "task", content: content.replace("Task Completed:", "").trim() }
      } else if (content.startsWith("Major Win:")) {
        return { type: "win", content: content.replace("Major Win:", "").trim() }
      } else {
        // Default case
        return { type: "task", content }
      }
    })

    // Save the report
    const report = {
      id: Date.now().toString(),
      generatedAt: new Date().toISOString(),
      items: reportItems,
      acknowledged: false,
      useAutoSummarization,
      enablePriorityScoring,
    }

    await saveReport(report)

    revalidatePath("/summary")
    return { success: true }
  } catch (error) {
    console.error("Error generating report:", error)
    throw error
  }
}

export async function acknowledgeReport(reportId: string) {
  try {
    const report = await getReportById(reportId)
    if (!report) {
      throw new Error("Report not found")
    }

    await updateReportAcknowledgment(reportId, true)

    // Record acknowledgement
    recordAcknowledgement(
      "Current Leader", // In a real app, this would be the current user's name
      new Date(report.generatedAt).toISOString().split("T")[0],
      true,
    )

    revalidatePath("/summary")
    return { success: true }
  } catch (error) {
    console.error("Error acknowledging report:", error)
    throw new Error("Failed to acknowledge report")
  }
}

export async function generatePPT(reportId: string) {
  try {
    const report = await getReportById(reportId)
    if (!report) {
      throw new Error("Report not found")
    }

    // In a real app, this would generate a PowerPoint file
    // For this example, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true }
  } catch (error) {
    console.error("Error generating PPT:", error)
    throw new Error("Failed to generate PowerPoint")
  }
}

// Helper function to process text input
function processTextInput(text: string) {
  // Split text by lines and convert to work signals
  const lines = text.split("\n").filter((line) => line.trim().length > 0)

  return lines.map((line) => ({
    section: "Text Input",
    text: line,
    changedSinceLastWeek: true,
    reportDate: new Date().toISOString().split("T")[0],
    feedback: "",
  }))
}

// Helper function to get demo work signals
function getDemoWorkSignals() {
  return [
    {
      section: "Security",
      text: "Security audit identified 3 critical vulnerabilities requiring immediate patching",
      changedSinceLastWeek: true,
      reportDate: "2025-04-14",
      feedback: "👍",
    },
    {
      section: "Sales Performance",
      text: "Q2 revenue projections 15% below target due to delayed product launch",
      changedSinceLastWeek: true,
      reportDate: "2025-04-11",
      feedback: "",
    },
    {
      section: "Tech Debt",
      text: "API integration with payment processor blocked by missing documentation",
      changedSinceLastWeek: true,
      reportDate: "2025-04-13",
      feedback: "",
    },
    {
      section: "Customer Feedback",
      text: "Customer retention increased 12% following new onboarding implementation",
      changedSinceLastWeek: true,
      reportDate: "2025-04-09",
      feedback: "👍",
    },
    {
      section: "Sprint velocity",
      text: "Sprint velocity improved 8% this quarter through process optimization",
      changedSinceLastWeek: true,
      reportDate: "2025-04-12",
      feedback: "",
    },
  ]
}
