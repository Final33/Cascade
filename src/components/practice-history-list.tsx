import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Target, RefreshCcw, Play, Clock, Trophy, Loader2 } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'

// Define the Test interface based on the Supabase schema from the image
export interface Test {
  id: string;
  user_id: string;
  test_type: string; // 'mcq', 'frq', 'dbq', 'full', etc.
  difficulty: string;
  selected_units: string[];
  score: number; // Number of correct answers
  total_time: number; // in seconds
  question_count: number;
  completed_at: string; // ISO date string
  created_at: string; // ISO date string
}

interface PracticeHistoryListProps {
  testHistory: Test[]
  activeFilters: {
    // class: string // Removed class filter
    type: string
    date: string
  }
  onReviewTest: (testId: string) => void // Callback to handle review click
  isReviewLoading: boolean // To disable review button while loading details
}

// Helper function to format test type (can be shared)
function formatTestType(type: string): string {
  switch (type?.toLowerCase()) {
    case 'mcq': return 'Multiple Choice';
    case 'frq': return 'Free Response';
    case 'dbq': return 'Document-Based';
    case 'full': return 'Full AP Test';
    case 'saq': return 'Short Answer'; // Added based on other components
    default: return type || 'Unknown Type';
  }
}

// Helper function to format time (can be shared)
function formatTime(seconds: number): string {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return 'N/A';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60); // Ensure seconds are whole numbers
  return `${mins}m ${secs}s`;
}

// Helper function to get date range start (can be shared)
function getDateRangeStart(filter: string): Date | null {
    const now = new Date();
    switch (filter) {
        case 'week':
            const firstDayOfWeek = now.getDate() - now.getDay(); // Adjust based on week start preference (e.g., Sunday)
            return new Date(now.setDate(firstDayOfWeek));
        case 'month':
            return new Date(now.getFullYear(), now.getMonth(), 1);
        case 'year':
            return new Date(now.getFullYear(), 0, 1);
        case 'all':
        default:
            return null; // No date filtering
    }
}

export function PracticeHistoryList({ testHistory, activeFilters, onReviewTest, isReviewLoading }: PracticeHistoryListProps) {

  const dateFilterStart = getDateRangeStart(activeFilters.date);

  const filteredHistory = testHistory.filter((item) => {
    // Type filter
    if (activeFilters.type !== "all" && item.test_type?.toLowerCase() !== activeFilters.type) {
      return false;
    }
    // Date filter
    if (dateFilterStart) {
        const completedDate = new Date(item.completed_at);
        if (isNaN(completedDate.getTime()) || completedDate < dateFilterStart) {
            return false;
        }
    }
    // Class filter removed as it's not in the 'tests' table schema
    // if (activeFilters.class !== "all" && item.class.toLowerCase() !== activeFilters.class) return false

    return true
  })

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "mcq":
        return <Target className="h-4 w-4" />
      case "frq":
      case "saq": // Group similar types if desired
        return <FileText className="h-4 w-4" />
      case "dbq":
        return <BookOpen className="h-4 w-4" />
      case "full":
        return <FileText className="h-4 w-4" /> // Or a different icon for full tests
      default:
        return null
    }
  }

  // Placeholder for redo functionality - might open PracticeTestDialog
  const handleRedo = (test: Test) => {
    console.log(`Redo practice session ${test.id} of type ${test.test_type}`)
    // Potential implementation: Open PracticeTestDialog with settings from 'test'
    // e.g., setDialogOpen(true), setInitialType(test.test_type), etc.
  }

  if (!Array.isArray(testHistory)) {
     console.error("PracticeHistoryList received non-array testHistory:", testHistory);
     return <p className="text-destructive">Error displaying test history.</p>; // Or some other error indication
  }

  if (filteredHistory.length === 0) {
    return <p className="text-muted-foreground">No matching test history found. Try adjusting the filters or take a new test!</p>;
  }

  return (
    <div className="space-y-3">
      {filteredHistory.map((test) => {
        // Calculate score percentage, handle division by zero
        const scorePercentage = test.question_count > 0
          ? Math.round((test.score / test.question_count) * 100)
          : 0;
        const completedDate = new Date(test.completed_at);

        return (
          <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left Side: Test Info */}
                <div className="flex items-center gap-4 flex-1">
                  <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 h-fit">
                    {getTypeIcon(test.test_type)}
                    <span className="uppercase">{test.test_type || 'N/A'}</span>
                  </Badge>
                  <div className="space-y-1">
                    {/* Use test type and units/difficulty as title */}
                    <h3 className="text-lg font-semibold">{formatTestType(test.test_type)} Practice</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {/* Display Difficulty */}
                      <span className="capitalize">{test.difficulty || 'N/A'} Difficulty</span>
                      {/* Display Date */}
                      <span>
                        {isNaN(completedDate.getTime()) ? 'Invalid Date' : formatDistanceToNow(completedDate, { addSuffix: true })}
                      </span>
                       {/* Display Time Taken */}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {formatTime(test.total_time)}
                      </span>
                      {/* Display Question Count */}
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {test.question_count || 0} questions
                      </span>
                       {/* Display Correct Count */}
                       <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> {test.score || 0} correct
                      </span>
                    </div>
                     {/* Display Selected Units */}
                     {test.selected_units && test.selected_units.length > 0 && (
                        <div className="mt-1">
                            <p className="text-xs text-gray-500">Topics:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                            {test.selected_units.map((unit, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {unit}
                                </span>
                            ))}
                            </div>
                        </div>
                     )}
                  </div>
                </div>

                {/* Right Side: Score and Actions */}
                <div className="flex items-center gap-4 w-full sm:w-auto pt-2 sm:pt-0">
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold">{scorePercentage}%</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {/* Redo Button - Placeholder */}
                    <Button size="sm" variant="outline" onClick={() => handleRedo(test)} title="Redo this type of test">
                      <RefreshCcw className="h-4 w-4" />
                      {/* <span className="ml-2 hidden sm:inline">Redo</span> */}
                    </Button>
                    {/* Review Button */}
                    <Button
                      size="sm"
                      onClick={() => onReviewTest(test.id)}
                      disabled={isReviewLoading} // Disable while loading details
                      title="Review this test"
                    >
                      {isReviewLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                       {/* <span className="ml-2 hidden sm:inline">Review</span> */}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

