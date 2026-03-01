import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 
const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "mcq", label: "Multiple Choice" },
  { value: "frq", label: "Free Response" },
  { value: "dbq", label: "Document-Based" },
  { value: "saq", label: "Short Answer" },
  { value: "full", label: "Full AP Test" },
]

const dateOptions = [
  { value: "all", label: "All Time" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
]

interface PracticeHistoryFiltersProps {
  activeFilters: {
    type: string
    date: string
  }
  setActiveFilters: React.Dispatch<
    React.SetStateAction<{
      type: string
      date: string
    }>
  >
}

export function PracticeHistoryFilters({ activeFilters, setActiveFilters }: PracticeHistoryFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Practice Type</Label>
          <RadioGroup
            value={activeFilters.type}
            onValueChange={(value) => setActiveFilters((prev) => ({ ...prev, type: value }))}
          >
            {typeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`type-${option.value}`} />
                <Label htmlFor={`type-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="space-y-4">
          <Label>Date Range</Label>
          <RadioGroup
            value={activeFilters.date}
            onValueChange={(value) => setActiveFilters((prev) => ({ ...prev, date: value }))}
          >
            {dateOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`date-${option.value}`} />
                <Label htmlFor={`date-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}

