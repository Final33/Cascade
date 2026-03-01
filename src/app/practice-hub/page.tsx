"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useState, useEffect } from 'react';
import { getUserTestHistory, getTestDetails} from '@/lib/supabase/test-results';
import { TestHistoryCard } from '@/components/test-history-card';
import { TestReviewDialog } from '@/components/test-review-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle } from 'lucide-react';
import { PracticeTestDialog } from '@/components/practice-test-dialog';

export default function PracticeHub() {
  const [testHistory, setTestHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testReviewOpen, setTestReviewOpen] = useState(false);
  const [selectedTestDetails, setSelectedTestDetails] = useState(null);
  const [practiceDialogOpen, setPracticeDialogOpen] = useState(false);
  const [initialTestType, setInitialTestType] = useState('mcq');
  
  // Fetch test history on component mount
  useEffect(() => {
    async function fetchTestHistory() {
      try {
        setIsLoading(true);
        const history = await getUserTestHistory();
        setTestHistory(history);
      } catch (error) {
        console.error('Error fetching test history:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your test history.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTestHistory();
  }, []);

  
  // Handle viewing a test review
  const handleReviewTest = async (testId: string) => {
    try {
      setIsLoading(true);
      const details = await getTestDetails(testId);
      
      // Format test details for the review dialog
      const formattedResults = {
        questions: details.questions.map(q => ({
          ...q,
          options: q.options || [],
          documents: q.documents || [],
          rubric: q.rubric || {},
          isCorrect: q.is_correct,
          userAnswer: q.user_answer,
        })),
        score: details.test.score,
        totalTime: details.test.total_time,
        completedAt: new Date(details.test.completed_at),
      };
      
      setSelectedTestDetails(formattedResults);
      setTestReviewOpen(true);
    } catch (error) {
      console.error('Error fetching test details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load test details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter tests by type
  const filterTestsByType = (type: string) => {
    if (type === 'all') return testHistory;
    return testHistory.filter(test => test.test_type === type);
  };
  
  // Handle starting a new practice test
  const handleStartPractice = (type: string) => {
    setInitialTestType(type);
    setPracticeDialogOpen(true);
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Practice Hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Button 
          onClick={() => handleStartPractice('mcq')}
          className="flex items-center justify-center p-6 h-auto"
        >
          <div className="text-center">
            <PlusCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Multiple Choice</h3>
            <p className="text-sm text-gray-500">Practice with MCQs</p>
          </div>
        </Button>
        
        <Button 
          onClick={() => handleStartPractice('frq')}
          variant="outline"
          className="flex items-center justify-center p-6 h-auto"
        >
          <div className="text-center">
            <PlusCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Free Response</h3>
            <p className="text-sm text-gray-500">Practice with FRQs</p>
          </div>
        </Button>
        
        <Button 
          onClick={() => handleStartPractice('dbq')}
          variant="outline"
          className="flex items-center justify-center p-6 h-auto"
        >
          <div className="text-center">
            <PlusCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Document-Based</h3>
            <p className="text-sm text-gray-500">Practice with DBQs</p>
          </div>
        </Button>
        
        <Button 
          onClick={() => handleStartPractice('full')}
          variant="outline"
          className="flex items-center justify-center p-6 h-auto"
        >
          <div className="text-center">
            <PlusCircle className="h-8 w-8 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Full AP Test</h3>
            <p className="text-sm text-gray-500">Take a full practice exam</p>
          </div>
        </Button>
      </div>
      
      <Separator className="my-8" />
      
      <h2 className="text-2xl font-semibold mb-6">Test History</h2>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="mcq">Multiple Choice</TabsTrigger>
          <TabsTrigger value="frq">Free Response</TabsTrigger>
          <TabsTrigger value="dbq">Document-Based</TabsTrigger>
          <TabsTrigger value="full">Full AP Tests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p>Loading your test history...</p>
            ) : filterTestsByType('all').length === 0 ? (
              <p>You haven't taken any tests yet. Start practicing!</p>
            ) : (
              filterTestsByType('all').map(test => (
                <TestHistoryCard
                  key={test.id}
                  test={test}
                  onReview={handleReviewTest}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mcq" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <p>Loading your test history...</p>
            ) : filterTestsByType('mcq').length === 0 ? (
              <p>You haven't taken any multiple choice tests yet.</p>
            ) : (
              filterTestsByType('mcq').map(test => (
                <TestHistoryCard
                  key={test.id}
                  test={test}
                  onReview={handleReviewTest}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        {/* Similar TabsContent for frq, dbq, and full test types */}
        
      </Tabs>
      
      {/* Test review dialog */}
      <TestReviewDialog
        open={testReviewOpen}
        onOpenChange={setTestReviewOpen}
        testResults={selectedTestDetails}
        onClose={() => setTestReviewOpen(false)}
      />
      
      {/* Practice test dialog */}
      <PracticeTestDialog
        open={practiceDialogOpen}
        onOpenChange={setPracticeDialogOpen}
        initialTestType={initialTestType}
      />
    </div>
  );
}