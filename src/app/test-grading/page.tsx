"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { FRQGradingResults } from "@/components/frq-grading-results"

export default function TestGradingPage() {
  const [isGrading, setIsGrading] = useState(false)
  const [gradingResult, setGradingResult] = useState<any>(null)
  const [showResults, setShowResults] = useState(false)

  const testGrading = async () => {
    setIsGrading(true)
    
    try {
      const testQuestion = {
        id: 'calc-ab-frq-1',
        subject: 'AP Calculus AB',
        unit: 'Applications of Derivatives',
        topic: 'Optimization',
        question: 'A farmer has 200 feet of fencing and wants to enclose a rectangular area and then divide it into two equal parts with a fence parallel to one of the sides.',
        parts: [
          {
            id: 'part-a',
            label: '(a)',
            question: 'Express the area of the enclosed region as a function of the width x of the rectangle.',
            points: 3,
            expectedLength: 'medium'
          },
          {
            id: 'part-b',
            label: '(b)',
            question: 'Find the dimensions that maximize the area.',
            points: 4,
            expectedLength: 'medium'
          },
          {
            id: 'part-c',
            label: '(c)',
            question: 'What is the maximum area that can be enclosed?',
            points: 2,
            expectedLength: 'short'
          }
        ],
        totalPoints: 9,
        timeLimit: 25,
        difficulty: 'Medium',
        year: 2023,
        examType: 'Practice',
        rubric: 'Part (a): 3 points for correct function setup. Part (b): 4 points for optimization process. Part (c): 2 points for final calculation.'
      }

      const testResponses = [
        {
          partId: 'part-a',
          response: 'Let x be the width and y be the length. The constraint is 2x + 3y = 200, so y = (200-2x)/3. Area = xy = x(200-2x)/3.',
          timeSpent: 180,
          wordCount: 25
        },
        {
          partId: 'part-b',
          response: 'A(x) = x(200-2x)/3. Taking derivative: A\'(x) = (200-4x)/3. Setting to zero: 200-4x = 0, so x = 50. When x = 50, y = 100/3.',
          timeSpent: 240,
          wordCount: 30
        },
        {
          partId: 'part-c',
          response: 'Maximum area = 50 * (100/3) = 5000/3 ≈ 1666.67 square feet.',
          timeSpent: 60,
          wordCount: 12
        }
      ]

      console.log('🧪 Starting test grading...')

      const response = await fetch('/api/grade-frq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: testQuestion,
          responses: testResponses,
          rubric: testQuestion.rubric
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to grade FRQ')
      }

      const gradingData = await response.json()
      console.log('🎯 Test grading completed:', gradingData)
      setGradingResult(gradingData)
      setShowResults(true)
      
    } catch (error) {
      console.error('Error testing grading:', error)
      alert(`Grading test failed: ${error.message}`)
    } finally {
      setIsGrading(false)
    }
  }

  const showSampleResult = () => {
    const sampleResult = {
      totalScore: 8.5,
      maxScore: 9,
      percentage: 94.4,
      overallGrade: 'A-',
      gradingTime: '2:30',
      parts: [
        {
          partLabel: '(a)',
          pointsEarned: 3,
          maxPoints: 3,
          feedback: 'Excellent setup of the constraint equation and area function. You correctly identified the variables and derived the relationship.',
          strengths: ['Correct constraint equation', 'Proper variable identification', 'Clear area function derivation'],
          improvements: [],
          suggestions: ['Continue with this systematic approach']
        },
        {
          partLabel: '(b)',
          pointsEarned: 3.5,
          maxPoints: 4,
          feedback: 'Good derivative calculation and critical point finding. Missing verification that this is indeed a maximum.',
          strengths: ['Correct derivative', 'Found critical point', 'Solved for dimensions'],
          improvements: ['Add second derivative test', 'Verify maximum condition'],
          suggestions: ['Use second derivative test to confirm maximum', 'State conclusion clearly']
        },
        {
          partLabel: '(c)',
          pointsEarned: 2,
          maxPoints: 2,
          feedback: 'Perfect calculation of the maximum area with proper units.',
          strengths: ['Correct substitution', 'Accurate calculation', 'Included units'],
          improvements: [],
          suggestions: []
        }
      ],
      overallFeedback: 'This is a strong response demonstrating good understanding of optimization problems. The work is well-organized and calculations are accurate.',
      studyRecommendations: ['Practice second derivative test', 'Review optimization verification methods'],
      nextSteps: ['Work on more complex optimization problems', 'Focus on complete solution verification'],
      gradedAt: new Date().toISOString(),
      model: 'gemini-1.5-flash',
      questionId: 'calc-ab-frq-1'
    }
    
    setGradingResult(sampleResult)
    setShowResults(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Grading System Test</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Grading Functionality</h2>
            <p className="text-gray-600 mb-4">
              This page tests the AI grading system in isolation to identify any display issues.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={testGrading}
              disabled={isGrading}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full"
            >
              {isGrading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Testing Real AI Grading...
                </>
              ) : (
                'Test Real AI Grading'
              )}
            </Button>

            <Button 
              onClick={showSampleResult}
              variant="outline"
              className="w-full"
            >
              Show Sample Grading Result
            </Button>
          </div>

          {gradingResult && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Grading Completed:</h3>
              <p className="text-green-700">
                Score: {gradingResult.totalScore}/{gradingResult.maxScore} ({gradingResult.percentage}%)
              </p>
              <p className="text-green-700">
                Grade: {gradingResult.overallGrade}
              </p>
              <p className="text-green-700">
                Parts: {gradingResult.parts?.length || 0} graded
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Grading Results Modal */}
      {showResults && gradingResult && (
        <FRQGradingResults
          gradingResult={gradingResult}
          onClose={() => setShowResults(false)}
          onRetry={() => {
            setShowResults(false)
            setGradingResult(null)
            testGrading()
          }}
        />
      )}
    </div>
  )
}
