/**
 * Comprehensive FRQ Type Configuration for All AP Classes
 * Based on College Board Course and Exam Descriptions (CED)
 */

export interface FRQTypeConfig {
  id: string
  name: string
  description: string
  timeLimit: number // in minutes
  maxPoints: number
  requiredFields: string[]
  optionalFields: string[]
  hasMultipleParts: boolean
  allowsImages: boolean
  allowsDocuments: boolean
  allowsGraphs: boolean
  allowsCode: boolean
  rubricType: 'holistic' | 'analytic' | 'custom'
  examples?: string[]
  guidelines?: string[]
}

export interface APClassConfig {
  className: string
  frqTypes: FRQTypeConfig[]
  commonFields: string[]
  examStructure: {
    totalFRQs: number
    totalTime: number // in minutes
    sections?: {
      name: string
      questions: number
      time: number
    }[]
  }
}

// AP History Classes (World, US, European)
const historyFRQTypes: FRQTypeConfig[] = [
  {
    id: 'saq',
    name: 'Short Answer Question (SAQ)',
    description: 'Brief responses analyzing historical evidence, typically 3-4 sentences per part',
    timeLimit: 10, // per question
    maxPoints: 3,
    requiredFields: ['prompt', 'historical_context', 'time_period'],
    optionalFields: ['primary_source', 'image_stimulus'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: true,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze the causes of the French Revolution',
      'Compare the effects of industrialization in two regions'
    ],
    guidelines: [
      'Each part should be answerable in 3-4 sentences',
      'Include specific historical evidence',
      'Focus on analysis, not just description'
    ]
  },
  {
    id: 'leq',
    name: 'Long Essay Question (LEQ)',
    description: 'Extended essay demonstrating historical argumentation skills',
    timeLimit: 40,
    maxPoints: 6,
    requiredFields: ['prompt', 'thesis_requirement', 'historical_context', 'time_period'],
    optionalFields: ['comparative_element', 'causation_element', 'change_continuity_element'],
    hasMultipleParts: false,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Evaluate the extent to which the Mongol Empire changed trade networks',
      'Analyze the causes of decolonization in Africa after 1945'
    ],
    guidelines: [
      'Must include a clear thesis statement',
      'Requires contextualization paragraph',
      'Need specific historical evidence',
      'Must demonstrate complex understanding'
    ]
  },
  {
    id: 'dbq',
    name: 'Document-Based Question (DBQ)',
    description: 'Essay using provided documents to construct historical argument',
    timeLimit: 60,
    maxPoints: 7,
    requiredFields: ['prompt', 'historical_context', 'time_period', 'document_set'],
    optionalFields: ['additional_document_suggestion'],
    hasMultipleParts: false,
    allowsImages: true,
    allowsDocuments: true,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze responses to the spread of Buddhism in China',
      'Evaluate the causes of the Mexican Revolution'
    ],
    guidelines: [
      'Must use at least 6 of the provided documents',
      'Requires thesis with historically defensible claim',
      'Need contextualization and synthesis',
      'Must analyze documents for purpose, audience, point of view'
    ]
  }
]

// AP Math Classes (Calculus AB/BC, Statistics, Precalculus)
const mathFRQTypes: FRQTypeConfig[] = [
  {
    id: 'analytical',
    name: 'Analytical/Algebraic FRQ',
    description: 'Multi-part problem requiring analytical and algebraic methods',
    timeLimit: 30,
    maxPoints: 9,
    requiredFields: ['problem_statement', 'mathematical_context'],
    optionalFields: ['graph_stimulus', 'table_data', 'real_world_context'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Find the area between curves using integration',
      'Analyze the behavior of a function and its derivatives'
    ],
    guidelines: [
      'Show all work and mathematical reasoning',
      'Include proper mathematical notation',
      'Each part builds on previous parts'
    ]
  },
  {
    id: 'graphical',
    name: 'Graphical Analysis FRQ',
    description: 'Problems involving interpretation and analysis of graphs',
    timeLimit: 30,
    maxPoints: 9,
    requiredFields: ['problem_statement', 'graph_description'],
    optionalFields: ['coordinate_system', 'scale_information'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Interpret the graph of a derivative function',
      'Analyze motion using position and velocity graphs'
    ],
    guidelines: [
      'Reference specific points on the graph',
      'Explain graphical reasoning clearly',
      'Connect graphical and analytical methods'
    ]
  },
  {
    id: 'applied',
    name: 'Applied/Real-World FRQ',
    description: 'Mathematical modeling of real-world situations',
    timeLimit: 30,
    maxPoints: 9,
    requiredFields: ['problem_statement', 'real_world_context', 'mathematical_model'],
    optionalFields: ['data_table', 'constraints', 'assumptions'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Model population growth using differential equations',
      'Optimize a business scenario using calculus'
    ],
    guidelines: [
      'Clearly state assumptions and constraints',
      'Interpret results in context',
      'Show mathematical modeling process'
    ]
  }
]

// AP Statistics Specific FRQs
const statisticsFRQTypes: FRQTypeConfig[] = [
  {
    id: 'exploratory_analysis',
    name: 'Exploratory Data Analysis',
    description: 'Analyzing and interpreting data distributions and relationships',
    timeLimit: 25,
    maxPoints: 4,
    requiredFields: ['data_description', 'analysis_task'],
    optionalFields: ['data_table', 'graph_stimulus', 'context'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze the distribution of test scores',
      'Compare two datasets using appropriate statistics'
    ],
    guidelines: [
      'Use appropriate statistical measures',
      'Interpret results in context',
      'Address all aspects of the distribution'
    ]
  },
  {
    id: 'inference',
    name: 'Statistical Inference',
    description: 'Hypothesis testing and confidence intervals',
    timeLimit: 25,
    maxPoints: 4,
    requiredFields: ['scenario', 'statistical_question', 'data_conditions'],
    optionalFields: ['sample_data', 'population_parameters'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Test a claim about population mean',
      'Construct confidence interval for proportion'
    ],
    guidelines: [
      'State hypotheses clearly',
      'Check all conditions',
      'Interpret results in context of the problem'
    ]
  },
  {
    id: 'investigative_task',
    name: 'Investigative Task',
    description: 'Extended problem requiring multiple statistical concepts',
    timeLimit: 25,
    maxPoints: 4,
    requiredFields: ['complex_scenario', 'multiple_questions'],
    optionalFields: ['large_dataset', 'technology_use'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'holistic',
    examples: [
      'Design and analyze a complete statistical study',
      'Investigate relationships in a complex dataset'
    ],
    guidelines: [
      'Demonstrate understanding of statistical process',
      'Use appropriate statistical methods',
      'Communicate findings clearly'
    ]
  }
]

// AP Science Classes FRQs
const scienceFRQTypes: FRQTypeConfig[] = [
  {
    id: 'experimental_design',
    name: 'Experimental Design & Analysis',
    description: 'Design experiments and analyze scientific data',
    timeLimit: 25,
    maxPoints: 10,
    requiredFields: ['scientific_question', 'experimental_setup'],
    optionalFields: ['control_variables', 'data_table', 'graph_analysis'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Design an experiment to test enzyme activity',
      'Analyze data from a genetics cross'
    ],
    guidelines: [
      'Identify independent and dependent variables',
      'Include appropriate controls',
      'Analyze data using scientific reasoning'
    ]
  },
  {
    id: 'conceptual_analysis',
    name: 'Conceptual Analysis',
    description: 'Apply scientific concepts to explain phenomena',
    timeLimit: 20,
    maxPoints: 8,
    requiredFields: ['phenomenon_description', 'concept_application'],
    optionalFields: ['diagram_analysis', 'molecular_explanation'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Explain photosynthesis at molecular level',
      'Analyze inheritance patterns in genetics'
    ],
    guidelines: [
      'Use appropriate scientific terminology',
      'Connect concepts to evidence',
      'Provide detailed explanations'
    ]
  }
]

// AP Computer Science A FRQs
const computerScienceFRQTypes: FRQTypeConfig[] = [
  {
    id: 'methods_control',
    name: 'Methods and Control Structures',
    description: 'Write methods using control structures and algorithms',
    timeLimit: 22,
    maxPoints: 9,
    requiredFields: ['method_specification', 'algorithm_description'],
    optionalFields: ['preconditions', 'postconditions', 'example_calls'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: true,
    rubricType: 'analytic',
    examples: [
      'Write a method to find the maximum value in an array',
      'Implement a recursive algorithm'
    ],
    guidelines: [
      'Use proper Java syntax',
      'Include appropriate control structures',
      'Handle edge cases'
    ]
  },
  {
    id: 'class_design',
    name: 'Class Design',
    description: 'Design and implement classes with inheritance',
    timeLimit: 22,
    maxPoints: 9,
    requiredFields: ['class_specification', 'inheritance_relationship'],
    optionalFields: ['interface_implementation', 'abstract_methods'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: true,
    rubricType: 'analytic',
    examples: [
      'Design a class hierarchy for geometric shapes',
      'Implement an interface with multiple classes'
    ],
    guidelines: [
      'Follow object-oriented design principles',
      'Implement required methods correctly',
      'Use inheritance appropriately'
    ]
  },
  {
    id: 'array_arraylist',
    name: 'Array/ArrayList',
    description: 'Manipulate arrays and ArrayLists with algorithms',
    timeLimit: 22,
    maxPoints: 9,
    requiredFields: ['data_structure_context', 'manipulation_task'],
    optionalFields: ['efficiency_considerations', 'alternative_approaches'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: true,
    rubricType: 'analytic',
    examples: [
      'Process data in a 2D array',
      'Implement searching and sorting algorithms'
    ],
    guidelines: [
      'Use appropriate data structure methods',
      'Handle boundary conditions',
      'Write efficient algorithms'
    ]
  }
]

// AP Psychology FRQs
const psychologyFRQTypes: FRQTypeConfig[] = [
  {
    id: 'application',
    name: 'Application Question',
    description: 'Apply psychological concepts to real-world scenarios',
    timeLimit: 25,
    maxPoints: 7,
    requiredFields: ['scenario', 'psychological_concepts', 'application_task'],
    optionalFields: ['research_support', 'examples'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Apply conditioning principles to explain behavior modification',
      'Use cognitive psychology to analyze decision-making processes'
    ],
    guidelines: [
      'Define psychological concepts clearly',
      'Apply concepts accurately to the scenario',
      'Use specific examples and research support'
    ]
  },
  {
    id: 'research_design',
    name: 'Research Design Question',
    description: 'Design psychological research studies and analyze methodology',
    timeLimit: 25,
    maxPoints: 7,
    requiredFields: ['research_question', 'methodology', 'variables'],
    optionalFields: ['ethical_considerations', 'limitations'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Design a study to test the effectiveness of therapy',
      'Analyze the methodology of a memory research study'
    ],
    guidelines: [
      'Identify independent and dependent variables',
      'Address ethical considerations',
      'Explain research methodology clearly'
    ]
  }
]

// AP Human Geography FRQs
const humanGeographyFRQTypes: FRQTypeConfig[] = [
  {
    id: 'spatial_analysis',
    name: 'Spatial Analysis Question',
    description: 'Analyze geographic patterns and spatial relationships',
    timeLimit: 25,
    maxPoints: 7,
    requiredFields: ['geographic_concept', 'spatial_pattern', 'analysis_task'],
    optionalFields: ['maps', 'data_analysis', 'case_studies'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze urbanization patterns in developing countries',
      'Explain the spatial distribution of agricultural practices'
    ],
    guidelines: [
      'Use geographic terminology correctly',
      'Analyze spatial patterns and relationships',
      'Provide specific examples and case studies'
    ]
  },
  {
    id: 'geographic_models',
    name: 'Geographic Models Question',
    description: 'Apply and evaluate geographic models and theories',
    timeLimit: 25,
    maxPoints: 7,
    requiredFields: ['geographic_model', 'application_context', 'evaluation'],
    optionalFields: ['limitations', 'alternatives'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Apply the demographic transition model to a specific country',
      'Evaluate the von Thünen model in modern agriculture'
    ],
    guidelines: [
      'Explain the model accurately',
      'Apply model to specific contexts',
      'Evaluate strengths and limitations'
    ]
  }
]

// AP Economics FRQs (Micro and Macro)
const economicsFRQTypes: FRQTypeConfig[] = [
  {
    id: 'graph_analysis',
    name: 'Graph Analysis Question',
    description: 'Analyze and manipulate economic graphs and models',
    timeLimit: 25,
    maxPoints: 10,
    requiredFields: ['economic_scenario', 'graph_requirements', 'analysis_task'],
    optionalFields: ['calculations', 'policy_implications'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Draw and analyze supply and demand curves',
      'Show the effects of monetary policy on the economy'
    ],
    guidelines: [
      'Draw graphs accurately with proper labels',
      'Show changes clearly with arrows or shifts',
      'Explain economic reasoning behind changes'
    ]
  },
  {
    id: 'policy_analysis',
    name: 'Policy Analysis Question',
    description: 'Analyze economic policies and their effects',
    timeLimit: 25,
    maxPoints: 10,
    requiredFields: ['policy_scenario', 'economic_effects', 'analysis'],
    optionalFields: ['long_term_effects', 'alternative_policies'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze the effects of a minimum wage increase',
      'Evaluate the impact of fiscal stimulus policies'
    ],
    guidelines: [
      'Identify all relevant economic effects',
      'Use economic terminology correctly',
      'Consider both short-term and long-term impacts'
    ]
  }
]

// AP Government and Politics FRQs
const governmentFRQTypes: FRQTypeConfig[] = [
  {
    id: 'concept_application',
    name: 'Concept Application Question',
    description: 'Apply political concepts to real-world scenarios',
    timeLimit: 20,
    maxPoints: 4,
    requiredFields: ['political_scenario', 'concepts_to_apply', 'application_task'],
    optionalFields: ['examples', 'implications'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: true,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Apply federalism concepts to a policy dispute',
      'Analyze how checks and balances work in practice'
    ],
    guidelines: [
      'Define political concepts clearly',
      'Apply concepts accurately to scenarios',
      'Use specific examples from government'
    ]
  },
  {
    id: 'scotus_analysis',
    name: 'Supreme Court Analysis Question',
    description: 'Analyze Supreme Court cases and constitutional principles',
    timeLimit: 20,
    maxPoints: 4,
    requiredFields: ['case_context', 'constitutional_principle', 'analysis_task'],
    optionalFields: ['precedent', 'implications'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: true,
    allowsGraphs: false,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze how a Supreme Court case affects civil liberties',
      'Explain the constitutional principles in landmark cases'
    ],
    guidelines: [
      'Identify relevant constitutional principles',
      'Explain the Court\'s reasoning',
      'Discuss broader implications'
    ]
  }
]

// AP Art History FRQs
const artHistoryFRQTypes: FRQTypeConfig[] = [
  {
    id: 'visual_analysis',
    name: 'Visual Analysis Question',
    description: 'Analyze visual elements and artistic techniques',
    timeLimit: 15,
    maxPoints: 5,
    requiredFields: ['artwork_image', 'visual_elements', 'analysis_focus'],
    optionalFields: ['techniques', 'style_period'],
    hasMultipleParts: false,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: false,
    rubricType: 'holistic',
    examples: [
      'Analyze the use of perspective in Renaissance painting',
      'Examine color and composition in modern art'
    ],
    guidelines: [
      'Use appropriate art historical terminology',
      'Focus on visual evidence in the artwork',
      'Organize analysis clearly and systematically'
    ]
  },
  {
    id: 'comparison',
    name: 'Comparison Question',
    description: 'Compare artworks from different periods or cultures',
    timeLimit: 15,
    maxPoints: 5,
    requiredFields: ['artwork_1', 'artwork_2', 'comparison_criteria'],
    optionalFields: ['cultural_context', 'historical_significance'],
    hasMultipleParts: false,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: false,
    rubricType: 'holistic',
    examples: [
      'Compare Gothic and Romanesque architecture',
      'Analyze similarities and differences in Buddhist art'
    ],
    guidelines: [
      'Address both similarities and differences',
      'Use specific visual evidence',
      'Consider cultural and historical contexts'
    ]
  },
  {
    id: 'attribution',
    name: 'Attribution Question',
    description: 'Identify artist, culture, or period based on visual analysis',
    timeLimit: 15,
    maxPoints: 5,
    requiredFields: ['unknown_artwork', 'attribution_task', 'evidence'],
    optionalFields: ['style_characteristics', 'cultural_markers'],
    hasMultipleParts: false,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Identify the culture that created this sculpture',
      'Determine the artistic period of this painting'
    ],
    guidelines: [
      'Base attribution on visual evidence',
      'Explain reasoning clearly',
      'Use knowledge of artistic styles and periods'
    ]
  }
]

// AP Environmental Science FRQs
const environmentalScienceFRQTypes: FRQTypeConfig[] = [
  {
    id: 'data_analysis',
    name: 'Data Analysis Question',
    description: 'Analyze environmental data and draw conclusions',
    timeLimit: 22,
    maxPoints: 10,
    requiredFields: ['data_set', 'analysis_task', 'environmental_context'],
    optionalFields: ['calculations', 'graphs', 'trends'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze water quality data from a watershed',
      'Interpret climate change data and trends'
    ],
    guidelines: [
      'Show all calculations clearly',
      'Interpret data accurately',
      'Connect findings to environmental concepts'
    ]
  },
  {
    id: 'environmental_problem',
    name: 'Environmental Problem Question',
    description: 'Propose solutions to environmental problems',
    timeLimit: 22,
    maxPoints: 10,
    requiredFields: ['environmental_problem', 'proposed_solutions', 'evaluation'],
    optionalFields: ['costs_benefits', 'stakeholders', 'implementation'],
    hasMultipleParts: true,
    allowsImages: true,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Propose solutions for urban air pollution',
      'Design a plan to restore damaged ecosystems'
    ],
    guidelines: [
      'Identify multiple solution approaches',
      'Consider environmental and economic factors',
      'Evaluate feasibility and effectiveness'
    ]
  }
]

// AP Precalculus FRQs
const precalculusFRQTypes: FRQTypeConfig[] = [
  {
    id: 'function_analysis',
    name: 'Function Analysis Question',
    description: 'Analyze properties and behavior of functions',
    timeLimit: 30,
    maxPoints: 6,
    requiredFields: ['function_context', 'analysis_task', 'mathematical_reasoning'],
    optionalFields: ['graphical_analysis', 'transformations'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Analyze the behavior of polynomial functions',
      'Examine transformations of trigonometric functions'
    ],
    guidelines: [
      'Use appropriate mathematical notation',
      'Show clear mathematical reasoning',
      'Connect algebraic and graphical representations'
    ]
  },
  {
    id: 'modeling',
    name: 'Mathematical Modeling Question',
    description: 'Create and analyze mathematical models',
    timeLimit: 30,
    maxPoints: 6,
    requiredFields: ['real_world_context', 'mathematical_model', 'analysis'],
    optionalFields: ['predictions', 'limitations', 'refinements'],
    hasMultipleParts: true,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'analytic',
    examples: [
      'Model population growth using exponential functions',
      'Create a trigonometric model for periodic phenomena'
    ],
    guidelines: [
      'Clearly define variables and parameters',
      'Justify choice of mathematical model',
      'Interpret results in context'
    ]
  }
]

// AP English Language FRQs
const englishLanguageFRQTypes: FRQTypeConfig[] = [
  {
    id: 'synthesis',
    name: 'Synthesis Essay',
    description: 'Combine multiple sources to develop and support an argument',
    timeLimit: 40,
    maxPoints: 6,
    requiredFields: ['prompt', 'source_set', 'argument_focus'],
    optionalFields: ['additional_context', 'counterargument_consideration'],
    hasMultipleParts: false,
    allowsImages: true,
    allowsDocuments: true,
    allowsGraphs: true,
    allowsCode: false,
    rubricType: 'holistic',
    examples: [
      'Develop an argument about social media\'s impact on democracy',
      'Argue for or against standardized testing in education'
    ],
    guidelines: [
      'Use at least 3 of the provided sources',
      'Develop a clear thesis statement',
      'Synthesize sources to support argument'
    ]
  },
  {
    id: 'rhetorical_analysis',
    name: 'Rhetorical Analysis',
    description: 'Analyze rhetorical strategies in a given text',
    timeLimit: 40,
    maxPoints: 6,
    requiredFields: ['text_passage', 'rhetorical_situation', 'analysis_focus'],
    optionalFields: ['author_background', 'historical_context'],
    hasMultipleParts: false,
    allowsImages: false,
    allowsDocuments: true,
    allowsGraphs: false,
    allowsCode: false,
    rubricType: 'holistic',
    examples: [
      'Analyze MLK\'s "Letter from Birmingham Jail"',
      'Examine rhetorical strategies in a political speech'
    ],
    guidelines: [
      'Identify specific rhetorical strategies',
      'Explain how strategies achieve the author\'s purpose',
      'Use evidence from the text'
    ]
  },
  {
    id: 'argument',
    name: 'Argument Essay',
    description: 'Develop an evidence-based argument on a given topic',
    timeLimit: 40,
    maxPoints: 6,
    requiredFields: ['argument_prompt', 'position_statement'],
    optionalFields: ['counterargument_acknowledgment', 'call_to_action'],
    hasMultipleParts: false,
    allowsImages: false,
    allowsDocuments: false,
    allowsGraphs: false,
    allowsCode: false,
    rubricType: 'holistic',
    examples: [
      'Argue whether artificial intelligence benefits society',
      'Take a position on the role of government in healthcare'
    ],
    guidelines: [
      'Develop a clear thesis statement',
      'Use relevant evidence and examples',
      'Address counterarguments'
    ]
  }
]

// Complete AP Class Configuration
export const AP_CLASS_CONFIGS: Record<string, APClassConfig> = {
  'AP World History': {
    className: 'AP World History',
    frqTypes: historyFRQTypes,
    commonFields: ['time_period', 'geographic_region', 'historical_thinking_skill'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 100,
      sections: [
        { name: 'SAQ', questions: 3, time: 40 },
        { name: 'DBQ', questions: 1, time: 60 },
        { name: 'LEQ', questions: 1, time: 40 }
      ]
    }
  },
  
  'AP US History': {
    className: 'AP US History',
    frqTypes: historyFRQTypes,
    commonFields: ['time_period', 'geographic_region', 'historical_thinking_skill'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 100,
      sections: [
        { name: 'SAQ', questions: 3, time: 40 },
        { name: 'DBQ', questions: 1, time: 60 },
        { name: 'LEQ', questions: 1, time: 40 }
      ]
    }
  },

  'AP European History': {
    className: 'AP European History',
    frqTypes: historyFRQTypes,
    commonFields: ['time_period', 'geographic_region', 'historical_thinking_skill'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 100,
      sections: [
        { name: 'SAQ', questions: 3, time: 40 },
        { name: 'DBQ', questions: 1, time: 60 },
        { name: 'LEQ', questions: 1, time: 40 }
      ]
    }
  },

  'AP Calculus AB': {
    className: 'AP Calculus AB',
    frqTypes: mathFRQTypes,
    commonFields: ['mathematical_practices', 'calculator_policy', 'units_of_study'],
    examStructure: {
      totalFRQs: 6,
      totalTime: 90,
      sections: [
        { name: 'Part A (Calculator)', questions: 2, time: 30 },
        { name: 'Part B (No Calculator)', questions: 4, time: 60 }
      ]
    }
  },

  'AP Calculus BC': {
    className: 'AP Calculus BC',
    frqTypes: mathFRQTypes,
    commonFields: ['mathematical_practices', 'calculator_policy', 'units_of_study'],
    examStructure: {
      totalFRQs: 6,
      totalTime: 90,
      sections: [
        { name: 'Part A (Calculator)', questions: 2, time: 30 },
        { name: 'Part B (No Calculator)', questions: 4, time: 60 }
      ]
    }
  },

  'AP Statistics': {
    className: 'AP Statistics',
    frqTypes: statisticsFRQTypes,
    commonFields: ['statistical_investigation', 'data_type', 'technology_use'],
    examStructure: {
      totalFRQs: 6,
      totalTime: 90,
      sections: [
        { name: 'Part A', questions: 5, time: 65 },
        { name: 'Part B (Investigative Task)', questions: 1, time: 25 }
      ]
    }
  },

  'AP Computer Science A': {
    className: 'AP Computer Science A',
    frqTypes: computerScienceFRQTypes,
    commonFields: ['programming_construct', 'object_oriented_concept', 'algorithm_complexity'],
    examStructure: {
      totalFRQs: 4,
      totalTime: 90,
      sections: [
        { name: 'FRQ Section', questions: 4, time: 90 }
      ]
    }
  },

  'AP Biology': {
    className: 'AP Biology',
    frqTypes: scienceFRQTypes,
    commonFields: ['science_practice', 'big_idea', 'cross_cutting_concept'],
    examStructure: {
      totalFRQs: 6,
      totalTime: 90,
      sections: [
        { name: 'Long FRQs', questions: 2, time: 50 },
        { name: 'Short FRQs', questions: 4, time: 40 }
      ]
    }
  },

  'AP Chemistry': {
    className: 'AP Chemistry',
    frqTypes: scienceFRQTypes,
    commonFields: ['science_practice', 'big_idea', 'mathematical_calculation'],
    examStructure: {
      totalFRQs: 7,
      totalTime: 105,
      sections: [
        { name: 'Long FRQs', questions: 3, time: 75 },
        { name: 'Short FRQs', questions: 4, time: 30 }
      ]
    }
  },

  'AP Physics 1': {
    className: 'AP Physics 1',
    frqTypes: scienceFRQTypes,
    commonFields: ['science_practice', 'big_idea', 'mathematical_reasoning'],
    examStructure: {
      totalFRQs: 5,
      totalTime: 90,
      sections: [
        { name: 'FRQ Section', questions: 5, time: 90 }
      ]
    }
  },

  'AP English Language and Composition': {
    className: 'AP English Language and Composition',
    frqTypes: englishLanguageFRQTypes,
    commonFields: ['rhetorical_situation', 'evidence_type', 'writing_skill'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 135,
      sections: [
        { name: 'Essay Section', questions: 3, time: 135 }
      ]
    }
  },

  'AP Psychology': {
    className: 'AP Psychology',
    frqTypes: psychologyFRQTypes,
    commonFields: ['psychological_concept', 'research_method', 'application_context'],
    examStructure: {
      totalFRQs: 2,
      totalTime: 50,
      sections: [
        { name: 'FRQ Section', questions: 2, time: 50 }
      ]
    }
  },

  'AP Human Geography': {
    className: 'AP Human Geography',
    frqTypes: humanGeographyFRQTypes,
    commonFields: ['geographic_concept', 'spatial_analysis', 'case_study'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 75,
      sections: [
        { name: 'FRQ Section', questions: 3, time: 75 }
      ]
    }
  },

  'AP Microeconomics': {
    className: 'AP Microeconomics',
    frqTypes: economicsFRQTypes,
    commonFields: ['economic_concept', 'graph_analysis', 'policy_application'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 60,
      sections: [
        { name: 'FRQ Section', questions: 3, time: 60 }
      ]
    }
  },

  'AP Macroeconomics': {
    className: 'AP Macroeconomics',
    frqTypes: economicsFRQTypes,
    commonFields: ['economic_concept', 'graph_analysis', 'policy_application'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 60,
      sections: [
        { name: 'FRQ Section', questions: 3, time: 60 }
      ]
    }
  },

  'AP US Government': {
    className: 'AP US Government',
    frqTypes: governmentFRQTypes,
    commonFields: ['political_concept', 'constitutional_principle', 'case_study'],
    examStructure: {
      totalFRQs: 4,
      totalTime: 100,
      sections: [
        { name: 'FRQ Section', questions: 4, time: 100 }
      ]
    }
  },

  'AP Comparative Government': {
    className: 'AP Comparative Government',
    frqTypes: governmentFRQTypes,
    commonFields: ['political_concept', 'comparative_analysis', 'country_study'],
    examStructure: {
      totalFRQs: 8,
      totalTime: 100,
      sections: [
        { name: 'Short Answer', questions: 5, time: 30 },
        { name: 'Conceptual Analysis', questions: 3, time: 70 }
      ]
    }
  },

  'AP Art History': {
    className: 'AP Art History',
    frqTypes: artHistoryFRQTypes,
    commonFields: ['visual_analysis', 'cultural_context', 'art_historical_period'],
    examStructure: {
      totalFRQs: 6,
      totalTime: 120,
      sections: [
        { name: 'Long Essays', questions: 2, time: 60 },
        { name: 'Short Essays', questions: 4, time: 60 }
      ]
    }
  },

  'AP Environmental Science': {
    className: 'AP Environmental Science',
    frqTypes: environmentalScienceFRQTypes,
    commonFields: ['environmental_concept', 'data_analysis', 'problem_solving'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 70,
      sections: [
        { name: 'FRQ Section', questions: 3, time: 70 }
      ]
    }
  },

  'AP Precalculus': {
    className: 'AP Precalculus',
    frqTypes: precalculusFRQTypes,
    commonFields: ['mathematical_practices', 'function_analysis', 'modeling'],
    examStructure: {
      totalFRQs: 4,
      totalTime: 90,
      sections: [
        { name: 'FRQ Section', questions: 4, time: 90 }
      ]
    }
  },

  'AP Physics 2': {
    className: 'AP Physics 2',
    frqTypes: scienceFRQTypes,
    commonFields: ['science_practice', 'big_idea', 'mathematical_reasoning'],
    examStructure: {
      totalFRQs: 4,
      totalTime: 90,
      sections: [
        { name: 'FRQ Section', questions: 4, time: 90 }
      ]
    }
  },

  'AP Physics C: Electricity and Magnetism': {
    className: 'AP Physics C: Electricity and Magnetism',
    frqTypes: scienceFRQTypes,
    commonFields: ['science_practice', 'mathematical_modeling', 'calculus_application'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 45,
      sections: [
        { name: 'FRQ Section', questions: 3, time: 45 }
      ]
    }
  },

  'AP English Literature and Composition': {
    className: 'AP English Literature and Composition',
    frqTypes: [
      {
        id: 'poetry_analysis',
        name: 'Poetry Analysis',
        description: 'Analyze literary elements and techniques in poetry',
        timeLimit: 40,
        maxPoints: 6,
        requiredFields: ['poem_text', 'analysis_focus', 'literary_elements'],
        optionalFields: ['historical_context', 'author_background'],
        hasMultipleParts: false,
        allowsImages: false,
        allowsDocuments: true,
        allowsGraphs: false,
        allowsCode: false,
        rubricType: 'holistic',
        examples: [
          'Analyze the use of imagery in a Romantic poem',
          'Examine the speaker\'s voice in a contemporary poem'
        ],
        guidelines: [
          'Focus on specific literary techniques',
          'Use textual evidence to support analysis',
          'Organize analysis clearly and coherently'
        ]
      },
      {
        id: 'prose_analysis',
        name: 'Prose Analysis',
        description: 'Analyze literary elements and techniques in prose passages',
        timeLimit: 40,
        maxPoints: 6,
        requiredFields: ['prose_passage', 'analysis_focus', 'literary_techniques'],
        optionalFields: ['narrative_structure', 'character_development'],
        hasMultipleParts: false,
        allowsImages: false,
        allowsDocuments: true,
        allowsGraphs: false,
        allowsCode: false,
        rubricType: 'holistic',
        examples: [
          'Analyze narrative technique in a novel excerpt',
          'Examine characterization in a short story passage'
        ],
        guidelines: [
          'Identify and analyze specific literary devices',
          'Connect techniques to overall meaning',
          'Use precise literary terminology'
        ]
      },
      {
        id: 'literary_argument',
        name: 'Literary Argument',
        description: 'Develop an argument about literature using textual evidence',
        timeLimit: 40,
        maxPoints: 6,
        requiredFields: ['literary_prompt', 'thesis_development', 'textual_evidence'],
        optionalFields: ['work_selection', 'comparative_analysis'],
        hasMultipleParts: false,
        allowsImages: false,
        allowsDocuments: false,
        allowsGraphs: false,
        allowsCode: false,
        rubricType: 'holistic',
        examples: [
          'Argue how a character represents a universal theme',
          'Analyze how an author uses setting to develop meaning'
        ],
        guidelines: [
          'Develop a clear, defensible thesis',
          'Use specific textual evidence',
          'Demonstrate sophisticated understanding of literature'
        ]
      }
    ],
    commonFields: ['literary_analysis', 'textual_evidence', 'writing_skill'],
    examStructure: {
      totalFRQs: 3,
      totalTime: 120,
      sections: [
        { name: 'Essay Section', questions: 3, time: 120 }
      ]
    }
  }
}

// Helper functions
export function getFRQTypesForClass(className: string): FRQTypeConfig[] {
  return AP_CLASS_CONFIGS[className]?.frqTypes || []
}

export function getClassConfig(className: string): APClassConfig | null {
  return AP_CLASS_CONFIGS[className] || null
}

export function getAllAPClasses(): string[] {
  return Object.keys(AP_CLASS_CONFIGS)
}

export function getFRQTypeById(className: string, typeId: string): FRQTypeConfig | null {
  const classConfig = AP_CLASS_CONFIGS[className]
  if (!classConfig) return null
  
  return classConfig.frqTypes.find(type => type.id === typeId) || null
}
