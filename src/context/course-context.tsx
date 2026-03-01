"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import { BookOpen, Code, Globe, LineChart, Variable } from "lucide-react"

export interface Course {
  id: string
  title: string
  icon: React.ElementType
  color: string
  progress: number
  href: string
}

interface CourseContextType {
  courses: Course[]
  addCourse: (course: Omit<Course, "progress" | "href">) => void
}

const CourseContext = createContext<CourseContextType | undefined>(undefined)

const initialCourses: Course[] = [
  {
    id: "calculus-ab",
    title: "AP Calculus",
    icon: Variable,
    color: "bg-purple-500",
    progress: 85,
    href: "/dashboard/ap-calc-ab",
  },
  {
    id: "cs-a",
    title: "AP CS A",
    icon: Code,
    color: "bg-teal-500",
    progress: 72,
    href: "/dashboard/ap-cs-a",
  },
  {
    id: "statistics",
    title: "AP Statistics",
    icon: LineChart,
    color: "bg-blue-500",
    progress: 64,
    href: "/dashboard/ap-statistics",
  },
  {
    id: "world-history",
    title: "AP World History",
    icon: Globe,
    color: "bg-indigo-500",
    progress: 58,
    href: "/dashboard/ap-world-history",
  },
]

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses)

  const addCourse = (newCourse: Omit<Course, "progress" | "href">) => {
    setCourses((prevCourses) => [
      ...prevCourses,
      {
        ...newCourse,
        progress: 0,
        href: `/dashboard/${newCourse.id}`,
      },
    ])
  }

  return <CourseContext.Provider value={{ courses, addCourse }}>{children}</CourseContext.Provider>
}

export const useCourses = () => {
  const context = useContext(CourseContext)
  if (context === undefined) {
    throw new Error("useCourses must be used within a CourseProvider")
  }
  return context
}

