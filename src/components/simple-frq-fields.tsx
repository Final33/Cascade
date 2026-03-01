'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { FileText, Scroll, BookOpen, Users, Clock, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BaseFRQType } from '@/lib/frq-base-types'

interface SimpleFRQFieldsProps {
  frqType: BaseFRQType | null
  formData: any
  onFormDataChange: (data: any) => void
  className?: string
}

const FRQ_TYPE_ICONS = {
  'frq': FileText,
  'dbq': Scroll,
  'leq': BookOpen,
  'saq': Users
}

export function SimpleFRQFields({
  frqType,
  formData,
  onFormDataChange,
  className
}: SimpleFRQFieldsProps) {
  const updateFormData = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    })
  }

  const updateFRQSpecificData = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      frq_specific_data: {
        ...formData.frq_specific_data,
        [field]: value
      }
    })
  }

  if (!frqType) {
    return (
      <Card className={cn("border-dashed border-2 border-gray-300", className)}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Select an FRQ type to see specific fields</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const Icon = FRQ_TYPE_ICONS[frqType.id as keyof typeof FRQ_TYPE_ICONS] || FileText

  const renderDBQFields = () => {
    if (frqType.id !== 'dbq') return null

    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-900 mb-3 flex items-center gap-2">
            <Scroll className="w-4 h-4" />
            Document-Based Question Configuration
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="historical_context">Historical Context *</Label>
              <Textarea
                id="historical_context"
                value={formData.frq_specific_data?.historical_context || ''}
                onChange={(e) => updateFRQSpecificData('historical_context', e.target.value)}
                placeholder="Provide the historical context and time period for this DBQ..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="document_count">Number of Documents</Label>
              <Select 
                value={formData.frq_specific_data?.document_count?.toString() || '7'} 
                onValueChange={(value) => updateFRQSpecificData('document_count', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Documents</SelectItem>
                  <SelectItem value="7">7 Documents (Standard)</SelectItem>
                  <SelectItem value="8">8 Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="additional_document"
                checked={formData.frq_specific_data?.additional_document_suggestion || false}
                onCheckedChange={(checked) => updateFRQSpecificData('additional_document_suggestion', checked)}
              />
              <Label htmlFor="additional_document" className="text-sm">
                Include "additional document" suggestion requirement
              </Label>
            </div>

            <div>
              <Label htmlFor="document_types">Document Types Expected</Label>
              <Textarea
                id="document_types"
                value={formData.frq_specific_data?.document_types || ''}
                onChange={(e) => updateFRQSpecificData('document_types', e.target.value)}
                placeholder="e.g., Primary sources, government documents, letters, speeches, images..."
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLEQFields = () => {
    if (frqType.id !== 'leq') return null

    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Long Essay Question Configuration
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="historical_thinking_skill">Historical Thinking Skill *</Label>
              <Select 
                value={formData.frq_specific_data?.historical_thinking_skill || ''} 
                onValueChange={(value) => updateFRQSpecificData('historical_thinking_skill', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select thinking skill..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="causation">Causation</SelectItem>
                  <SelectItem value="change_continuity">Change and Continuity Over Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time_period">Time Period *</Label>
              <Input
                id="time_period"
                value={formData.frq_specific_data?.time_period || ''}
                onChange={(e) => updateFRQSpecificData('time_period', e.target.value)}
                placeholder="e.g., 1450-1750, 1865-1898"
                required
              />
            </div>

            <div>
              <Label htmlFor="geographic_focus">Geographic Focus</Label>
              <Select 
                value={formData.frq_specific_data?.geographic_focus || ''} 
                onValueChange={(value) => updateFRQSpecificData('geographic_focus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select geographic focus..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="africa">Africa</SelectItem>
                  <SelectItem value="americas">Americas</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="middle_east">Middle East</SelectItem>
                  <SelectItem value="comparative">Comparative Regions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="thematic_focus">Thematic Focus</Label>
              <Input
                id="thematic_focus"
                value={formData.frq_specific_data?.thematic_focus || ''}
                onChange={(e) => updateFRQSpecificData('thematic_focus', e.target.value)}
                placeholder="e.g., Political, Economic, Social, Cultural, Environmental"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSAQFields = () => {
    if (frqType.id !== 'saq') return null

    return (
      <div className="space-y-4">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Short Answer Question Configuration
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="number_of_parts">Number of Parts</Label>
              <Select 
                value={formData.frq_specific_data?.number_of_parts?.toString() || '3'} 
                onValueChange={(value) => updateFRQSpecificData('number_of_parts', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Parts (a, b)</SelectItem>
                  <SelectItem value="3">3 Parts (a, b, c)</SelectItem>
                  <SelectItem value="4">4 Parts (a, b, c, d)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="has_stimulus"
                checked={formData.frq_specific_data?.has_stimulus || false}
                onCheckedChange={(checked) => updateFRQSpecificData('has_stimulus', checked)}
              />
              <Label htmlFor="has_stimulus" className="text-sm">
                Includes stimulus material (text, image, or chart)
              </Label>
            </div>

            {formData.frq_specific_data?.has_stimulus && (
              <div>
                <Label htmlFor="stimulus_type">Stimulus Type</Label>
                <Select 
                  value={formData.frq_specific_data?.stimulus_type || ''} 
                  onValueChange={(value) => updateFRQSpecificData('stimulus_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stimulus type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text Passage</SelectItem>
                    <SelectItem value="image">Historical Image</SelectItem>
                    <SelectItem value="chart">Chart or Graph</SelectItem>
                    <SelectItem value="map">Map</SelectItem>
                    <SelectItem value="political_cartoon">Political Cartoon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="task_verbs">Task Verbs Used</Label>
              <Input
                id="task_verbs"
                value={formData.frq_specific_data?.task_verbs || ''}
                onChange={(e) => updateFRQSpecificData('task_verbs', e.target.value)}
                placeholder="e.g., Identify, Explain, Analyze, Compare"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderStandardFRQFields = () => {
    if (frqType.id !== 'frq') return null

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Free Response Question Configuration
          </h4>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="question_context">Question Context</Label>
              <Textarea
                id="question_context"
                value={formData.frq_specific_data?.question_context || ''}
                onChange={(e) => updateFRQSpecificData('question_context', e.target.value)}
                placeholder="Provide context or background information for the question..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="requires_calculations"
                checked={formData.frq_specific_data?.requires_calculations || false}
                onCheckedChange={(checked) => updateFRQSpecificData('requires_calculations', checked)}
              />
              <Label htmlFor="requires_calculations" className="text-sm">
                Requires mathematical calculations or formulas
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="requires_graphs"
                checked={formData.frq_specific_data?.requires_graphs || false}
                onCheckedChange={(checked) => updateFRQSpecificData('requires_graphs', checked)}
              />
              <Label htmlFor="requires_graphs" className="text-sm">
                Requires creating or interpreting graphs/diagrams
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="requires_data_analysis"
                checked={formData.frq_specific_data?.requires_data_analysis || false}
                onCheckedChange={(checked) => updateFRQSpecificData('requires_data_analysis', checked)}
              />
              <Label htmlFor="requires_data_analysis" className="text-sm">
                Requires analysis of provided data or experimental results
              </Label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {frqType.name} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Common FRQ Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="max_points">Maximum Points</Label>
            <Input
              id="max_points"
              type="number"
              value={formData.max_points || frqType.defaultMaxPoints}
              onChange={(e) => updateFormData('max_points', parseInt(e.target.value))}
              min="1"
              max="20"
            />
          </div>
          
          <div>
            <Label htmlFor="time_limit_override">Time Limit (minutes)</Label>
            <Input
              id="time_limit_override"
              type="number"
              value={formData.time_limit || frqType.defaultTimeLimit}
              onChange={(e) => updateFormData('time_limit', parseInt(e.target.value))}
              min="5"
              max="120"
            />
          </div>
        </div>

        {/* Type-Specific Fields */}
        {renderDBQFields()}
        {renderLEQFields()}
        {renderSAQFields()}
        {renderStandardFRQFields()}

        {/* Additional Instructions */}
        <div>
          <Label htmlFor="additional_instructions">Additional Instructions</Label>
          <Textarea
            id="additional_instructions"
            value={formData.frq_specific_data?.additional_instructions || ''}
            onChange={(e) => updateFRQSpecificData('additional_instructions', e.target.value)}
            placeholder="Any additional instructions or notes for this FRQ..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
