"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usePathname, useRouter } from "next/navigation"
import { getCourseIdFromRoute } from "@/lib/course-utils"

const courses = [
  {
    id: "calc-ab",
    label: "AP Calculus",
    href: "/dashboard/ap-calc-ab"
  },
  {
    id: "cs-a",
    label: "AP Computer Science A",
    href: "/dashboard/ap-cs-a"
  },
  {
    id: "cs-principles",
    label: "AP Computer Science Principles",
    href: "/dashboard/ap-cs-principles"
  },
  {
    id: "statistics",
    label: "AP Statistics",
    href: "/dashboard/ap-statistics"
  },
  {
    id: "world-history",
    label: "AP World History: Modern",
    href: "/dashboard/ap-world-history"
  },
]

interface CourseSelectorProps {
  selectedCourse: string
  onCourseChange: (courseId: string) => void
}

export function CourseSelector({ selectedCourse: propSelectedCourse, onCourseChange }: CourseSelectorProps) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  // Use the current route to determine the selected course
  const currentCourseId = React.useMemo(() => {
    return getCourseIdFromRoute(pathname) || propSelectedCourse
  }, [pathname, propSelectedCourse])

  const selectedCourseLabel = React.useMemo(() => {
    return courses.find((course) => course.id === currentCourseId)?.label || "Select Course"
  }, [currentCourseId])

  const availableCourses = React.useMemo(() => {
    return courses.filter(course => course.id !== currentCourseId)
  }, [currentCourseId])

  const handleCourseSelect = React.useCallback((courseId: string) => {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      router.push(course.href)
      onCourseChange(courseId)
      setOpen(false)
    }
  }, [router, onCourseChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between text-base font-normal"
        >
          {selectedCourseLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search courses..." />
          <CommandList>
            <CommandEmpty>No course found.</CommandEmpty>
            <CommandGroup>
              {availableCourses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={course.label}
                  onSelect={() => handleCourseSelect(course.id)}
                >
                  <Check className={cn("mr-2 h-4 w-4", currentCourseId === course.id ? "opacity-100" : "opacity-0")} />
                  {course.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

