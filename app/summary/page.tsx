"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { BarChart3, CheckCircle, FileText, List, PresentationIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { getLatestReport } from "@/lib/report-service"
import { SummaryItem } from "@/components/summary-item"
import { generatePPT, acknowledgeReport } from "@/lib/actions"
import { getAcknowledgementStats } from "@/lib/report-acknowledgement"
import { PriorityView } from "@/components/priority-view"
import { SignalsView } from "@/components/signals-view"

export default function SummaryPage() {
  const router = useRouter()
  const [report, setReport] = useState<any>(null)
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  const [stats, setStats] = useState({ total: 60, acknowledged: 10 }) // Default values

  useEffect(() => {
    const fetchReport = async () => {
      const latestReport = await getLatestReport()
      if (!latestReport) {
        router.push("/")
      } else {
        setReport(latestReport)

        // Get acknowledgement stats
        const acknowledgementStats = getAcknowledgementStats()
        if (acknowledgementStats.total > 0) {
          setStats(acknowledgementStats)
        }
      }
    }

    fetchReport()
  }, [router])

  const handleGeneratePPT = async () => {
    if (!report) return

    setIsGeneratingPPT(true)
    try {
      await generatePPT(report.id)
      // In a real app, this would trigger a download
      setTimeout(() => {
        alert("PowerPoint presentation generated and downloaded!")
        setIsGeneratingPPT(false)
      }, 1500)
    } catch (error) {
      console.error("Error generating PPT:", error)
      setIsGeneratingPPT(false)
    }
  }

  const handleAcknowledge = async () => {
    if (!report || report.acknowledged) return

    try {
      await acknowledgeReport(report.id)
      // Update the report in state
      setReport({
        ...report,
        acknowledged: true,
        acknowledgedAt: new Date().toISOString(),
      })

      // Update stats
      setStats({
        ...stats,
        acknowledged: stats.acknowledged + 1,
      })
    } catch (error) {
      console.error("Error acknowledging report:", error)
    }
  }

  if (!report) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const reviewPercentage = Math.round((stats.acknowledged / stats.total) * 100)
  const unreadCount = stats.total - stats.acknowledged

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Auto-summarization applied
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            ← Back to Generator
          </Button>

          <Tabs defaultValue="summary" className="w-auto" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="summary" className="flex items-center gap-1">
                <List className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="slide" className="flex items-center gap-1" onClick={handleGeneratePPT}>
                <PresentationIcon className="h-4 w-4" />
                Slide
              </TabsTrigger>
              <TabsTrigger value="priority" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Priority
              </TabsTrigger>
              <TabsTrigger value="signals" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Signals
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsContent value="summary">
            <Card className="overflow-hidden mb-6">
              <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">Executive Summary</h2>
                <div className="bg-gray-700 text-white text-sm px-3 py-1 rounded-full">
                  {reviewPercentage}% Reviewed
                </div>
              </div>

              <div className="divide-y">
                {report.items.map((item: any, index: number) => (
                  <SummaryItem
                    key={index}
                    type={item.type}
                    content={item.content}
                    date={new Date(report.generatedAt).toLocaleDateString()}
                  />
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="priority">
            <PriorityView report={report} />
          </TabsContent>

          <TabsContent value="signals">
            <SignalsView />
          </TabsContent>

          <TabsContent value="slide">
            <div className="text-center p-8">
              {isGeneratingPPT ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
                  <p>Generating PowerPoint presentation...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <PresentationIcon className="h-16 w-16 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Generate PowerPoint Slide</h3>
                  <p className="text-gray-600 mb-4">Create a presentation-ready slide with the executive summary</p>
                  <Button onClick={handleGeneratePPT}>Download PowerPoint</Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-sm text-gray-600 flex justify-between items-center">
          <div>
            {stats.acknowledged}/{stats.total} reports reviewed by leadership ({reviewPercentage}%).
          </div>
          <div className="flex gap-4">
            <span className="text-blue-600">{stats.total} Total</span>
            <span className="text-green-600">{stats.acknowledged} Read</span>
            <span className="text-orange-600">{unreadCount} Unread</span>
          </div>
        </div>

        {!report.acknowledged && (
          <div className="mt-6">
            <Button onClick={handleAcknowledge} className="w-full bg-green-600 hover:bg-green-700">
              Mark as Read
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
