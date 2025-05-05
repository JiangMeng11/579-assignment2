import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllReports } from "@/lib/report-service"
import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"

export default async function ReportsPage() {
  const reports = await getAllReports()

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Report History</h1>
          <p className="text-muted-foreground">View all generated reports</p>
        </div>
        <Button asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No reports generated yet</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Report from {new Date(report.generatedAt).toLocaleDateString()}
                  </CardTitle>
                  <div className="flex items-center">
                    {report.acknowledged ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Read</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-500">
                        <XCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Unread</span>
                      </div>
                    )}
                  </div>
                </div>
                <CardDescription>{report.items.length} items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/acknowledge/${report.id}`}>View Report</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
