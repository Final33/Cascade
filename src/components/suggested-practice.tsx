import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Target, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const suggestedPractices = [
  {
    id: 1,
    type: "review",
    title: "Review Limit Laws",
    description:
      "Based on your recent quiz results, we recommend reviewing the laws of limits to strengthen your foundation.",
    icon: BookOpen,
  },
  {
    id: 2,
    type: "practice",
    title: "Practice Integration by Parts",
    description:
      "You've shown proficiency in basic integration. Let's challenge your skills with a focused MCQ set on integration by parts.",
    practiceDetails: "Quick MCQ - 10 questions",
    icon: Target,
  },
  {
    id: 3,
    type: "review",
    title: "Refresh on Derivative Rules",
    description:
      "Your recent performance indicates a need to revisit derivative rules. This review will help solidify your understanding.",
    icon: BookOpen,
  },
  {
    id: 4,
    type: "practice",
    title: "Master the Chain Rule",
    description:
      "Ready to put your derivative skills to the test? This practice set focuses on applying the chain rule in various scenarios.",
    practiceDetails: "Mixed Question Set - 5 MCQ, 2 FRQ",
    icon: Target,
  },
]

export function SuggestedPractice() {
  return (
    <ScrollArea className="h-[600px]">
      <div className="grid gap-6 md:grid-cols-2">
        {suggestedPractices.map((practice) => (
          <Card key={practice.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {practice.type === "review" ? (
                  <BookOpen className="h-5 w-5 text-blue-500" />
                ) : (
                  <Target className="h-5 w-5 text-green-500" />
                )}
                {practice.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{practice.description}</p>
              {practice.type === "practice" && (
                <Badge variant="secondary" className="self-start mb-4">
                  {practice.practiceDetails}
                </Badge>
              )}
              <Button className="self-start mt-auto" variant={practice.type === "review" ? "outline" : "default"}>
                {practice.type === "review" ? "Start Review" : "Begin Practice"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

