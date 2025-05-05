import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SignalsView() {
  // Mock data for demonstration
  const signals = [
    {
      id: 1,
      section: "Security",
      text: "Security audit identified 3 critical vulnerabilities requiring immediate patching",
      date: "2025-04-14",
      changed: "Yes",
      viewed: "No",
    },
    {
      id: 2,
      section: "Sales Performance",
      text: "Q2 revenue projections 15% below target due to delayed product launch",
      date: "2025-04-11",
      changed: "Yes",
      viewed: "No",
    },
    {
      id: 3,
      section: "Tech Debt",
      text: "API integration with payment processor blocked by missing documentation",
      date: "2025-04-13",
      changed: "Yes",
      viewed: "No",
    },
    {
      id: 4,
      section: "Customer Feedback",
      text: "Customer retention increased 12% following new onboarding implementation",
      date: "2025-04-09",
      changed: "Yes",
      viewed: "Yes",
    },
    {
      id: 5,
      section: "Sprint velocity",
      text: "Sprint velocity improved 8% this quarter through process optimization",
      date: "2025-04-12",
      changed: "Yes",
      viewed: "Yes",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Raw Signals</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Changed</TableHead>
              <TableHead>Viewed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.map((signal) => (
              <TableRow key={signal.id}>
                <TableCell className="font-medium">{signal.section}</TableCell>
                <TableCell>{signal.text}</TableCell>
                <TableCell>{signal.date}</TableCell>
                <TableCell>{signal.changed}</TableCell>
                <TableCell>{signal.viewed}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
