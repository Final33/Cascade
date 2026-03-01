'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, FileText, Clock, Calculator, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FRQTypeConfig } from '@/lib/frq-types-config'

interface ClassSpecificFRQFieldsProps {
  selectedClass: string
  frqType: FRQTypeConfig | null
  formData: any
  onFormDataChange: (data: any) => void
  className?: string
}

export function ClassSpecificFRQFields({
  selectedClass,
  frqType,
  formData,
  onFormDataChange,
  className
}: ClassSpecificFRQFieldsProps) {
  const updateFormData = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    })
  }

  const updateClassSpecificData = (field: string, value: any) => {
    onFormDataChange({
      ...formData,
      class_specific_data: {
        ...formData.class_specific_data,
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

  // Render fields based on AP class and FRQ type
  const renderHistoryFields = () => {
    if (!['AP World History', 'AP US History', 'AP European History'].includes(selectedClass)) return null

    return (
      <div className="space-y-4">
        {/* Time Period */}
        <div>
          <Label htmlFor="time_period">Time Period *</Label>
          <Input
            id="time_period"
            value={formData.class_specific_data?.time_period || ''}
            onChange={(e) => updateClassSpecificData('time_period', e.target.value)}
            placeholder="e.g., 1450-1750, 1865-1898, 1914-1945"
            required
          />
        </div>

        {/* Geographic Region */}
        <div>
          <Label htmlFor="geographic_region">Geographic Region</Label>
          <Select 
            value={formData.class_specific_data?.geographic_region || ''} 
            onValueChange={(value) => updateClassSpecificData('geographic_region', value)}
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
              <SelectItem value="oceania">Oceania</SelectItem>
              <SelectItem value="comparative">Comparative Regions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Historical Thinking Skill */}
        <div>
          <Label htmlFor="historical_thinking_skill">Historical Thinking Skill *</Label>
          <Select 
            value={formData.class_specific_data?.historical_thinking_skill || ''} 
            onValueChange={(value) => updateClassSpecificData('historical_thinking_skill', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select thinking skill..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="analyze">Analyze Historical Evidence</SelectItem>
              <SelectItem value="compare">Comparison</SelectItem>
              <SelectItem value="causation">Causation</SelectItem>
              <SelectItem value="change_continuity">Change and Continuity</SelectItem>
              <SelectItem value="contextualization">Contextualization</SelectItem>
              <SelectItem value="synthesis">Synthesis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DBQ Specific Fields */}
        {frqType.id === 'dbq' && (
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-amber-900">DBQ Document Set</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="document_count">Number of Documents</Label>
                <Select 
                  value={formData.class_specific_data?.document_count?.toString() || '7'} 
                  onValueChange={(value) => updateClassSpecificData('document_count', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Documents</SelectItem>
                    <SelectItem value="7">7 Documents</SelectItem>
                    <SelectItem value="8">8 Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="additional_document"
                  checked={formData.class_specific_data?.additional_document_suggestion || false}
                  onCheckedChange={(checked) => updateClassSpecificData('additional_document_suggestion', checked)}
                />
                <Label htmlFor="additional_document" className="text-sm">
                  Include "additional document" suggestion requirement
                </Label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SAQ Specific Fields */}
        {frqType.id === 'saq' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-900">SAQ Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="saq_structure">Question Structure</Label>
                <Select 
                  value={formData.class_specific_data?.saq_structure || 'three_part'} 
                  onValueChange={(value) => updateClassSpecificData('saq_structure', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="three_part">Three Parts (a, b, c)</SelectItem>
                    <SelectItem value="two_part">Two Parts (a, b)</SelectItem>
                    <SelectItem value="four_part">Four Parts (a, b, c, d)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderMathFields = () => {
    if (!['AP Calculus AB', 'AP Calculus BC', 'AP Statistics', 'AP Precalculus'].includes(selectedClass)) return null

    return (
      <div className="space-y-4">
        {/* Calculator Policy */}
        <div>
          <Label htmlFor="calculator_policy">Calculator Policy *</Label>
          <Select 
            value={formData.class_specific_data?.calculator_policy || ''} 
            onValueChange={(value) => updateClassSpecificData('calculator_policy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select calculator policy..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="required">Calculator Required</SelectItem>
              <SelectItem value="allowed">Calculator Allowed</SelectItem>
              <SelectItem value="not_allowed">No Calculator</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mathematical Practices */}
        <div>
          <Label htmlFor="mathematical_practices">Mathematical Practices</Label>
          <Select 
            value={formData.class_specific_data?.mathematical_practices || ''} 
            onValueChange={(value) => updateClassSpecificData('mathematical_practices', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select primary practice..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reasoning">Mathematical Reasoning</SelectItem>
              <SelectItem value="modeling">Mathematical Modeling</SelectItem>
              <SelectItem value="communication">Mathematical Communication</SelectItem>
              <SelectItem value="representation">Multiple Representations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics Specific Fields */}
        {selectedClass === 'AP Statistics' && (
          <Card className="bg-purple-50 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-purple-900 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Statistics Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="statistical_investigation">Statistical Investigation Type</Label>
                <Select 
                  value={formData.class_specific_data?.statistical_investigation || ''} 
                  onValueChange={(value) => updateClassSpecificData('statistical_investigation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select investigation type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exploratory">Exploratory Data Analysis</SelectItem>
                    <SelectItem value="inference">Statistical Inference</SelectItem>
                    <SelectItem value="probability">Probability</SelectItem>
                    <SelectItem value="sampling">Sampling Distributions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data_type">Data Type</Label>
                <Select 
                  value={formData.class_specific_data?.data_type || ''} 
                  onValueChange={(value) => updateClassSpecificData('data_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quantitative">Quantitative</SelectItem>
                    <SelectItem value="categorical">Categorical</SelectItem>
                    <SelectItem value="bivariate">Bivariate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="technology_use"
                  checked={formData.class_specific_data?.technology_use || false}
                  onCheckedChange={(checked) => updateClassSpecificData('technology_use', checked)}
                />
                <Label htmlFor="technology_use" className="text-sm">
                  Technology/Calculator expected for solution
                </Label>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderComputerScienceFields = () => {
    if (selectedClass !== 'AP Computer Science A') return null

    return (
      <div className="space-y-4">
        {/* Programming Construct */}
        <div>
          <Label htmlFor="programming_construct">Programming Construct *</Label>
          <Select 
            value={formData.class_specific_data?.programming_construct || ''} 
            onValueChange={(value) => updateClassSpecificData('programming_construct', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select programming construct..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="method_writing">Method Writing</SelectItem>
              <SelectItem value="class_design">Class Design</SelectItem>
              <SelectItem value="array_manipulation">Array/ArrayList Manipulation</SelectItem>
              <SelectItem value="inheritance">Inheritance</SelectItem>
              <SelectItem value="interfaces">Interfaces</SelectItem>
              <SelectItem value="recursion">Recursion</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Object-Oriented Concept */}
        <div>
          <Label htmlFor="oo_concept">Object-Oriented Concept</Label>
          <Select 
            value={formData.class_specific_data?.oo_concept || ''} 
            onValueChange={(value) => updateClassSpecificData('oo_concept', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select OO concept..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="encapsulation">Encapsulation</SelectItem>
              <SelectItem value="inheritance">Inheritance</SelectItem>
              <SelectItem value="polymorphism">Polymorphism</SelectItem>
              <SelectItem value="abstraction">Abstraction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Java Features */}
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-green-900">Java Language Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="static_methods"
                  checked={formData.class_specific_data?.static_methods || false}
                  onCheckedChange={(checked) => updateClassSpecificData('static_methods', checked)}
                />
                <Label htmlFor="static_methods" className="text-sm">Static Methods</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="overloading"
                  checked={formData.class_specific_data?.overloading || false}
                  onCheckedChange={(checked) => updateClassSpecificData('overloading', checked)}
                />
                <Label htmlFor="overloading" className="text-sm">Method Overloading</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exception_handling"
                  checked={formData.class_specific_data?.exception_handling || false}
                  onCheckedChange={(checked) => updateClassSpecificData('exception_handling', checked)}
                />
                <Label htmlFor="exception_handling" className="text-sm">Exception Handling</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="generics"
                  checked={formData.class_specific_data?.generics || false}
                  onCheckedChange={(checked) => updateClassSpecificData('generics', checked)}
                />
                <Label htmlFor="generics" className="text-sm">Generics</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderEnglishFields = () => {
    if (!['AP English Language and Composition', 'AP English Literature and Composition'].includes(selectedClass)) return null

    return (
      <div className="space-y-4">
        {/* Rhetorical Situation */}
        <div>
          <Label htmlFor="rhetorical_situation">Rhetorical Situation</Label>
          <Textarea
            id="rhetorical_situation"
            value={formData.class_specific_data?.rhetorical_situation || ''}
            onChange={(e) => updateClassSpecificData('rhetorical_situation', e.target.value)}
            placeholder="Describe the rhetorical context (audience, purpose, occasion)..."
            rows={3}
          />
        </div>

        {/* Writing Task Type */}
        <div>
          <Label htmlFor="writing_task">Writing Task Focus</Label>
          <Select 
            value={formData.class_specific_data?.writing_task || ''} 
            onValueChange={(value) => updateClassSpecificData('writing_task', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select writing focus..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="argumentation">Argumentation</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="synthesis">Synthesis</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Synthesis Specific Fields */}
        {frqType.id === 'synthesis' && (
          <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-indigo-900">Synthesis Essay Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="source_count">Number of Sources</Label>
                <Select 
                  value={formData.class_specific_data?.source_count?.toString() || '6'} 
                  onValueChange={(value) => updateClassSpecificData('source_count', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Sources</SelectItem>
                    <SelectItem value="6">6 Sources</SelectItem>
                    <SelectItem value="7">7 Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="required_sources">Minimum Sources to Use</Label>
                <Select 
                  value={formData.class_specific_data?.required_sources?.toString() || '3'} 
                  onValueChange={(value) => updateClassSpecificData('required_sources', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">At least 3</SelectItem>
                    <SelectItem value="4">At least 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderPsychologyFields = () => {
    if (selectedClass !== 'AP Psychology') return null

    return (
      <div className="space-y-4">
        {/* Psychological Concept */}
        <div>
          <Label htmlFor="psychological_concept">Psychological Concept *</Label>
          <Select 
            value={formData.class_specific_data?.psychological_concept || ''} 
            onValueChange={(value) => updateClassSpecificData('psychological_concept', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select psychological concept..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="learning">Learning</SelectItem>
              <SelectItem value="memory">Memory</SelectItem>
              <SelectItem value="cognition">Cognition</SelectItem>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="personality">Personality</SelectItem>
              <SelectItem value="abnormal">Abnormal Psychology</SelectItem>
              <SelectItem value="social">Social Psychology</SelectItem>
              <SelectItem value="biological">Biological Bases</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Research Method */}
        <div>
          <Label htmlFor="research_method">Research Method</Label>
          <Select 
            value={formData.class_specific_data?.research_method || ''} 
            onValueChange={(value) => updateClassSpecificData('research_method', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select research method..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="experimental">Experimental</SelectItem>
              <SelectItem value="correlational">Correlational</SelectItem>
              <SelectItem value="observational">Observational</SelectItem>
              <SelectItem value="case_study">Case Study</SelectItem>
              <SelectItem value="survey">Survey</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Application Context */}
        <div>
          <Label htmlFor="application_context">Application Context</Label>
          <Textarea
            id="application_context"
            value={formData.class_specific_data?.application_context || ''}
            onChange={(e) => updateClassSpecificData('application_context', e.target.value)}
            placeholder="Describe the real-world scenario or context..."
            rows={3}
          />
        </div>
      </div>
    )
  }

  const renderEconomicsFields = () => {
    if (!['AP Microeconomics', 'AP Macroeconomics'].includes(selectedClass)) return null

    return (
      <div className="space-y-4">
        {/* Economic Concept */}
        <div>
          <Label htmlFor="economic_concept">Economic Concept *</Label>
          <Select 
            value={formData.class_specific_data?.economic_concept || ''} 
            onValueChange={(value) => updateClassSpecificData('economic_concept', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select economic concept..." />
            </SelectTrigger>
            <SelectContent>
              {selectedClass === 'AP Microeconomics' && (
                <>
                  <SelectItem value="supply_demand">Supply and Demand</SelectItem>
                  <SelectItem value="elasticity">Elasticity</SelectItem>
                  <SelectItem value="market_structures">Market Structures</SelectItem>
                  <SelectItem value="factor_markets">Factor Markets</SelectItem>
                  <SelectItem value="market_failure">Market Failure</SelectItem>
                </>
              )}
              {selectedClass === 'AP Macroeconomics' && (
                <>
                  <SelectItem value="gdp">GDP and Economic Growth</SelectItem>
                  <SelectItem value="inflation">Inflation and Unemployment</SelectItem>
                  <SelectItem value="fiscal_policy">Fiscal Policy</SelectItem>
                  <SelectItem value="monetary_policy">Monetary Policy</SelectItem>
                  <SelectItem value="international_trade">International Trade</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Graph Analysis Required */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="graph_analysis"
            checked={formData.class_specific_data?.graph_analysis || false}
            onCheckedChange={(checked) => updateClassSpecificData('graph_analysis', checked)}
          />
          <Label htmlFor="graph_analysis" className="text-sm">
            Requires graph drawing or analysis
          </Label>
        </div>

        {/* Policy Application */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="policy_application"
            checked={formData.class_specific_data?.policy_application || false}
            onCheckedChange={(checked) => updateClassSpecificData('policy_application', checked)}
          />
          <Label htmlFor="policy_application" className="text-sm">
            Involves policy analysis or application
          </Label>
        </div>
      </div>
    )
  }

  const renderArtHistoryFields = () => {
    if (selectedClass !== 'AP Art History') return null

    return (
      <div className="space-y-4">
        {/* Art Historical Period */}
        <div>
          <Label htmlFor="art_period">Art Historical Period</Label>
          <Select 
            value={formData.class_specific_data?.art_period || ''} 
            onValueChange={(value) => updateClassSpecificData('art_period', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select art period..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ancient">Ancient Art</SelectItem>
              <SelectItem value="medieval">Medieval Art</SelectItem>
              <SelectItem value="renaissance">Renaissance</SelectItem>
              <SelectItem value="baroque">Baroque</SelectItem>
              <SelectItem value="modern">Modern Art</SelectItem>
              <SelectItem value="contemporary">Contemporary Art</SelectItem>
              <SelectItem value="non_western">Non-Western Art</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cultural Context */}
        <div>
          <Label htmlFor="cultural_context">Cultural Context</Label>
          <Textarea
            id="cultural_context"
            value={formData.class_specific_data?.cultural_context || ''}
            onChange={(e) => updateClassSpecificData('cultural_context', e.target.value)}
            placeholder="Describe the cultural and historical context..."
            rows={3}
          />
        </div>

        {/* Visual Analysis Focus */}
        <div>
          <Label htmlFor="visual_analysis_focus">Visual Analysis Focus</Label>
          <Select 
            value={formData.class_specific_data?.visual_analysis_focus || ''} 
            onValueChange={(value) => updateClassSpecificData('visual_analysis_focus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select analysis focus..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal_elements">Formal Elements</SelectItem>
              <SelectItem value="iconography">Iconography</SelectItem>
              <SelectItem value="style">Style and Technique</SelectItem>
              <SelectItem value="function">Function and Purpose</SelectItem>
              <SelectItem value="patronage">Patronage and Context</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const renderScienceFields = () => {
    if (!['AP Biology', 'AP Chemistry', 'AP Physics 1', 'AP Physics 2', 'AP Physics C: Mechanics', 'AP Physics C: Electricity and Magnetism', 'AP Environmental Science'].includes(selectedClass)) return null

    return (
      <div className="space-y-4">
        {/* Science Practice */}
        <div>
          <Label htmlFor="science_practice">Science Practice *</Label>
          <Select 
            value={formData.class_specific_data?.science_practice || ''} 
            onValueChange={(value) => updateClassSpecificData('science_practice', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select science practice..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="experimental_design">Experimental Design</SelectItem>
              <SelectItem value="data_analysis">Data Analysis</SelectItem>
              <SelectItem value="mathematical_modeling">Mathematical Modeling</SelectItem>
              <SelectItem value="scientific_reasoning">Scientific Reasoning</SelectItem>
              <SelectItem value="argumentation">Scientific Argumentation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Big Ideas */}
        <div>
          <Label htmlFor="big_idea">Big Ideas/Themes</Label>
          <Select 
            value={formData.class_specific_data?.big_idea || ''} 
            onValueChange={(value) => updateClassSpecificData('big_idea', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select big idea..." />
            </SelectTrigger>
            <SelectContent>
              {selectedClass === 'AP Biology' && (
                <>
                  <SelectItem value="evolution">Evolution</SelectItem>
                  <SelectItem value="energy_matter">Energy and Matter</SelectItem>
                  <SelectItem value="information_transfer">Information Transfer</SelectItem>
                  <SelectItem value="systems_interactions">Systems and Interactions</SelectItem>
                </>
              )}
              {selectedClass === 'AP Chemistry' && (
                <>
                  <SelectItem value="atomic_structure">Atomic Structure</SelectItem>
                  <SelectItem value="molecular_interactions">Molecular Interactions</SelectItem>
                  <SelectItem value="chemical_reactions">Chemical Reactions</SelectItem>
                  <SelectItem value="kinetics">Kinetics</SelectItem>
                  <SelectItem value="thermodynamics">Thermodynamics</SelectItem>
                </>
              )}
              {selectedClass.includes('AP Physics') && (
                <>
                  <SelectItem value="systems">Systems</SelectItem>
                  <SelectItem value="fields">Fields</SelectItem>
                  <SelectItem value="force_interactions">Force Interactions</SelectItem>
                  <SelectItem value="change">Change</SelectItem>
                  <SelectItem value="conservation">Conservation</SelectItem>
                  <SelectItem value="waves">Waves</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Laboratory Component */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="lab_component"
            checked={formData.class_specific_data?.lab_component || false}
            onCheckedChange={(checked) => updateClassSpecificData('lab_component', checked)}
          />
          <Label htmlFor="lab_component" className="text-sm">
            Includes laboratory/experimental component
          </Label>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          {selectedClass} - {frqType.name} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Common FRQ Type Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="max_points">Maximum Points</Label>
            <Input
              id="max_points"
              type="number"
              value={formData.max_points || frqType.maxPoints}
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
              value={formData.time_limit || frqType.timeLimit}
              onChange={(e) => updateFormData('time_limit', parseInt(e.target.value))}
              min="5"
              max="120"
            />
          </div>
        </div>

        {/* Class-Specific Fields */}
        {renderHistoryFields()}
        {renderMathFields()}
        {renderComputerScienceFields()}
        {renderEnglishFields()}
        {renderScienceFields()}
        {renderPsychologyFields()}
        {renderEconomicsFields()}
        {renderArtHistoryFields()}

        {/* Additional Notes */}
        <div>
          <Label htmlFor="additional_notes">Additional Notes/Instructions</Label>
          <Textarea
            id="additional_notes"
            value={formData.class_specific_data?.additional_notes || ''}
            onChange={(e) => updateClassSpecificData('additional_notes', e.target.value)}
            placeholder="Any additional instructions or context for this FRQ..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  )
}
