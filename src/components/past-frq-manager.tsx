"use client"

import * as React from "react"
import { PastFRQ } from "@/types/frq"
import { addPastFRQ, deletePastFRQ, getPastFRQsByCourse } from "@/lib/frq-storage"
import { defaultFRQs } from "@/data/frqs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface PastFRQManagerProps {
  course: string
  onSelectFRQ?: (frq: PastFRQ) => void
}

type NewFRQ = {
  year: number
  questionNumber: number
  title: string
  content: string
  topics: string[]
  rubric: {
    points: number
    criteria: string[]
  }
}

type Filters = {
  year: string
  topic: string
  difficulty: string
}

export function PastFRQManager({ course, onSelectFRQ }: PastFRQManagerProps) {
  const [isAdding, setIsAdding] = React.useState(false)
  const [frqs, setFRQs] = React.useState<PastFRQ[]>([])
  const [filters, setFilters] = React.useState<Filters>({
    year: "all",
    topic: "all",
    difficulty: "all"
  })
  const [newFRQ, setNewFRQ] = React.useState<NewFRQ>({
    year: new Date().getFullYear(),
    questionNumber: 1,
    title: "",
    content: "",
    topics: [],
    rubric: {
      points: 9,
      criteria: [""]
    }
  })

  React.useEffect(() => {
    // Get both default and user-added FRQs
    setFRQs(getPastFRQsByCourse(course))
  }, [course])

  // Get unique years and topics from FRQs
  const years = React.useMemo(() => {
    const uniqueYears = Array.from(new Set(frqs.map(frq => frq.year)))
    return ["all", ...uniqueYears.sort((a, b) => b - a).map(year => year.toString())]
  }, [frqs])

  const topics = React.useMemo(() => {
    const uniqueTopics = Array.from(new Set(frqs.flatMap(frq => frq.topics)))
    return ["all", ...uniqueTopics.sort()]
  }, [frqs])

  const difficulties = ["all", "ap-level"]

  // Filter FRQs based on selected filters
  const filteredFRQs = React.useMemo(() => {
    return frqs.filter(frq => {
      const yearMatch = filters.year === "all" || frq.year.toString() === filters.year
      const topicMatch = filters.topic === "all" || frq.topics.includes(filters.topic)
      const difficultyMatch = filters.difficulty === "all" || "ap-level" === filters.difficulty
      return yearMatch && topicMatch && difficultyMatch
    })
  }, [frqs, filters])

  const handleAddFRQ = () => {
    const frq = addPastFRQ({
      ...newFRQ,
      course
    })
    setFRQs(prev => [...prev, frq])
    setIsAdding(false)
    setNewFRQ({
      year: new Date().getFullYear(),
      questionNumber: 1,
      title: "",
      content: "",
      topics: [],
      rubric: {
        points: 9,
        criteria: [""]
      }
    })
  }

  const handleDelete = (id: string) => {
    deletePastFRQ(id)
    setFRQs(prev => prev.filter(frq => frq.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Past FRQs</h3>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Past FRQ
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Year</Label>
          <Select
            value={filters.year}
            onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Topic</Label>
          <Select
            value={filters.topic}
            onValueChange={(value) => setFilters(prev => ({ ...prev, topic: value }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All Topics" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic === "all" ? "All Topics" : topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Difficulty</Label>
          <Select
            value={filters.difficulty}
            onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value }))}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty === "all" ? "All Difficulties" : difficulty.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Past FRQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Input
                  type="number"
                  value={newFRQ.year}
                  onChange={e => setNewFRQ(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Question Number</label>
                <Input
                  type="number"
                  value={newFRQ.questionNumber}
                  onChange={e => setNewFRQ(prev => ({ ...prev, questionNumber: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newFRQ.title}
                onChange={e => setNewFRQ(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Particle Motion"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Topics (comma-separated)</label>
              <Input
                value={newFRQ.topics.join(", ")}
                onChange={e => setNewFRQ(prev => ({ ...prev, topics: e.target.value.split(",").map(t => t.trim()).filter(Boolean) }))}
                placeholder="e.g., Limits, Continuity, Derivatives"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Question Content</label>
              <Textarea
                value={newFRQ.content}
                onChange={e => setNewFRQ(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter the FRQ question content..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleAddFRQ}>Save FRQ</Button>
          </CardFooter>
        </Card>
      )}

      <ScrollArea className="h-[400px] rounded-md border">
        <div className="p-4 space-y-4">
          {filteredFRQs.map(frq => (
            <Card key={frq.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{frq.title || `${frq.year} Q${frq.questionNumber}`}</CardTitle>
                  {/* Only show delete button for user-added FRQs */}
                  {!defaultFRQs[course]?.some((defaultFrq: PastFRQ) => defaultFrq.id === frq.id) && (
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(frq.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <CardDescription>Year {frq.year}, Question {frq.questionNumber}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {frq.topics.map(topic => (
                      <Badge key={topic} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                  <p className="text-sm line-clamp-2">{frq.content}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSelectFRQ?.(frq)
                  }}
                >
                  Use This FRQ
                </Button>
              </CardFooter>
            </Card>
          ))}
          {filteredFRQs.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {frqs.length === 0 ? "No past FRQs available for this course" : "No FRQs match the selected filters"}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 