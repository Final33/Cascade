"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, FileText, Settings } from "lucide-react"
import { PracticeTestDialog } from "@/components/practice-test-dialog"
import { usePathname } from 'next/navigation'
import { getCourseIdFromRoute } from '@/lib/course-utils'

interface AIPracticeCardProps {
  title: string
  description: string
  duration: string
  questionCount: number
  type: "mcq" | "frq" | "full"
  onGenerate: () => void
}

export function AIPracticeCard({ title, description, duration, questionCount, type, onGenerate }: AIPracticeCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const pathname = usePathname()
  const routeCourse = getCourseIdFromRoute(pathname)

  const handleGenerateClick = () => {
    setDialogOpen(true)
    if (typeof onGenerate === 'function') {
      onGenerate()
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <Badge variant={type === "mcq" ? "default" : type === "frq" ? "secondary" : "destructive"}>
              {type.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{questionCount} questions</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleGenerateClick} className="flex-1">
            Generate Practice Set
          </Button>
          <Button variant="outline" size="icon" aria-label="Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <PracticeTestDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        initialTestType={type}
        initialCourse={routeCourse}
      />
    </>
  )
}

