import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowRight } from "lucide-react"

const lessonBlurbs = [
  {
    id: 1,
    title: "Understanding Limits",
    description: "Learn the fundamental concept of limits in calculus and how they relate to continuity.",
    difficulty: "Intermediate",
    estimatedTime: "30 mins",
  },
  {
    id: 2,
    title: "Derivatives and Rate of Change",
    description: "Explore the relationship between derivatives and rates of change in real-world scenarios.",
    difficulty: "Advanced",
    estimatedTime: "45 mins",
  },
  {
    id: 3,
    title: "Integration Techniques",
    description: "Master various integration techniques, including substitution and integration by parts.",
    difficulty: "Advanced",
    estimatedTime: "60 mins",
  },
]

export function LessonBlurbs() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lessonBlurbs.map((lesson) => (
        <Card key={lesson.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              {lesson.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <p className="text-sm text-muted-foreground mb-4">{lesson.description}</p>
            <div className="flex items-center gap-2 mt-auto mb-4">
              <Badge variant="secondary">{lesson.difficulty}</Badge>
              <Badge variant="outline">{lesson.estimatedTime}</Badge>
            </div>
            <Button variant="outline" className="self-start">
              Start Lesson
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

