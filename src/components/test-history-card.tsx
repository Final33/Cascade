import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Clock, Trophy } from 'lucide-react';

interface TestHistoryCardProps {
  test: {
    id: string;
    test_type: string;
    difficulty: string;
    score: number;
    question_count: number;
    total_time: number;
    completed_at: string;
    selected_units: string[];
  };
  onReview: (testId: string) => void;
}

export function TestHistoryCard({ test, onReview }: TestHistoryCardProps) {
  const scorePercentage = Math.round((test.score / test.question_count) * 100);
  const testDate = new Date(test.completed_at);
  
  // Format the test type for display
  const formatTestType = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'frq': return 'Free Response';
      case 'dbq': return 'Document-Based';
      case 'full': return 'Full AP Test';
      default: return type;
    }
  };
  
  // Format time (seconds to mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  // Format difficulty for display
  const formatDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      case 'ap-level': return 'AP Level';
      default: return difficulty;
    }
  };
  
  // Generate background color based on score
  const getScoreColor = () => {
    if (scorePercentage >= 90) return 'bg-green-100';
    if (scorePercentage >= 70) return 'bg-blue-100';
    if (scorePercentage >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className={`${getScoreColor()} pb-2`}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{formatTestType(test.test_type)} Test</CardTitle>
            <CardDescription>
              {formatDifficulty(test.difficulty)} • {formatDistanceToNow(testDate, { addSuffix: true })}
            </CardDescription>
          </div>
          <div className="rounded-full h-12 w-12 bg-white flex items-center justify-center">
            <span className="font-bold">{scorePercentage}%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{test.question_count} questions</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatTime(test.total_time)}</span>
          </div>
          
          <div className="flex items-center">
            <Trophy className="h-4 w-4 mr-1" />
            <span>{test.score} correct</span>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-xs text-gray-500">Topics:</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {test.selected_units.map((unit, i) => (
              <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {unit}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => onReview(test.id)}
        >
          Review Test
        </Button>
      </CardFooter>
    </Card>
  );
} 