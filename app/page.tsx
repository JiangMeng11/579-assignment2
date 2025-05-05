"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { generateReport } from "@/lib/actions"
import { useRouter } from "next/navigation"
import { FileText, Upload } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [rawText, setRawText] = useState("")
  const [activeTab, setActiveTab] = useState("csv")
  const [useAutoSummarization, setUseAutoSummarization] = useState(true)
  const [enablePriorityScoring, setEnablePriorityScoring] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileChange = (file: File | null) => {
    setFile(file)
    setFileName(file?.name || null)
  }

  const handleUseDemoFile = () => {
    // Create a mock file for the demo
    const mockFileContent = "This is a demo file content"
    const mockFile = new File([mockFileContent], "week2 - Problem_1_-_Unread_Report_Tracker__60_Rows_.csv", {
      type: "text/csv",
    })
    setFile(mockFile)
    setFileName("week2 - Problem_1_-_Unread_Report_Tracker__60_Rows_.csv (Loaded)")
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      const formData = new FormData()

      if (activeTab === "csv") {
        if (file) {
          formData.append("file", file)
          formData.append("inputType", "file")
        } else if (fileName && fileName.includes("(Loaded)")) {
          // Handle demo file case
          formData.append("inputType", "demo")
        } else {
          throw new Error("No file provided")
        }
      } else if (activeTab === "text" && rawText) {
        formData.append("text", rawText)
        formData.append("inputType", "text")
      } else {
        throw new Error("No input provided")
      }

      formData.append("useAutoSummarization", useAutoSummarization.toString())
      formData.append("enablePriorityScoring", enablePriorityScoring.toString())

      await generateReport(formData)
      router.push("/summary")
    } catch (error) {
      console.error("Error generating report:", error)
      alert(error instanceof Error ? error.message : "Failed to generate report")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center mb-2">
          <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Leadership Report Generator
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Executive Summary Generator</h1>
        <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
          Transform raw team updates into concise, leadership-focused summaries. Upload your CSV report or paste raw
          text to generate professional executive reports.
        </p>

        <Tabs defaultValue="csv" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Raw Text Input
            </TabsTrigger>
            <TabsTrigger value="csv" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              CSV Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Card>
              <CardContent className="pt-6">
                <Textarea
                  placeholder="Paste your raw team updates here..."
                  className="min-h-[200px]"
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csv">
            <Card>
              <CardContent className="pt-6">
                <FileUpload onFileChange={handleFileChange} onUseDemoFile={handleUseDemoFile} fileName={fileName} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                id="auto-summarization"
                checked={useAutoSummarization}
                onCheckedChange={setUseAutoSummarization}
              />
              <Label htmlFor="auto-summarization" className="font-medium">
                Use Auto-Summarization Engine
              </Label>
            </div>
            <span className="text-sm text-blue-600 font-medium">Recommended</span>
          </div>

          <div className="flex items-center justify-between bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2">
              <Switch
                id="priority-scoring"
                checked={enablePriorityScoring}
                onCheckedChange={setEnablePriorityScoring}
              />
              <Label htmlFor="priority-scoring" className="font-medium">
                Enable Priority Scoring
              </Label>
            </div>
            <span className="text-sm text-purple-600 font-medium">New</span>
          </div>
        </div>

        <Button
          className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={isLoading || (activeTab === "csv" && !file && !fileName) || (activeTab === "text" && !rawText)}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Generating...
            </span>
          ) : (
            "Generate Executive Summary"
          )}
        </Button>
      </div>
    </main>
  )
}
