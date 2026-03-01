/**
 * Base FRQ Types Configuration
 * Simplified system focusing on the four fundamental FRQ types used across AP classes
 */

export interface BaseFRQType {
  id: string
  name: string
  description: string
  defaultTimeLimit: number
  defaultMaxPoints: number
  hasMultipleParts: boolean
  allowsDocuments: boolean
  allowsImages: boolean
  requiredFields: string[]
  optionalFields: string[]
  guidelines: string[]
  examples: string[]
}

// The four fundamental FRQ types used across AP classes
export const BASE_FRQ_TYPES: Record<string, BaseFRQType> = {
  'frq': {
    id: 'frq',
    name: 'Free Response Question (FRQ)',
    description: 'Standard free response question requiring detailed written responses',
    defaultTimeLimit: 25,
    defaultMaxPoints: 7,
    hasMultipleParts: true,
    allowsDocuments: false,
    allowsImages: true,
    requiredFields: ['question', 'context'],
    optionalFields: ['stimulus_material', 'data_tables', 'graphs'],
    guidelines: [
      'Provide clear, detailed responses',
      'Show all work and reasoning',
      'Use appropriate subject-specific terminology',
      'Address all parts of the question'
    ],
    examples: [
      'Analyze the causes and effects of a historical event',
      'Solve a multi-step mathematical problem',
      'Design and analyze a scientific experiment'
    ]
  },
  
  'dbq': {
    id: 'dbq',
    name: 'Document-Based Question (DBQ)',
    description: 'Essay question using provided historical documents to construct an argument',
    defaultTimeLimit: 60,
    defaultMaxPoints: 7,
    hasMultipleParts: false,
    allowsDocuments: true,
    allowsImages: true,
    requiredFields: ['prompt', 'historical_context', 'document_set'],
    optionalFields: ['additional_document_suggestion', 'background_information'],
    guidelines: [
      'Develop a thesis that responds to the prompt',
      'Use at least 6 of the provided documents',
      'Analyze documents for point of view, purpose, audience, and context',
      'Provide contextualization and synthesis',
      'Use evidence beyond the documents'
    ],
    examples: [
      'Analyze the causes of the French Revolution using provided documents',
      'Evaluate the impact of industrialization on society using historical sources',
      'Assess the effectiveness of New Deal policies using contemporary documents'
    ]
  },
  
  'leq': {
    id: 'leq',
    name: 'Long Essay Question (LEQ)',
    description: 'Extended essay demonstrating historical thinking skills without provided documents',
    defaultTimeLimit: 40,
    defaultMaxPoints: 6,
    hasMultipleParts: false,
    allowsDocuments: false,
    allowsImages: false,
    requiredFields: ['prompt', 'historical_thinking_skill', 'time_period'],
    optionalFields: ['geographic_focus', 'thematic_focus'],
    guidelines: [
      'Develop a clear, historically defensible thesis',
      'Provide contextualization',
      'Use specific historical evidence',
      'Demonstrate the targeted historical thinking skill',
      'Synthesize arguments and evidence into a coherent essay'
    ],
    examples: [
      'Evaluate the extent to which the Mongol Empire facilitated trade',
      'Compare the effects of imperialism in Africa and Asia',
      'Analyze the causes of decolonization after World War II'
    ]
  },
  
  'saq': {
    id: 'saq',
    name: 'Short Answer Question (SAQ)',
    description: 'Brief responses typically consisting of 2-4 parts requiring concise answers',
    defaultTimeLimit: 15,
    defaultMaxPoints: 3,
    hasMultipleParts: true,
    allowsDocuments: true,
    allowsImages: true,
    requiredFields: ['prompt_parts'],
    optionalFields: ['stimulus_text', 'stimulus_image', 'historical_context'],
    guidelines: [
      'Answer each part clearly and concisely',
      'Use specific evidence to support answers',
      'Typically 2-3 sentences per part',
      'Address the specific task words (identify, explain, analyze, etc.)'
    ],
    examples: [
      'Identify and explain causes of the Great Depression',
      'Analyze the impact of technological innovations on society',
      'Compare political systems in different time periods'
    ]
  }
}

// Mapping of AP classes to their available FRQ types
export const AP_CLASS_FRQ_TYPES: Record<string, string[]> = {
  // History Classes - Use all four types
  'AP World History': ['saq', 'dbq', 'leq'],
  'AP US History': ['saq', 'dbq', 'leq'],
  'AP European History': ['saq', 'dbq', 'leq'],
  
  // Math Classes - Only standard FRQs
  'AP Calculus AB': ['frq'],
  'AP Calculus BC': ['frq'],
  'AP Precalculus': ['frq'],
  'AP Statistics': ['frq'],
  
  // Science Classes - Only standard FRQs
  'AP Biology': ['frq'],
  'AP Chemistry': ['frq'],
  'AP Physics 1': ['frq'],
  'AP Physics 2': ['frq'],
  'AP Physics C: Mechanics': ['frq'],
  'AP Physics C: Electricity and Magnetism': ['frq'],
  'AP Environmental Science': ['frq'],
  
  // Computer Science - Only standard FRQs
  'AP Computer Science A': ['frq'],
  
  // English Classes - Only standard FRQs (their essays are considered FRQs)
  'AP English Language and Composition': ['frq'],
  'AP English Literature and Composition': ['frq'],
  
  // Social Sciences - Only standard FRQs
  'AP Psychology': ['frq'],
  'AP Human Geography': ['frq'],
  'AP US Government': ['frq'],
  'AP Comparative Government': ['frq'],
  
  // Economics - Only standard FRQs
  'AP Microeconomics': ['frq'],
  'AP Macroeconomics': ['frq'],
  
  // Art History - Only standard FRQs
  'AP Art History': ['frq']
}

// Helper functions
export function getFRQTypesForClass(className: string): BaseFRQType[] {
  const typeIds = AP_CLASS_FRQ_TYPES[className] || ['frq']
  return typeIds.map(id => BASE_FRQ_TYPES[id]).filter(Boolean)
}

export function getBaseFRQType(typeId: string): BaseFRQType | null {
  return BASE_FRQ_TYPES[typeId] || null
}

export function getAllFRQTypes(): BaseFRQType[] {
  return Object.values(BASE_FRQ_TYPES)
}

export function isValidFRQTypeForClass(className: string, frqTypeId: string): boolean {
  const availableTypes = AP_CLASS_FRQ_TYPES[className] || ['frq']
  return availableTypes.includes(frqTypeId)
}
