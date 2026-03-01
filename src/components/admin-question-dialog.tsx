"use client";

import * as React from "react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { Loader2, Plus } from "lucide-react";

interface AdminQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionAdded?: () => void;
}

const apClasses = [
  'AP Calculus AB',
  'AP Precalculus',
  'AP Computer Science A', 
  'AP Statistics',
  'AP World History',
  'AP US History',
  'AP US Government',
  'AP Human Geography',
  'AP Psychology',
  'AP Microeconomics',
  'AP Chemistry',
  'AP Biology',
  'AP Environmental Science',
  'AP Physics 1',
  'AP Physics C: Mechanics'
];

const unitsByClass: Record<string, string[]> = {
  'AP Calculus AB': [
    'Unit 1: Limits and Continuity',
    'Unit 2: Differentiation: Definition and Fundamental Properties',
    'Unit 3: Differentiation: Composite, Implicit, and Inverse Functions',
    'Unit 4: Contextual Applications of Differentiation',
    'Unit 5: Analytical Applications of Differentiation',
    'Unit 6: Integration and Accumulation of Change',
    'Unit 7: Differential Equations',
    'Unit 8: Applications of Integration'
  ],
  'AP Precalculus': [
    'Unit 1: Polynomial and Rational Functions',
    'Unit 2: Exponential and Logarithmic Functions',
    'Unit 3: Trigonometric and Polar Functions'
  ],
  'AP Statistics': [
    'Unit 1: Exploring One-Variable Data',
    'Unit 2: Exploring Two-Variable Data',
    'Unit 3: Collecting Data',
    'Unit 4: Probability, Random Variables, and Probability Distributions',
    'Unit 5: Sampling Distributions'
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
    'Unit 10: Recursion'
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
    'Unit 9: Globalization'
  ],
  'AP Chemistry': [
    'Unit 1: Atomic Structure and Properties',
    'Unit 2: Molecular and Ionic Compound Structure and Properties',
    'Unit 3: Intermolecular Forces and Properties',
    'Unit 4: Chemical Reactions',
    'Unit 5: Kinetics',
    'Unit 6: Thermodynamics',
    'Unit 7: Equilibrium',
    'Unit 8: Acids and Bases',
    'Unit 9: Applications of Thermodynamics'
  ],
  'AP Biology': [
    'Unit 1: Chemistry of Life',
    'Unit 2: Cell Structure and Function',
    'Unit 3: Cellular Energetics',
    'Unit 4: Cell Communication and Cell Cycle',
    'Unit 5: Heredity',
    'Unit 6: Gene Expression and Regulation',
    'Unit 7: Natural Selection',
    'Unit 8: Ecology'
  ],
  'AP Physics 1': [
    'Unit 1: Kinematics',
    'Unit 2: Forces and Newton\'s Laws of Motion',
    'Unit 3: Work, Energy, and Power',
    'Unit 4: Systems of Particles and Linear Momentum',
    'Unit 5: Rotation',
    'Unit 6: Oscillations',
    'Unit 7: Gravitation'
  ],
  'AP Physics C: Mechanics': [
    'Unit 1: Kinematics',
    'Unit 2: Newton\'s Laws of Motion',
    'Unit 3: Work, Energy and Power',
    'Unit 4: Systems of Particles and Linear Momentum',
    'Unit 5: Rotation',
    'Unit 6: Oscillations',
    'Unit 7: Gravitation'
  ],
  'AP US History': [
    'Unit 1: Period 1: 1491-1607',
    'Unit 2: Period 2: 1607-1754',
    'Unit 3: Period 3: 1754-1800',
    'Unit 4: Period 4: 1800-1848',
    'Unit 5: Period 5: 1844-1877',
    'Unit 6: Period 6: 1865-1898',
    'Unit 7: Period 7: 1890-1945',
    'Unit 8: Period 8: 1945-1980',
    'Unit 9: Period 9: 1980-Present'
  ],
  'AP Human Geography': [
    'Unit 1: Thinking Geographically',
    'Unit 2: Population and Migration Patterns and Processes',
    'Unit 3: Cultural Patterns and Processes',
    'Unit 4: Political Patterns and Processes',
    'Unit 5: Agriculture and Rural Land-Use Patterns and Processes',
    'Unit 6: Cities and Urban Land-Use Patterns and Processes',
    'Unit 7: Industrial and Economic Development Patterns and Processes'
  ],
  'AP Environmental Science': [
    'Unit 1: The Living World: Ecosystems',
    'Unit 2: The Living World: Biodiversity',
    'Unit 3: Populations',
    'Unit 4: Earth Systems and Resources',
    'Unit 5: Land and Water Use',
    'Unit 6: Energy Resources and Consumption',
    'Unit 7: Atmospheric Pollution',
    'Unit 8: Aquatic and Terrestrial Pollution',
    'Unit 9: Global Change'
  ],
  'AP Microeconomics': [
    'Unit 1: Basic Economic Concepts',
    'Unit 2: Supply and Demand',
    'Unit 3: Production, Cost, and the Perfect Competition Model',
    'Unit 4: Imperfect Competition',
    'Unit 5: Factor Markets',
    'Unit 6: Market Failure and the Role of Government'
  ],
  'AP US Government': [
    'Unit 1: Foundations of American Democracy',
    'Unit 2: Interactions Among Branches of Government',
    'Unit 3: Civil Liberties and Civil Rights',
    'Unit 4: American Political Ideologies and Beliefs',
    'Unit 5: Political Participation'
  ],
  'AP Psychology': [
    'Unit 1: Biological Bases of Behavior',
    'Unit 2: Cognition',
    'Unit 3: Development and Learning',
    'Unit 4: Social Psychology and Personality',
    'Unit 5: Mental and Physical Health'
  ]
};

const correctOptions = ['A', 'B', 'C', 'D'];

export function AdminQuestionDialog({ open, onOpenChange, onQuestionAdded }: AdminQuestionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    class: '',
    unit: '',
    question_text: '',
    correct_option: '',
    explanation: ''
  });

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate label (e.g., Q1, Q2, etc.)
      const { count } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('class', formData.class);

      const label = (count || 0) + 1;

      // Standard MCQ options
      const options = [
        { id: 'A', text: 'Option 1' },
        { id: 'B', text: 'Option 2' },
        { id: 'C', text: 'Option 3' },
        { id: 'D', text: 'Option 4' }
      ];

      // Insert question
      const { error } = await supabase
        .from('questions')
        .insert({
          class: formData.class,
          unit: formData.unit,
          topic: formData.unit, // Using unit as topic for simplicity
          label: label,
          difficulty: 'Medium', // Default difficulty
          question_text: formData.question_text,
          type: 'MCQ',
          options: options,
          correct_option: formData.correct_option,
          explanation: formData.explanation
        });

      if (error) throw error;

      // Reset form
      setFormData({
        class: '',
        unit: '',
        question_text: '',
        correct_option: '',
        explanation: ''
      });

      onQuestionAdded?.();
      onOpenChange(false);
      
      // Show success message
      alert('Question added successfully!');
    } catch (error: any) {
      console.error('Error adding question:', error);
      alert('Failed to add question: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const availableUnits = formData.class ? unitsByClass[formData.class] || [] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Question
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Class Selection */}
          <div className="space-y-2">
            <Label htmlFor="class">Class *</Label>
            <Select 
              value={formData.class} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, class: value, unit: '' }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AP Class" />
              </SelectTrigger>
              <SelectContent>
                {apClasses.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit Selection */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unit *</Label>
            <Select 
              value={formData.unit} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
              disabled={!formData.class}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Unit" />
              </SelectTrigger>
              <SelectContent>
                {availableUnits.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <Textarea
              id="question_text"
              placeholder="Enter the question text..."
              value={formData.question_text}
              onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
              rows={4}
              required
            />
          </div>

          {/* Correct Option */}
          <div className="space-y-2">
            <Label htmlFor="correct_option">Correct Option *</Label>
            <Select 
              value={formData.correct_option} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, correct_option: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select correct option" />
              </SelectTrigger>
              <SelectContent>
                {correctOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation *</Label>
            <Textarea
              id="explanation"
              placeholder="Provide explanation for the correct answer..."
              value={formData.explanation}
              onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
              rows={3}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.class || !formData.unit || !formData.question_text || !formData.correct_option || !formData.explanation}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 