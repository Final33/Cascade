"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddCourseDialog } from "@/components/add-course-dialog"
import { useState } from "react"
import { useCourses } from "@/context/course-context"

export const CourseCircles = () => {
  const [open, setOpen] = useState(false)
  const { courses } = useCourses()

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {courses.map((course, index) => (
          <Link key={course.id} href={course.href}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className={`
                ${course.color} aspect-square rounded-full p-8
                flex flex-col items-center justify-center text-center
                text-white transition-transform hover:scale-105
                hover:shadow-lg cursor-pointer
              `}
              >
                <course.icon className="h-10 w-10 mb-3" />
                <h3 className="font-semibold">{course.title}</h3>
                <div className="mt-2 text-sm text-white/90">{course.progress}% Complete</div>
              </div>
            </motion.div>
          </Link>
        ))}

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: courses.length * 0.1 }}
        >
          <Button
            variant="outline"
            className="aspect-square h-full w-full rounded-full p-8
              flex flex-col items-center justify-center text-center
              border-2 border-dashed transition-colors
              hover:border-primary hover:bg-primary/5"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-10 w-10 mb-3" />
            <span className="font-semibold">Add Course</span>
            <span className="mt-2 text-sm text-muted-foreground">Explore AP courses</span>
          </Button>
        </motion.div>
      </div>

      <AddCourseDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

