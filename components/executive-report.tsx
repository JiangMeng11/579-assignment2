import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, XCircle, TrendingUp } from "lucide-react"

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
}

export function ExecutiveReport({ report }: { report: Report }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "blocker":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "risk":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "task":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "win":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "blocker":
        return "destructive"
      case "risk":
        return "warning"
      case "task":
        return "default"
      case "win":
        return "success"
      default:
        return "default"
    }
  }

  const getTitle = (type: string) => {
    switch (type) {
      case "blocker":
        return "Blocker"
      case "risk":
        return "Risk"
      case "task":
        return "Task Completed"
      case "win":
        return "Major Win"
      default:
        return "Item"
    }
  }

  return (
    <div className="space-y-4">
      {report.items.map((item, index) => (
        <Alert key={index} variant={getAlertVariant(item.type) as any}>
          <div className="flex items-start">
            {getIcon(item.type)}
            <div className="ml-3">
              <AlertTitle>{getTitle(item.type)}</AlertTitle>
              <AlertDescription>{item.content}</AlertDescription>
            </div>
          </div>
        </Alert>
      ))}

      {report.acknowledged && (
        <div className="mt-4 text-sm text-muted-foreground">
          Acknowledged on {new Date(report.acknowledgedAt!).toLocaleDateString()} at{" "}
          {new Date(report.acknowledgedAt!).toLocaleTimeString()}
        </div>
      )}
    </div>
  )
}
