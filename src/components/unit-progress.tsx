"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const courseUnits = {
  "calculus-ab": [
    { name: "Limits and Continuity", progress: 85, resources: 16 },
    { name: "Differentiation", progress: 62, resources: 19 },
    { name: "Integration", progress: 45, resources: 23 },
    { name: "Differential Equations", progress: 28, resources: 11 },
    { name: "Applications of Integration", progress: 15, resources: 18 },
    { name: "Series and Sequences", progress: 5, resources: 21 },
  ],
  "computer-science-a": [
    { name: "Primitive Types", progress: 90, resources: 12 },
    { name: "Objects", progress: 75, resources: 15 },
    { name: "Boolean Expressions", progress: 60, resources: 10 },
    { name: "Iteration", progress: 45, resources: 14 },
    { name: "Classes", progress: 30, resources: 20 },
    { name: "Arrays", progress: 20, resources: 18 },
  ],
  "world-history": [
    { name: "The Global Tapestry", progress: 70, resources: 14 },
    { name: "Networks of Exchange", progress: 55, resources: 16 },
    { name: "Land-Based Empires", progress: 40, resources: 12 },
    { name: "Transoceanic Interconnections", progress: 25, resources: 18 },
    { name: "Revolutions", progress: 10, resources: 20 },
    { name: "Consequences of Industrialization", progress: 5, resources: 15 },
  ],
}

export function UnitProgress() {
  const [activeTab, setActiveTab] = useState("calculus-ab")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Unit Progress Overview</CardTitle>
        <CardDescription>Track your progress through each unit across your AP courses</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculus-ab">AP Calculus</TabsTrigger>
            <TabsTrigger value="computer-science-a">AP CS A</TabsTrigger>
            <TabsTrigger value="world-history">AP World History</TabsTrigger>
          </TabsList>
          {Object.entries(courseUnits).map(([courseId, units]) => (
            <TabsContent key={courseId} value={courseId}>
              <div className="space-y-6">
                {units.map((unit) => (
                  <div key={unit.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{unit.name}</span>
                      <span className="text-muted-foreground">{unit.resources} resources</span>
                    </div>
                    <Progress value={unit.progress} className="h-2" />
                    <div className="text-right text-sm text-muted-foreground">{unit.progress}% complete</div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

