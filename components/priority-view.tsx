import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PriorityViewProps {
  report: any
}

export function PriorityView({ report }: PriorityViewProps) {
  // Mock priority scores for demonstration
  const priorityScores = [
    {
      type: "risk",
      content: report.items.find((i: any) => i.type === "risk")?.content || "No risks found",
      score: 92,
    },
    {
      type: "blocker",
      content: report.items.find((i: any) => i.type === "blocker")?.content || "No blockers found",
      score: 85,
    },
    {
      type: "win",
      content: report.items.find((i: any) => i.type === "win")?.content || "No wins found",
      score: 78,
    },
    {
      type: "task",
      content: report.items.find((i: any) => i.type === "task")?.content || "No tasks found",
      score: 65,
    },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blocker":
        return "text-orange-600"
      case "risk":
        return "text-red-600"
      case "task":
        return "text-blue-600"
      case "win":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getProgressColor = (type: string) => {
    switch (type) {
      case "blocker":
        return "bg-orange-500"
      case "risk":
        return "bg-red-500"
      case "task":
        return "bg-blue-500"
      case "win":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {priorityScores.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium capitalize">{item.type}</div>
                <div className={`font-bold ${getTypeColor(item.type)}`}>{item.score}</div>
              </div>
              <Progress value={item.score} className="h-2" indicatorClassName={getProgressColor(item.type)} />
              <p className="text-sm text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
