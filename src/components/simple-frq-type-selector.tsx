'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Clock, Award, FileText, BookOpen, Users, Scroll } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFRQTypesForClass, getBaseFRQType, type BaseFRQType } from '@/lib/frq-base-types'

interface SimpleFRQTypeSelectorProps {
  selectedClass: string
  selectedFRQType: string | null
  onFRQTypeSelect: (frqType: BaseFRQType) => void
  className?: string
}

const FRQ_TYPE_ICONS = {
  'frq': FileText,
  'dbq': Scroll,
  'leq': BookOpen,
  'saq': Users
}

const FRQ_TYPE_COLORS = {
  'frq': 'bg-blue-50 border-blue-200 text-blue-900',
  'dbq': 'bg-amber-50 border-amber-200 text-amber-900',
  'leq': 'bg-green-50 border-green-200 text-green-900',
  'saq': 'bg-purple-50 border-purple-200 text-purple-900'
}

export function SimpleFRQTypeSelector({
  selectedClass,
  selectedFRQType,
  onFRQTypeSelect,
  className
}: SimpleFRQTypeSelectorProps) {
  const availableFRQTypes = getFRQTypesForClass(selectedClass)
  const selectedType = selectedFRQType ? getBaseFRQType(selectedFRQType) : null

  const handleTypeSelect = (typeId: string) => {
    const type = getBaseFRQType(typeId)
    if (type) {
      onFRQTypeSelect(type)
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

  if (availableFRQTypes.length === 0) {
    return (
      <Card className={cn("border-dashed border-2 border-gray-300", className)}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No FRQ types available for {selectedClass}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
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
                {availableFRQTypes.map((type) => {
                  const Icon = FRQ_TYPE_ICONS[type.id as keyof typeof FRQ_TYPE_ICONS] || FileText
                  return (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{type.name}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          <Badge variant="outline" className="text-xs">
                            {type.defaultTimeLimit}min
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {type.defaultMaxPoints}pts
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Selected Type Details */}
      {selectedType && (
        <Card className={cn("border-2", FRQ_TYPE_COLORS[selectedType.id as keyof typeof FRQ_TYPE_COLORS])}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                {React.createElement(FRQ_TYPE_ICONS[selectedType.id as keyof typeof FRQ_TYPE_ICONS] || FileText, {
                  className: "w-5 h-5"
                })}
                <span>{selectedType.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/50 text-current border-current/20">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedType.defaultTimeLimit} min
                </Badge>
                <Badge className="bg-white/50 text-current border-current/20">
                  <Award className="w-3 h-3 mr-1" />
                  {selectedType.defaultMaxPoints} pts
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-current/80">{selectedType.description}</p>
            
            {/* Type Characteristics */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedType.hasMultipleParts ? "default" : "secondary"} className="bg-white/20 text-current border-current/30">
                {selectedType.hasMultipleParts ? "Multi-Part" : "Single Part"}
              </Badge>
              <Badge variant={selectedType.allowsDocuments ? "default" : "secondary"} className="bg-white/20 text-current border-current/30">
                {selectedType.allowsDocuments ? "Documents ✓" : "No Documents"}
              </Badge>
              <Badge variant={selectedType.allowsImages ? "default" : "secondary"} className="bg-white/20 text-current border-current/30">
                {selectedType.allowsImages ? "Images ✓" : "No Images"}
              </Badge>
            </div>

            {/* Guidelines */}
            {selectedType.guidelines && selectedType.guidelines.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-current/90">Guidelines:</Label>
                <ul className="mt-1 space-y-1">
                  {selectedType.guidelines.map((guideline, index) => (
                    <li key={index} className="text-sm text-current/80 flex items-start gap-2">
                      <span className="text-current/60 mt-1">•</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Examples */}
            {selectedType.examples && selectedType.examples.length > 0 && (
              <div>
                <Label className="text-sm font-medium text-current/90">Example Prompts:</Label>
                <ul className="mt-1 space-y-1">
                  {selectedType.examples.slice(0, 2).map((example, index) => (
                    <li key={index} className="text-sm text-current/80 italic">
                      "{example}"
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Fields Info */}
            <div>
              <Label className="text-sm font-medium text-current/90">Required Information:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedType.requiredFields.map((field, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-white/10 text-current/70 border-current/30">
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
