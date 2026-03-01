'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Clock, Award, FileText, Info, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFRQTypesForClass, getClassConfig, type FRQTypeConfig, type APClassConfig } from '@/lib/frq-types-config'

interface FRQTypeSelectorProps {
  selectedClass: string
  selectedFRQType: string | null
  onFRQTypeSelect: (frqType: FRQTypeConfig) => void
  onTemplateSelect?: (templateData: any) => void
  className?: string
}

export function FRQTypeSelector({
  selectedClass,
  selectedFRQType,
  onFRQTypeSelect,
  onTemplateSelect,
  className
}: FRQTypeSelectorProps) {
  const [classConfig, setClassConfig] = useState<APClassConfig | null>(null)
  const [frqTypes, setFRQTypes] = useState<FRQTypeConfig[]>([])
  const [selectedType, setSelectedType] = useState<FRQTypeConfig | null>(null)
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  // Update configuration when class changes
  useEffect(() => {
    if (selectedClass) {
      const config = getClassConfig(selectedClass)
      const types = getFRQTypesForClass(selectedClass)
      
      setClassConfig(config)
      setFRQTypes(types)
      setSelectedType(null)
      setSelectedTemplate('')
      
      // Load templates for this class
      loadTemplatesForClass(selectedClass)
    }
  }, [selectedClass])

  // Update selected type when selectedFRQType prop changes
  useEffect(() => {
    if (selectedFRQType && frqTypes.length > 0) {
      const type = frqTypes.find(t => t.id === selectedFRQType)
      if (type) {
        setSelectedType(type)
      }
    }
  }, [selectedFRQType, frqTypes])

  const loadTemplatesForClass = async (className: string) => {
    try {
      // This would typically fetch from your API
      // For now, we'll use mock data based on the class
      const mockTemplates = [
        {
          id: 'standard',
          name: 'Standard Template',
          description: 'Default template for this FRQ type',
          data: {}
        }
      ]
      setAvailableTemplates(mockTemplates)
    } catch (error) {
      console.error('Error loading templates:', error)
      setAvailableTemplates([])
    }
  }

  const handleTypeSelect = (typeId: string) => {
    const type = frqTypes.find(t => t.id === typeId)
    if (type) {
      setSelectedType(type)
      onFRQTypeSelect(type)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = availableTemplates.find(t => t.id === templateId)
    if (template && onTemplateSelect) {
      onTemplateSelect(template.data)
    }
  }

  if (!selectedClass) {
    return (
      <Card className={cn("border-dashed border-2 border-gray-300", className)}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Select an AP class to see available FRQ types</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!classConfig || frqTypes.length === 0) {
    return (
      <Card className={cn("border-dashed border-2 border-gray-300", className)}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No FRQ types available for {selectedClass}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Class Overview */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {classConfig.className} - FRQ Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span><strong>{classConfig.examStructure.totalFRQs}</strong> FRQs total</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span><strong>{classConfig.examStructure.totalTime}</strong> minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span><strong>{frqTypes.length}</strong> FRQ types</span>
            </div>
          </div>
          
          {classConfig.examStructure.sections && (
            <div className="mt-3">
              <Label className="text-sm font-medium text-blue-800">Exam Sections:</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {classConfig.examStructure.sections.map((section, index) => (
                  <Badge key={index} variant="outline" className="bg-white border-blue-300 text-blue-700">
                    {section.name}: {section.questions}Q ({section.time}min)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FRQ Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select FRQ Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="frq-type-select">FRQ Type *</Label>
            <Select value={selectedType?.id || ''} onValueChange={handleTypeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an FRQ type..." />
              </SelectTrigger>
              <SelectContent>
                {frqTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{type.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          {type.timeLimit}min
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {type.maxPoints}pts
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Selection */}
          {selectedType && availableTemplates.length > 0 && (
            <div>
              <Label htmlFor="template-select">Template (Optional)</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        {template.description && (
                          <div className="text-xs text-gray-600">{template.description}</div>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Type Details */}
      {selectedType && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-900 flex items-center justify-between">
              <span>{selectedType.name}</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedType.timeLimit} min
                </Badge>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Award className="w-3 h-3 mr-1" />
                  {selectedType.maxPoints} pts
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-green-800">{selectedType.description}</p>
            
            {/* Type Characteristics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant={selectedType.hasMultipleParts ? "default" : "secondary"} className="justify-center">
                {selectedType.hasMultipleParts ? "Multi-Part" : "Single Part"}
              </Badge>
              <Badge variant={selectedType.allowsImages ? "default" : "secondary"} className="justify-center">
                {selectedType.allowsImages ? "Images ✓" : "No Images"}
              </Badge>
              <Badge variant={selectedType.allowsDocuments ? "default" : "secondary"} className="justify-center">
                {selectedType.allowsDocuments ? "Documents ✓" : "No Docs"}
              </Badge>
              <Badge variant={selectedType.rubricType === 'analytic' ? "default" : "secondary"} className="justify-center">
                {selectedType.rubricType} Rubric
              </Badge>
            </div>

            {/* Guidelines */}
            {selectedType.guidelines && selectedType.guidelines.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-green-800">Guidelines:</Label>
                <ul className="mt-1 space-y-1">
                  {selectedType.guidelines.map((guideline, index) => (
                    <li key={index} className="text-sm text-green-700 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            {selectedType.examples && selectedType.examples.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-green-800">Example Prompts:</Label>
                <ul className="mt-1 space-y-1">
                  {selectedType.examples.map((example, index) => (
                    <li key={index} className="text-sm text-green-700 italic">
                      "{example}"
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Fields Info */}
            <div>
              <Label className="text-sm font-medium text-green-800">Required Information:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedType.requiredFields.map((field, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white border-green-300 text-green-700">
                    {field.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
