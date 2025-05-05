import { AlertTriangle, CheckCircle, Trophy, XCircle } from "lucide-react"

interface SummaryItemProps {
  type: "blocker" | "risk" | "task" | "win"
  content: string
  date: string
}

export function SummaryItem({ type, content, date }: SummaryItemProps) {
  const getTypeLabel = () => {
    switch (type) {
      case "blocker":
        return "Blocker"
      case "risk":
        return "Risk"
      case "task":
        return "Task"
      case "win":
        return "Win"
      default:
        return "Item"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "blocker":
        return <XCircle className="h-6 w-6 text-orange-500" />
      case "risk":
        return <AlertTriangle className="h-6 w-6 text-red-500" />
      case "task":
        return <CheckCircle className="h-6 w-6 text-blue-500" />
      case "win":
        return <Trophy className="h-6 w-6 text-green-500" />
      default:
        return null
    }
  }

  const getBgColor = () => {
    switch (type) {
      case "blocker":
        return "bg-orange-50"
      case "risk":
        return "bg-red-50"
      case "task":
        return "bg-white"
      case "win":
        return "bg-green-50"
      default:
        return "bg-white"
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case "blocker":
        return "bg-orange-100 text-orange-800"
      case "risk":
        return "bg-red-100 text-red-800"
      case "task":
        return "bg-blue-100 text-blue-800"
      case "win":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className={`p-4 ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium px-2 py-0.5 rounded ${getTypeColor()}`}>{getTypeLabel()}</span>
            <span className="text-sm text-gray-500">{date}</span>
          </div>
          <p className="text-gray-900">{content}</p>
        </div>
      </div>
    </div>
  )
}
