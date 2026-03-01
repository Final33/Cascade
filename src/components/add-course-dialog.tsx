"use client"

import { useState } from "react"
import { Check, Code, ActivityIcon as Function, Globe, LineChart, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useCourses } from "@/context/course-context"

interface AddCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableCourses = [
  {
    id: "calculus-bc",
    title: "AP Calculus BC",
    icon: Function,
    color: "bg-rose-500",
    description: "Advanced calculus concepts including series and polar equations",
  },
  {
    id: "physics-c",
    title: "AP Physics C",
    icon: LineChart,
    color: "bg-orange-500",
    description: "Mechanics, electricity, and magnetism with calculus applications",
  },
  {
    id: "cs-principles",
    title: "AP CS Principles",
    icon: Code,
    color: "bg-emerald-500",
    description: "Fundamental concepts of programming and computer science",
  },
  {
    id: "european-history",
    title: "AP European History",
    icon: Globe,
    color: "bg-cyan-500",
    description: "European history from 1450 to the present",
  },
]

export function AddCourseDialog({ open, onOpenChange }: AddCourseDialogProps) {
  const [search, setSearch] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const { addCourse } = useCourses()

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddCourse = () => {
    if (selectedCourse) {
      const courseToAdd = availableCourses.find((course) => course.id === selectedCourse)
      if (courseToAdd) {
        addCourse(courseToAdd)
        onOpenChange(false)
        setSelectedCourse(null)
        setSearch("")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add AP Course</DialogTitle>
          <DialogDescription>Choose an AP course to add to your dashboard</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <button
                key={course.id}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors hover:bg-muted",
                  selectedCourse === course.id && "border-primary",
                )}
                onClick={() => setSelectedCourse(course.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-full p-2", course.color)}>
                      <course.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-muted-foreground">{course.description}</div>
                    </div>
                  </div>
                  {selectedCourse === course.id && <Check className="h-4 w-4 text-primary" />}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!selectedCourse} onClick={handleAddCourse}>
            Add Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

