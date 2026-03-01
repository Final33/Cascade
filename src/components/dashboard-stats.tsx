"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Target, Trophy } from "lucide-react"

const stats = [
  {
    title: "Practice Hours",
    value: "32.5",
    description: "Total study time",
    icon: Clock,
    trend: "+2.5 this week",
  },
  {
    title: "Questions Answered",
    value: "847",
    description: "Across all courses",
    icon: Brain,
    trend: "+124 this week",
  },
  {
    title: "Average Score",
    value: "84%",
    description: "On practice tests",
    icon: Target,
    trend: "+2% improvement",
  },
  {
    title: "Achievements",
    value: "12",
    description: "Study milestones",
    icon: Trophy,
    trend: "2 new this week",
  },
]

export const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

