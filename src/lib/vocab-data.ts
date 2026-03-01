// The Sacred Vocabulary Data Structure - Architected for Excellence

export interface VocabWord {
  id: string
  word: string
  definition: string
  partOfSpeech: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  apClass: string
  unit: string
  unitNumber: number
  exampleSentence?: string
  synonyms?: string[]
  antonyms?: string[]
  etymology?: string
  mnemonicDevice?: string
  relatedWords?: string[]
  frequency: number // How common this word is on AP exams (1-10)
  tags?: string[]
}

export interface VocabUnit {
  id: string
  name: string
  number: number
  apClass: string
  description: string
  wordCount: number
}

export interface APClassVocab {
  id: string
  name: string
  displayName: string
  color: string
  units: VocabUnit[]
  totalWords: number
}

// The Magnificent AP Classes Configuration
export const AP_VOCAB_CLASSES: APClassVocab[] = [
  {
    id: 'ap-english-lang',
    name: 'AP English Language',
    displayName: 'English Language',
    color: 'blue',
    totalWords: 450,
    units: [
      { id: 'rhetoric-analysis', name: 'Rhetorical Analysis', number: 1, apClass: 'AP English Language', description: 'Analyzing rhetorical strategies and devices', wordCount: 75 },
      { id: 'argument-writing', name: 'Argument Writing', number: 2, apClass: 'AP English Language', description: 'Constructing effective arguments', wordCount: 65 },
      { id: 'synthesis-essay', name: 'Synthesis Essay', number: 3, apClass: 'AP English Language', description: 'Synthesizing multiple sources', wordCount: 60 },
      { id: 'style-analysis', name: 'Style Analysis', number: 4, apClass: 'AP English Language', description: 'Analyzing author style and tone', wordCount: 70 },
      { id: 'persuasive-techniques', name: 'Persuasive Techniques', number: 5, apClass: 'AP English Language', description: 'Understanding persuasion methods', wordCount: 55 },
      { id: 'literary-devices', name: 'Literary Devices', number: 6, apClass: 'AP English Language', description: 'Identifying and analyzing literary techniques', wordCount: 85 },
      { id: 'critical-reading', name: 'Critical Reading', number: 7, apClass: 'AP English Language', description: 'Advanced reading comprehension', wordCount: 40 }
    ]
  },
  {
    id: 'ap-english-lit',
    name: 'AP English Literature',
    displayName: 'English Literature',
    color: 'purple',
    totalWords: 380,
    units: [
      { id: 'poetry-analysis', name: 'Poetry Analysis', number: 1, apClass: 'AP English Literature', description: 'Analyzing poetic devices and themes', wordCount: 65 },
      { id: 'prose-fiction', name: 'Prose Fiction', number: 2, apClass: 'AP English Literature', description: 'Understanding narrative techniques', wordCount: 55 },
      { id: 'drama-analysis', name: 'Drama Analysis', number: 3, apClass: 'AP English Literature', description: 'Analyzing dramatic works', wordCount: 50 },
      { id: 'literary-criticism', name: 'Literary Criticism', number: 4, apClass: 'AP English Literature', description: 'Critical approaches to literature', wordCount: 70 },
      { id: 'thematic-analysis', name: 'Thematic Analysis', number: 5, apClass: 'AP English Literature', description: 'Identifying and analyzing themes', wordCount: 45 },
      { id: 'character-development', name: 'Character Development', number: 6, apClass: 'AP English Literature', description: 'Analyzing character arcs and motivation', wordCount: 40 },
      { id: 'comparative-analysis', name: 'Comparative Analysis', number: 7, apClass: 'AP English Literature', description: 'Comparing literary works', wordCount: 55 }
    ]
  },
  {
    id: 'ap-world-history',
    name: 'AP World History',
    displayName: 'World History',
    color: 'green',
    totalWords: 520,
    units: [
      { id: 'global-tapestry', name: 'The Global Tapestry', number: 1, apClass: 'AP World History', description: 'Developments in East Asia, Dar al-Islam, Europe, and the Americas', wordCount: 65 },
      { id: 'networks-exchange', name: 'Networks of Exchange', number: 2, apClass: 'AP World History', description: 'Trade routes and cultural exchange', wordCount: 70 },
      { id: 'land-empires', name: 'Land-Based Empires', number: 3, apClass: 'AP World History', description: 'Ottoman, Safavid, Mughal, and other empires', wordCount: 75 },
      { id: 'transoceanic', name: 'Transoceanic Interconnections', number: 4, apClass: 'AP World History', description: 'Maritime empires and global trade', wordCount: 80 },
      { id: 'revolutions', name: 'Revolutions', number: 5, apClass: 'AP World History', description: 'Political and industrial revolutions', wordCount: 65 },
      { id: 'industrialization', name: 'Consequences of Industrialization', number: 6, apClass: 'AP World History', description: 'Industrial revolution impacts', wordCount: 60 },
      { id: 'global-conflict', name: 'Global Conflict', number: 7, apClass: 'AP World History', description: 'World wars and their consequences', wordCount: 55 },
      { id: 'cold-war', name: 'Cold War and Decolonization', number: 8, apClass: 'AP World History', description: 'Post-WWII global tensions', wordCount: 50 },
      { id: 'globalization', name: 'Globalization', number: 9, apClass: 'AP World History', description: 'Modern global interconnectedness', wordCount: 20 }
    ]
  },
  {
    id: 'ap-us-history',
    name: 'AP US History',
    displayName: 'US History',
    color: 'red',
    totalWords: 480,
    units: [
      { id: 'colonial-period', name: 'Colonial Period', number: 1, apClass: 'AP US History', description: 'European colonization of North America', wordCount: 60 },
      { id: 'independence', name: 'Independence', number: 2, apClass: 'AP US History', description: 'Revolutionary War and early republic', wordCount: 65 },
      { id: 'early-republic', name: 'Early Republic', number: 3, apClass: 'AP US History', description: 'Federalist era and expansion', wordCount: 55 },
      { id: 'jacksonian-democracy', name: 'Jacksonian Democracy', number: 4, apClass: 'AP US History', description: 'Democratic reforms and westward expansion', wordCount: 50 },
      { id: 'antebellum', name: 'Antebellum Period', number: 5, apClass: 'AP US History', description: 'Pre-Civil War tensions', wordCount: 60 },
      { id: 'civil-war', name: 'Civil War', number: 6, apClass: 'AP US History', description: 'Civil War and Reconstruction', wordCount: 70 },
      { id: 'gilded-age', name: 'Gilded Age', number: 7, apClass: 'AP US History', description: 'Industrial growth and social change', wordCount: 65 },
      { id: 'progressive-era', name: 'Progressive Era', number: 8, apClass: 'AP US History', description: 'Reform movements and modernization', wordCount: 55 }
    ]
  },
  {
    id: 'ap-psychology',
    name: 'AP Psychology',
    displayName: 'Psychology',
    color: 'indigo',
    totalWords: 420,
    units: [
      { id: 'scientific-foundations', name: 'Scientific Foundations', number: 1, apClass: 'AP Psychology', description: 'Research methods and ethics', wordCount: 50 },
      { id: 'biological-bases', name: 'Biological Bases', number: 2, apClass: 'AP Psychology', description: 'Brain structure and function', wordCount: 65 },
      { id: 'sensation-perception', name: 'Sensation and Perception', number: 3, apClass: 'AP Psychology', description: 'How we process sensory information', wordCount: 60 },
      { id: 'learning', name: 'Learning', number: 4, apClass: 'AP Psychology', description: 'Classical and operant conditioning', wordCount: 55 },
      { id: 'cognitive-psychology', name: 'Cognitive Psychology', number: 5, apClass: 'AP Psychology', description: 'Memory, thinking, and language', wordCount: 70 },
      { id: 'developmental-psychology', name: 'Developmental Psychology', number: 6, apClass: 'AP Psychology', description: 'Human development across lifespan', wordCount: 50 },
      { id: 'personality', name: 'Personality', number: 7, apClass: 'AP Psychology', description: 'Personality theories and assessment', wordCount: 45 },
      { id: 'abnormal-psychology', name: 'Abnormal Psychology', number: 8, apClass: 'AP Psychology', description: 'Mental disorders and treatment', wordCount: 25 }
    ]
  },
  {
    id: 'ap-biology',
    name: 'AP Biology',
    displayName: 'Biology',
    color: 'emerald',
    totalWords: 390,
    units: [
      { id: 'chemistry-life', name: 'Chemistry of Life', number: 1, apClass: 'AP Biology', description: 'Biological molecules and processes', wordCount: 55 },
      { id: 'cell-structure', name: 'Cell Structure and Function', number: 2, apClass: 'AP Biology', description: 'Cellular organization and processes', wordCount: 60 },
      { id: 'cellular-energetics', name: 'Cellular Energetics', number: 3, apClass: 'AP Biology', description: 'Metabolism and energy transfer', wordCount: 50 },
      { id: 'cell-communication', name: 'Cell Communication', number: 4, apClass: 'AP Biology', description: 'Cell signaling and responses', wordCount: 45 },
      { id: 'heredity', name: 'Heredity', number: 5, apClass: 'AP Biology', description: 'Genetics and inheritance patterns', wordCount: 55 },
      { id: 'gene-expression', name: 'Gene Expression', number: 6, apClass: 'AP Biology', description: 'DNA, RNA, and protein synthesis', wordCount: 50 },
      { id: 'natural-selection', name: 'Natural Selection', number: 7, apClass: 'AP Biology', description: 'Evolution and population genetics', wordCount: 40 },
      { id: 'ecology', name: 'Ecology', number: 8, apClass: 'AP Biology', description: 'Ecosystems and environmental interactions', wordCount: 35 }
    ]
  }
]

// Sample vocabulary words to demonstrate the magnificence
export const SAMPLE_VOCAB_WORDS: VocabWord[] = [
  // AP English Language
  {
    id: 'rhetoric-1',
    word: 'arcane',
    definition: 'understood by few; mysterious or secret',
    partOfSpeech: 'adjective',
    difficulty: 'Hard',
    apClass: 'AP English Language',
    unit: 'Rhetorical Analysis',
    unitNumber: 1,
    exampleSentence: 'The professor\'s arcane theories were difficult for students to comprehend.',
    synonyms: ['esoteric', 'obscure', 'cryptic'],
    antonyms: ['obvious', 'clear', 'apparent'],
    frequency: 7,
    tags: ['academic', 'formal']
  },
  {
    id: 'rhetoric-2',
    word: 'assert',
    definition: 'to state or declare positively and forcefully',
    partOfSpeech: 'verb',
    difficulty: 'Medium',
    apClass: 'AP English Language',
    unit: 'Rhetorical Analysis',
    unitNumber: 1,
    exampleSentence: 'The author asserts that climate change requires immediate action.',
    synonyms: ['declare', 'maintain', 'affirm'],
    antonyms: ['deny', 'refute', 'contradict'],
    frequency: 9,
    tags: ['argument', 'rhetoric']
  },
  {
    id: 'rhetoric-3',
    word: 'antagonist',
    definition: 'a person who actively opposes or is hostile to someone or something',
    partOfSpeech: 'noun',
    difficulty: 'Medium',
    apClass: 'AP English Language',
    unit: 'Rhetorical Analysis',
    unitNumber: 1,
    exampleSentence: 'In the debate, she served as the main antagonist to the proposed policy.',
    synonyms: ['opponent', 'adversary', 'rival'],
    antonyms: ['ally', 'supporter', 'protagonist'],
    frequency: 6,
    tags: ['literature', 'conflict']
  },
  
  // AP World History
  {
    id: 'history-1',
    word: 'hegemony',
    definition: 'leadership or dominance, especially by one country or social group over others',
    partOfSpeech: 'noun',
    difficulty: 'Hard',
    apClass: 'AP World History',
    unit: 'Land-Based Empires',
    unitNumber: 3,
    exampleSentence: 'The Ottoman Empire established hegemony over much of Southeast Europe.',
    synonyms: ['dominance', 'supremacy', 'control'],
    antonyms: ['subordination', 'subjugation'],
    frequency: 8,
    tags: ['politics', 'power']
  },
  {
    id: 'history-2',
    word: 'mercantilism',
    definition: 'economic theory that trade generates wealth and is stimulated by the accumulation of profitable balances',
    partOfSpeech: 'noun',
    difficulty: 'Medium',
    apClass: 'AP World History',
    unit: 'Transoceanic Interconnections',
    unitNumber: 4,
    exampleSentence: 'European mercantilism drove the establishment of colonies in the Americas.',
    synonyms: ['commercialism', 'trade policy'],
    frequency: 9,
    tags: ['economics', 'trade']
  },
  
  // AP Psychology
  {
    id: 'psych-1',
    word: 'cognition',
    definition: 'the mental action or process of acquiring knowledge and understanding through thought, experience, and the senses',
    partOfSpeech: 'noun',
    difficulty: 'Medium',
    apClass: 'AP Psychology',
    unit: 'Cognitive Psychology',
    unitNumber: 5,
    exampleSentence: 'The study examined how aging affects cognition and memory formation.',
    synonyms: ['thinking', 'perception', 'awareness'],
    frequency: 10,
    tags: ['mental processes', 'psychology']
  },
  {
    id: 'psych-2',
    word: 'neuroplasticity',
    definition: 'the ability of neural networks in the brain to change through growth and reorganization',
    partOfSpeech: 'noun',
    difficulty: 'Hard',
    apClass: 'AP Psychology',
    unit: 'Biological Bases',
    unitNumber: 2,
    exampleSentence: 'Research shows that neuroplasticity allows the brain to recover from injury.',
    synonyms: ['brain plasticity', 'neural adaptability'],
    frequency: 7,
    tags: ['neuroscience', 'brain']
  }
]

// Utility functions for the sacred vocabulary system
export function getVocabByClass(className: string): VocabWord[] {
  return SAMPLE_VOCAB_WORDS.filter(word => word.apClass === className)
}

export function getVocabByUnit(className: string, unitName: string): VocabWord[] {
  return SAMPLE_VOCAB_WORDS.filter(word => 
    word.apClass === className && word.unit === unitName
  )
}

export function getVocabByDifficulty(difficulty: string): VocabWord[] {
  return SAMPLE_VOCAB_WORDS.filter(word => word.difficulty === difficulty)
}

export function searchVocab(query: string): VocabWord[] {
  const lowercaseQuery = query.toLowerCase()
  return SAMPLE_VOCAB_WORDS.filter(word =>
    word.word.toLowerCase().includes(lowercaseQuery) ||
    word.definition.toLowerCase().includes(lowercaseQuery) ||
    word.synonyms?.some(synonym => synonym.toLowerCase().includes(lowercaseQuery)) ||
    word.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getRandomVocabWords(count: number, filters?: {
  apClass?: string
  unit?: string
  difficulty?: string
}): VocabWord[] {
  let filteredWords = [...SAMPLE_VOCAB_WORDS]
  
  if (filters?.apClass) {
    filteredWords = filteredWords.filter(word => word.apClass === filters.apClass)
  }
  if (filters?.unit) {
    filteredWords = filteredWords.filter(word => word.unit === filters.unit)
  }
  if (filters?.difficulty) {
    filteredWords = filteredWords.filter(word => word.difficulty === filters.difficulty)
  }
  
  // Shuffle and return requested count
  const shuffled = filteredWords.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}
