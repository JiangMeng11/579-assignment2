"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { acknowledgeReport } from "@/lib/actions"
import { ExecutiveReport } from "@/components/executive-report"
import { getReportById } from "@/lib/report-service"

export default function AcknowledgePage({ params }: { params: { reportId: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState<any>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch report data
  useState(() => {
    const fetchReport = async () => {
      try {
        const reportData = await getReportById(params.reportId)
        setReport(reportData)
      } catch (err) {
        setError("Failed to load report")
        console.error(err)
      }
    }

    fetchReport()
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acknowledged) {
      setError("Please confirm that you have read the report")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await acknowledgeReport(params.reportId)
      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Failed to acknowledge report. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Acknowledge Report</CardTitle>
            <CardDescription>Please review the report and confirm that you have read it</CardDescription>
          </CardHeader>
          <CardContent>
            <ExecutiveReport report={report} />

            <div className="mt-8 border-t pt-4">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="acknowledge"
                    checked={acknowledged}
                    onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
                  />
                  <Label htmlFor="acknowledge">I confirm that I have read and understood this report</Label>
                </div>
                {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Confirm Acknowledgment"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
