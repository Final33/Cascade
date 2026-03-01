import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar } from "lucide-react"

interface CourseCardProps {
  id: string
  title: string
  teacher: string
  section: string
  color: string
  icon: string
  examDate: string
}

const colorVariants = {
  teal: "bg-teal-600",
  purple: "bg-purple-600",
  pink: "bg-pink-600",
  blue: "bg-blue-600",
  indigo: "bg-indigo-600",
}

export function CourseCard({ id, title, teacher, section, color, examDate }: CourseCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`${colorVariants[color as keyof typeof colorVariants]} p-6 text-white`}>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/90 text-sm">
          {section} with {teacher}
        </p>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Exam Day: {examDate}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t p-6 flex flex-col gap-4">
        <Button asChild className="w-full">
          <Link href={`/courses/${id}`}>Go to AP Classroom</Link>
        </Button>
        <div className="flex gap-4 text-sm">
          <Link href={`/courses/${id}/guide`} className="text-primary hover:underline">
            Course Guide
          </Link>
          <Link href={`/courses/${id}/assignments`} className="text-primary hover:underline">
            Assignments
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

