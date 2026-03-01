"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { Loader2 } from "lucide-react";

// AP Classes and Units data
const apClasses = [
  { value: 'AP Calculus AB', label: 'AP Calculus AB' },
  { value: 'AP Computer Science A', label: 'AP Computer Science A' },
  { value: 'AP Statistics', label: 'AP Statistics' },
  { value: 'AP World History', label: 'AP World History' },
];

const unitsByClass: Record<string, string[]> = {
  'AP Statistics': [
    'Unit 1: Exploring One-Variable Data',
    'Unit 2: Exploring Two-Variable Data',
    'Unit 3: Collecting Data',
    'Unit 4: Probability, Random Variables, and Probability Distributions',
    'Unit 5: Sampling Distributions',
    'Unit 6: Inference for Categorical Data: Proportions',
    'Unit 7: Inference for Quantitative Data: Means',
    'Unit 8: Inference for Categorical Data: Chi-Square',
    'Unit 9: Inference for Quantitative Data: Slopes',
  ],
  'AP Calculus AB': [
    'Unit 1: Limits and Continuity',
    'Unit 2: Differentiation: Definition and Fundamental Properties',
    'Unit 3: Differentiation: Composite, Implicit, and Inverse Functions',
    'Unit 4: Contextual Applications of Differentiation',
    'Unit 5: Analytical Applications of Differentiation',
    'Unit 6: Integration and Accumulation of Change',
    'Unit 7: Differential Equations',
    'Unit 8: Applications of Integration',
  ],
  'AP Computer Science A': [
    'Unit 1: Primitive Types',
    'Unit 2: Using Objects',
    'Unit 3: Boolean Expressions and if Statements',
    'Unit 4: Iteration',
    'Unit 5: Writing Classes',
    'Unit 6: Array',
    'Unit 7: ArrayList',
    'Unit 8: 2D Array',
    'Unit 9: Inheritance',
    'Unit 10: Recursion',
  ],
  'AP World History': [
    'Unit 1: The Global Tapestry',
    'Unit 2: Networks of Exchange',
    'Unit 3: Land-Based Empires',
    'Unit 4: Transoceanic Interconnections',
    'Unit 5: Revolutions',
    'Unit 6: Consequences of Industrialization',
    'Unit 7: Global Conflict',
    'Unit 8: Cold War and Decolonization',
    'Unit 9: Globalization',
  ],
};

const correctOptions = ['A', 'B', 'C', 'D'];

export interface EditQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: any;
  onQuestionUpdated: () => void;
}

export function EditQuestionDialog({ 
  open, 
  onOpenChange, 
  question,
  onQuestionUpdated 
}: EditQuestionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    unit: '',
    question_text: '',
    correct_option: '',
    explanation: ''
  });

  // Initialize form data when question changes
  useEffect(() => {
    if (question) {
      setFormData({
        class: question.class || '',
        unit: question.unit || '',
        question_text: question.question_text || '',
        correct_option: question.correct_option || '',
        explanation: question.explanation || ''
      });
    }
  }, [question]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      
      const { error } = await supabase
        .from('questions')
        .update({
          class: formData.class,
          unit: formData.unit,
          question_text: formData.question_text,
          correct_option: formData.correct_option,
          explanation: formData.explanation,
        })
        .eq('id', question.id);

      if (error) {
        throw error;
      }

      // Reset form and close dialog
      setFormData({
        class: '',
        unit: '',
        question_text: '',
        correct_option: '',
        explanation: ''
      });
      onOpenChange(false);
      onQuestionUpdated();
    } catch (error) {
      console.error('Error updating question:', error);
      alert('Failed to update question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.class && formData.unit && formData.question_text && formData.correct_option && formData.explanation;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class">AP Class</Label>
              <Select
                value={formData.class}
                onValueChange={(value) => setFormData({ ...formData, class: value, unit: '' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AP Class" />
                </SelectTrigger>
                <SelectContent>
                  {apClasses.map((cls) => (
                    <SelectItem key={cls.value} value={cls.value}>
                      {cls.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
                disabled={!formData.class}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  {(unitsByClass[formData.class] || []).map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="question_text">Question Text</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              placeholder="Enter the question text..."
              rows={6}
              className="resize-none"
            />
          </div>

          <div>
            <Label htmlFor="correct_option">Correct Answer</Label>
            <Select
              value={formData.correct_option}
              onValueChange={(value) => setFormData({ ...formData, correct_option: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct option" />
              </SelectTrigger>
              <SelectContent>
                {correctOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    Option {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="explanation">Explanation</Label>
            <Textarea
              id="explanation"
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              placeholder="Enter the explanation for the correct answer..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isFormValid || loading}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Question'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 