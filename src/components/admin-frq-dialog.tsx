"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImageUploadDropzone } from '@/components/image-upload-dropzone'
import { uploadFRQImage, deleteFRQImage, extractImagePath } from '@/lib/supabase/image-upload'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SimpleFRQTypeSelector } from '@/components/simple-frq-type-selector'
import { SimpleFRQFields } from '@/components/simple-frq-fields'
import { getBaseFRQType, type BaseFRQType } from '@/lib/frq-base-types'

interface FRQPart {
  part_label: string
  part_question: string
  points: number
  hint: string
  sample_answer: string
  order_index: number
}

interface AdminFRQDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFRQAdded?: () => void
  initialSubject?: string
  initialUnit?: string
}

const apClasses = [
  'AP Calculus AB',
  'AP Calculus BC', 
  'AP Precalculus',
  'AP Computer Science A',
  'AP Statistics',
  'AP World History',
  'AP US History',
  'AP European History',
  'AP US Government',
  'AP Comparative Government',
  'AP Human Geography',
  'AP Psychology',
  'AP Microeconomics',
  'AP Macroeconomics',
  'AP Chemistry',
  'AP Biology',
  'AP Environmental Science',
  'AP Physics 1',
  'AP Physics 2',
  'AP Physics C: Mechanics',
  'AP Physics C: Electricity and Magnetism',
  'AP English Language and Composition',
  'AP English Literature and Composition',
  'AP Art History'
]

// Map of class value to units (for the Unit filter dropdown)
const unitsByClass: Record<string, string[]> = {
  "AP Calculus AB": [
    "Unit 1: Limits and Continuity",
    "Unit 2: Differentiation: Definition and Fundamental Properties",
    "Unit 3: Differentiation: Composite, Implicit, and Inverse Functions",
    "Unit 4: Contextual Applications of Differentiation",
    "Unit 5: Analytical Applications of Differentiation",
    "Unit 6: Integration and Accumulation of Change",
    "Unit 7: Differential Equations",
    "Unit 8: Applications of Integration"
  ],
  "AP Calculus BC": [
    "Unit 1: Limits and Continuity",
    "Unit 2: Differentiation: Definition and Fundamental Properties",
    "Unit 3: Differentiation: Composite, Implicit, and Inverse Functions",
    "Unit 4: Contextual Applications of Differentiation",
    "Unit 5: Analytical Applications of Differentiation",
    "Unit 6: Integration and Accumulation of Change",
    "Unit 7: Differential Equations",
    "Unit 8: Applications of Integration",
    "Unit 9: Parametric Equations, Polar Coordinates, and Vector-Valued Functions",
    "Unit 10: Infinite Sequences and Series"
  ],
  "AP Precalculus": [
    "Unit 1: Polynomial and Rational Functions",
    "Unit 2: Exponential and Logarithmic Functions",
    "Unit 3: Trigonometric and Polar Functions"
  ],
  "AP Statistics": [
    "Unit 1: Exploring One-Variable Data",
    "Unit 2: Exploring Two-Variable Data",
    "Unit 3: Collecting Data",
    "Unit 4: Probability, Random Variables, and Probability Distributions",
    "Unit 5: Sampling Distributions",
    "Unit 6: Inference for Categorical Data: Proportions",
    "Unit 7: Inference for Quantitative Data: Means",
    "Unit 8: Inference for Categorical Data: Chi-Square",
    "Unit 9: Inference for Quantitative Data: Slopes"
  ],
  "AP Computer Science A": [
    "Unit 1: Primitive Types",
    "Unit 2: Using Objects",
    "Unit 3: Boolean Expressions and if Statements",
    "Unit 4: Iteration",
    "Unit 5: Writing Classes",
    "Unit 6: Array",
    "Unit 7: ArrayList",
    "Unit 8: 2D Array",
    "Unit 9: Inheritance",
    "Unit 10: Recursion"
  ],
  "AP World History": [
    "Unit 1: The Global Tapestry",
    "Unit 2: Networks of Exchange",
    "Unit 3: Land-Based Empires",
    "Unit 4: Transoceanic Interconnections",
    "Unit 5: Revolutions",
    "Unit 6: Consequences of Industrialization",
    "Unit 7: Global Conflict",
    "Unit 8: Cold War and Decolonization",
    "Unit 9: Globalization"
  ],
  "AP US History": [
    "Unit 1: Period 1: 1491-1607",
    "Unit 2: Period 2: 1607-1754",
    "Unit 3: Period 3: 1754-1800",
    "Unit 4: Period 4: 1800-1848",
    "Unit 5: Period 5: 1844-1877",
    "Unit 6: Period 6: 1865-1898",
    "Unit 7: Period 7: 1890-1945",
    "Unit 8: Period 8: 1945-1980",
    "Unit 9: Period 9: 1980-Present"
  ],
  "AP Chemistry": [
    "Unit 1: Atomic Structure and Properties",
    "Unit 2: Molecular and Ionic Compound Structure and Properties",
    "Unit 3: Intermolecular Forces and Properties",
    "Unit 4: Chemical Reactions",
    "Unit 5: Kinetics",
    "Unit 6: Thermodynamics",
    "Unit 7: Equilibrium",
    "Unit 8: Acids and Bases",
    "Unit 9: Applications of Thermodynamics"
  ],
  "AP Biology": [
    "Unit 1: Chemistry of Life",
    "Unit 2: Cell Structure and Function",
    "Unit 3: Cellular Energetics",
    "Unit 4: Cell Communication and Cell Cycle",
    "Unit 5: Heredity",
    "Unit 6: Gene Expression and Regulation",
    "Unit 7: Natural Selection",
    "Unit 8: Ecology"
  ],
  "AP Physics 1": [
    "Unit 1: Kinematics",
    "Unit 2: Forces and Newton's Laws of Motion",
    "Unit 3: Work, Energy, and Power",
    "Unit 4: Systems of Particles and Linear Momentum",
    "Unit 5: Rotation",
    "Unit 6: Oscillations",
    "Unit 7: Gravitation"
  ],
  "AP Physics C: Mechanics": [
    "Unit 1: Kinematics",
    "Unit 2: Newton's Laws of Motion",
    "Unit 3: Work, Energy and Power",
    "Unit 4: Systems of Particles and Linear Momentum",
    "Unit 5: Rotation",
    "Unit 6: Oscillations",
    "Unit 7: Gravitation"
  ],
  "AP Human Geography": [
    "Unit 1: Thinking Geographically",
    "Unit 2: Population and Migration Patterns and Processes",
    "Unit 3: Cultural Patterns and Processes",
    "Unit 4: Political Patterns and Processes",
    "Unit 5: Agriculture and Rural Land-Use Patterns and Processes",
    "Unit 6: Cities and Urban Land-Use Patterns and Processes",
    "Unit 7: Industrial and Economic Development Patterns and Processes"
  ],
  "AP Environmental Science": [
    "Unit 1: The Living World: Ecosystems",
    "Unit 2: The Living World: Biodiversity",
    "Unit 3: Populations",
    "Unit 4: Earth Systems and Resources",
    "Unit 5: Land and Water Use",
    "Unit 6: Energy Resources and Consumption",
    "Unit 7: Atmospheric Pollution",
    "Unit 8: Aquatic and Terrestrial Pollution",
    "Unit 9: Global Change"
  ],
  "AP Microeconomics": [
    "Unit 1: Basic Economic Concepts",
    "Unit 2: Supply and Demand",
    "Unit 3: Production, Cost, and the Perfect Competition Model",
    "Unit 4: Imperfect Competition",
    "Unit 5: Factor Markets",
    "Unit 6: Market Failure and the Role of Government"
  ],
  "AP US Government": [
    "Unit 1: Foundations of American Democracy",
    "Unit 2: Interactions Among Branches of Government",
    "Unit 3: Civil Liberties and Civil Rights",
    "Unit 4: American Political Ideologies and Beliefs",
    "Unit 5: Political Participation"
  ],
  "AP Psychology": [
    "Unit 1: Biological Bases of Behavior",
    "Unit 2: Cognition",
    "Unit 3: Development and Learning",
    "Unit 4: Social Psychology and Personality",
    "Unit 5: Mental and Physical Health"
  ]
}

// Map of units to topics for each subject
const topicsByUnit: Record<string, Record<string, string[]>> = {
  "AP Calculus AB": {
    "Unit 1: Limits and Continuity": [
      "Introduction to Limits",
      "Estimating Limit Values",
      "Determining Limits Using Algebraic Properties",
      "Determining Limits Using Squeeze Theorem",
      "Exploring Types of Discontinuities",
      "Defining Continuity at a Point",
      "Confirming Continuity over an Interval",
      "Removing Discontinuities",
      "Connecting Infinite Limits and Vertical Asymptotes",
      "Connecting Limits at Infinity and Horizontal Asymptotes"
    ],
    "Unit 2: Differentiation: Definition and Fundamental Properties": [
      "Defining Average and Instantaneous Rates of Change",
      "Defining the Derivative of a Function",
      "Estimating Derivatives of a Function at a Point",
      "Connecting Differentiability and Continuity",
      "Applying the Power Rule",
      "Derivative Rules: Constant, Sum, and Difference",
      "Derivatives of cos x, sin x, e^x, and ln x",
      "The Product Rule",
      "The Quotient Rule"
    ],
    "Unit 3: Differentiation: Composite, Implicit, and Inverse Functions": [
      "The Chain Rule",
      "Implicit Differentiation",
      "Differentiating Inverse Functions",
      "Differentiating Inverse Trigonometric Functions",
      "Selecting Procedures for Calculating Derivatives",
      "Calculating Higher-Order Derivatives"
    ],
    "Unit 4: Contextual Applications of Differentiation": [
      "Interpreting the Meaning of the Derivative in Context",
      "Straight-Line Motion: Connecting Position, Velocity, and Acceleration",
      "Rates of Change in Applied Contexts Other Than Motion",
      "Introduction to Related Rates",
      "Solving Related Rates Problems",
      "Approximating Values of a Function Using Local Linearity and Linearization",
      "Using L'Hôpital's Rule for Determining Limits of Indeterminate Forms"
    ],
    "Unit 5: Analytical Applications of Differentiation": [
      "Using the Mean Value Theorem",
      "Extreme Value Theorem, Global Versus Local Extrema, and Critical Points",
      "Determining Intervals on Which a Function Is Increasing or Decreasing",
      "Using the First Derivative Test to Determine Relative (Local) Extrema",
      "Using the Candidates Test to Determine Absolute (Global) Extrema",
      "Determining the Concavity of Functions over Their Domains",
      "Using the Second Derivative Test to Determine Extrema",
      "Sketching Graphs of Functions and Their Derivatives",
      "Connecting a Function, Its First Derivative, and Its Second Derivative",
      "Introduction to Optimization Problems",
      "Solving Optimization Problems"
    ],
    "Unit 6: Integration and Accumulation of Change": [
      "Exploring Accumulations of Change",
      "Approximating Areas with Riemann Sums",
      "Riemann Sums, Summation Notation, and Definite Integral Notation",
      "The Fundamental Theorem of Calculus and Accumulation Functions",
      "Interpreting the Behavior of Accumulation Functions",
      "Applying Properties of Definite Integrals",
      "The Fundamental Theorem of Calculus and Definite Integrals",
      "Finding Antiderivatives and Indefinite Integrals",
      "Integrating Using Substitution",
      "Integrating Functions Using Long Division and Completing the Square"
    ],
    "Unit 7: Differential Equations": [
      "Modeling Situations with Differential Equations",
      "Verifying Solutions for Differential Equations",
      "Sketching Slope Fields",
      "Reasoning Using Slope Fields",
      "Approximating Solutions Using Euler's Method",
      "Finding General Solutions Using Separation of Variables",
      "Finding Particular Solutions Using Initial Conditions and Separation of Variables",
      "Exponential Models with Differential Equations"
    ],
    "Unit 8: Applications of Integration": [
      "Finding the Average Value of a Function on an Interval",
      "Connecting Position, Velocity, and acceleration Functions Using Integrals",
      "Using Accumulation Functions and Definite Integrals in Applied Contexts",
      "Finding Areas Between Curves Expressed as Functions of x",
      "Finding Areas Between Curves Expressed as Functions of y",
      "Introduction to Volume with Cross-Sections",
      "Volume with Cross-Sections: Squares and Rectangles",
      "Volume with Cross-Sections: Triangles and Semicircles",
      "Volume with Disc Method: Revolving Around the x- or y-Axis",
      "Volume with Disc Method: Revolving Around Other Axes",
      "Volume with Washer Method: Revolving Around the x- or y-Axis",
      "Volume with Washer Method: Revolving Around Other Axes"
    ]
  },
  "AP Statistics": {
    "Unit 1: Exploring One-Variable Data": [
      "Introduction to Data",
      "Classifying Data",
      "Representing a Categorical Variable with Tables",
      "Representing a Categorical Variable with Graphs",
      "Representing a Quantitative Variable with Graphs",
      "Describing the Distribution of a Quantitative Variable",
      "Summary Statistics for a Quantitative Variable",
      "Graphical Representations of Summary Statistics",
      "Comparing Distributions of a Quantitative Variable",
      "The Normal Distribution",
      "The Empirical Rule (68-95-99.7 Rule)",
      "Standardizing with z-scores"
    ],
    "Unit 2: Exploring Two-Variable Data": [
      "Introduction to Relationships Between Two Categorical Variables",
      "Relationships Between Two Categorical Variables",
      "Introduction to Relationships Between Two Quantitative Variables",
      "Correlation",
      "Introduction to Trend in Data",
      "Fitting a Line to Data",
      "Residuals",
      "The Least Squares Regression Line"
    ],
    "Unit 3: Collecting Data": [
      "Introduction to Planning a Study",
      "Sampling and Surveys",
      "Sampling Methods",
      "Potential Problems with Sampling",
      "Introduction to Experimental Design",
      "Experiments",
      "Experimental Design"
    ],
    "Unit 4: Probability, Random Variables, and Probability Distributions": [
      "Introduction to Probability",
      "Probability with Two-Way Tables and Venn Diagrams",
      "The Multiplication Rule for Independent Events",
      "The Multiplication Rule for Dependent Events",
      "Conditional Probability",
      "Independence versus Dependence",
      "The Addition Rule",
      "Introduction to Random Variables and Probability Distributions",
      "Probability Distributions for Discrete Random Variables",
      "Expected Value (Mean) of a Discrete Random Variable",
      "Variance and Standard Deviation of a Discrete Random Variable",
      "Probability Distributions for Continuous Random Variables",
      "Normal Distributions and the Empirical Rule",
      "The Standard Normal Distribution"
    ],
    "Unit 5: Sampling Distributions": [
      "Introduction to Sampling Distributions",
      "Sampling Distribution of a Sample Proportion",
      "Sampling Distribution of a Sample Mean",
      "The Central Limit Theorem"
    ]
  },
  "AP Computer Science A": {
    "Unit 1: Primitive Types": [
      "Variables and Data Types",
      "Expressions and Assignment Statements",
      "Compound Assignment Operators",
      "Casting and Ranges of Variables"
    ],
    "Unit 2: Using Objects": [
      "Objects - Instances of Classes",
      "Creating and Storing Objects (Instantiation)",
      "Calling a Void Method",
      "Calling a Void Method with Parameters",
      "Calling a Non-void Method",
      "String Objects: Concatenation, Literals, and More",
      "String Methods",
      "Wrapper Classes: Integer and Double",
      "Using the Math Class"
    ],
    "Unit 3: Boolean Expressions and if Statements": [
      "Boolean Expressions",
      "if Statements and Control Flow",
      "if-else Statements",
      "else if Statements",
      "Compound Boolean Expressions",
      "Equivalent Boolean Expressions",
      "Comparing Objects"
    ],
    "Unit 4: Iteration": [
      "while Loops",
      "for Loops",
      "Developing Algorithms Using Strings",
      "Nested Iteration",
      "Informal Code Analysis"
    ],
    "Unit 5: Writing Classes": [
      "Anatomy of a Class",
      "Constructors",
      "Documentation with Comments",
      "Accessor Methods",
      "Mutator Methods",
      "Writing Methods",
      "Static Variables and Methods",
      "Scope and Access",
      "this Keyword"
    ],
    "Unit 6: Array": [
      "Introduction to Arrays",
      "Traversing Arrays",
      "Enhanced for Loop for Arrays",
      "Developing Algorithms Using Arrays",
      "Searching",
      "Sorting"
    ],
    "Unit 7: ArrayList": [
      "Introduction to ArrayList",
      "ArrayList Methods",
      "Traversing ArrayLists",
      "Developing Algorithms Using ArrayLists",
      "Searching and Sorting"
    ],
    "Unit 8: 2D Array": [
      "2D Arrays",
      "Traversing 2D Arrays",
      "Algorithms 2D Array Algorithms"
    ],
    "Unit 9: Inheritance": [
      "Creating Superclasses and Subclasses",
      "Writing Constructors for Subclasses",
      "Overriding Methods",
      "super Keyword",
      "Creating References Using Inheritance Hierarchies",
      "Polymorphism",
      "Object Superclass"
    ],
    "Unit 10: Recursion": [
      "Recursion",
      "Recursive Searching and Sorting"
    ]
  },
  "AP Chemistry": {
    "Unit 1: Atomic Structure and Properties": [
      "Moles and Molar Mass",
      "Mass Spectroscopy of Elements",
      "Elemental Composition of Pure Substances",
      "Composition of Mixtures",
      "Atomic Structure and Electron Configuration",
      "Photoelectron Spectroscopy",
      "Periodic Trends",
      "Valence Electrons and Ionic Compounds"
    ],
    "Unit 2: Molecular and Ionic Compound Structure and Properties": [
      "Types of Chemical Bonds",
      "Intramolecular Force and Potential Energy",
      "Structure of Ionic Solids",
      "Structure of Metals and Alloys",
      "Lewis Diagrams",
      "Resonance and Formal Charge",
      "VSEPR and Bond Hybridization"
    ],
    "Unit 3: Intermolecular Forces and Properties": [
      "Intermolecular Forces",
      "Properties of Solids",
      "Solids, Liquids, and Gases",
      "Ideal Gas Law",
      "Kinetic Molecular Theory",
      "Deviation from Ideal Gas Law",
      "Solutions and Mixtures",
      "Representations of Solutions",
      "Separation of Solutions and Mixtures Chromatography"
    ]
  },
  "AP Biology": {
    "Unit 1: Chemistry of Life": [
      "Structure of Water and Hydrogen Bonding",
      "Elements of Life",
      "Introduction to Biological Macromolecules",
      "Properties of Biological Macromolecules",
      "Structure and Function of Biological Macromolecules",
      "Nucleic Acids"
    ],
    "Unit 2: Cell Structure and Function": [
      "Cell Structures and Organelles",
      "Cell Size and Scale",
      "Compartmentalization",
      "Cell Membrane Structure",
      "Membrane Permeability",
      "Membrane Transport",
      "Facilitated Diffusion",
      "Tonicity and Osmoregulation",
      "Mechanisms of Transport",
      "Cell Compartmentalization"
    ]
  },
  "AP World History": {
    "Unit 1: The Global Tapestry": [
      "Developments in East Asia",
      "Developments in Dar al-Islam",
      "Developments in South and Southeast Asia",
      "State Building in the Americas",
      "Developments in Africa",
      "Developments in Europe"
    ],
    "Unit 2: Networks of Exchange": [
      "The Silk Roads",
      "The Mongol Empire and the Making of the Modern World",
      "Exchange in the Indian Ocean",
      "Trans-Saharan Trade Routes",
      "Cultural Consequences of Connectivity"
    ]
  },
  "AP US History": {
    "Unit 1: Period 1: 1491-1607": [
      "Contextualizing Period 1",
      "Native American Societies Before European Contact",
      "European Exploration in the Americas",
      "Columbian Exchange, Spanish Exploration, and Conquest",
      "Labor, Slavery, and Caste in the Spanish Colonial System",
      "Cultural Interactions Between Europeans, Native Americans, and Africans"
    ],
    "Unit 2: Period 2: 1607-1754": [
      "Contextualizing Period 2",
      "European Colonization",
      "The Regions of British Colonies",
      "Transatlantic Trade",
      "Interactions Between American Indians and Europeans",
      "Slavery in the British Colonies",
      "Colonial Society and Culture"
    ]
  },
  "AP Psychology": [
    "Unit 1: Scientific Foundations of Psychology",
    "Unit 2: Biological Bases of Behavior", 
    "Unit 3: Sensation and Perception",
    "Unit 4: Learning",
    "Unit 5: Cognitive Psychology",
    "Unit 6: Developmental Psychology",
    "Unit 7: Motivation, Emotion, and Personality",
    "Unit 8: Abnormal Psychology",
    "Unit 9: Treatment of Abnormal Behavior"
  ],
  "AP Human Geography": [
    "Unit 1: Thinking Geographically",
    "Unit 2: Population and Migration Patterns",
    "Unit 3: Cultural Patterns and Processes",
    "Unit 4: Political Patterns and Processes", 
    "Unit 5: Agriculture and Rural Land-Use",
    "Unit 6: Cities and Urban Land-Use",
    "Unit 7: Industrial and Economic Development"
  ],
  "AP Microeconomics": [
    "Unit 1: Basic Economic Concepts",
    "Unit 2: Supply and Demand",
    "Unit 3: Production, Cost, and Perfect Competition",
    "Unit 4: Imperfect Competition",
    "Unit 5: Factor Markets",
    "Unit 6: Market Failure and Government Intervention"
  ],
  "AP Macroeconomics": [
    "Unit 1: Basic Economic Concepts",
    "Unit 2: Economic Indicators and the Business Cycle",
    "Unit 3: National Income and Price Determination",
    "Unit 4: Financial Sector",
    "Unit 5: Long-Run Consequences of Stabilization Policies",
    "Unit 6: Open Economy-International Trade and Finance"
  ],
  "AP US Government": [
    "Unit 1: Foundations of American Democracy",
    "Unit 2: Interactions Among Branches of Government",
    "Unit 3: Civil Liberties and Civil Rights",
    "Unit 4: American Political Ideologies and Beliefs",
    "Unit 5: Political Participation"
  ],
  "AP Comparative Government": [
    "Unit 1: Political Systems, Regimes, and Governments",
    "Unit 2: Political Institutions",
    "Unit 3: Political Culture and Participation",
    "Unit 4: Party Systems and Electoral Processes",
    "Unit 5: Political and Economic Changes and Development"
  ],
  "AP Art History": [
    "Unit 1: Global Prehistoric and Ancient Art",
    "Unit 2: Ancient Mediterranean Art",
    "Unit 3: Early European and Colonial American Art",
    "Unit 4: Later European and American Art",
    "Unit 5: Indigenous American Art",
    "Unit 6: African Art",
    "Unit 7: West and Central Asian Art",
    "Unit 8: South, East, and Southeast Asian Art",
    "Unit 9: Pacific Art",
    "Unit 10: Global Contemporary Art"
  ],
  "AP Environmental Science": [
    "Unit 1: The Living World: Ecosystems",
    "Unit 2: The Living World: Biodiversity",
    "Unit 3: Populations",
    "Unit 4: Earth Systems and Resources",
    "Unit 5: Land and Water Use",
    "Unit 6: Energy Resources and Consumption",
    "Unit 7: Atmospheric Pollution",
    "Unit 8: Aquatic and Terrestrial Pollution",
    "Unit 9: Global Change"
  ],
  "AP Precalculus": [
    "Unit 1: Polynomial and Rational Functions",
    "Unit 2: Exponential and Logarithmic Functions",
    "Unit 3: Trigonometric and Polar Functions",
    "Unit 4: Functions Involving Parameters, Vectors, and Matrices"
  ],
  "AP Physics 2": [
    "Unit 1: Fluids",
    "Unit 2: Thermodynamics",
    "Unit 3: Electric Force, Field, and Potential",
    "Unit 4: Electric Circuits",
    "Unit 5: Magnetism and Electromagnetic Induction",
    "Unit 6: Geometric and Physical Optics",
    "Unit 7: Quantum, Atomic, and Nuclear Physics"
  ],
  "AP Physics C: Electricity and Magnetism": [
    "Unit 1: Electrostatics",
    "Unit 2: Conductors, Capacitors, Dielectrics",
    "Unit 3: Electric Circuits",
    "Unit 4: Magnetic Fields",
    "Unit 5: Electromagnetic Induction"
  ],
  "AP English Language and Composition": [
    "Unit 1: Claims and Evidence",
    "Unit 2: Reasoning and Organization",
    "Unit 3: Style",
    "Unit 4: Perspective",
    "Unit 5: Context",
    "Unit 6: Sophistication",
    "Unit 7: Developing a Complex Argument",
    "Unit 8: Synthesis",
    "Unit 9: Rhetorical Analysis"
  ],
  "AP English Literature and Composition": [
    "Unit 1: Short Fiction I",
    "Unit 2: Poetry I", 
    "Unit 3: Longer Fiction or Drama I",
    "Unit 4: Short Fiction II",
    "Unit 5: Poetry II",
    "Unit 6: Longer Fiction or Drama II",
    "Unit 7: Short Fiction III",
    "Unit 8: Poetry III",
    "Unit 9: Longer Fiction or Drama III"
  ],
  "AP European History": [
    "Unit 1: Renaissance and Exploration",
    "Unit 2: Age of Reformation",
    "Unit 3: Absolutism and Constitutionalism",
    "Unit 4: Scientific, Philosophical, and Political Developments",
    "Unit 5: Conflict, Crisis, and Reaction in the Late 18th Century",
    "Unit 6: Industrialization and Its Effects",
    "Unit 7: 19th-Century Perspectives and Political Developments",
    "Unit 8: 20th-Century Global Conflicts",
    "Unit 9: Cold War and Contemporary Europe"
  ]
}

const difficultyOptions = ['Easy', 'Medium', 'Hard']

export function AdminFRQDialog({ open, onOpenChange, onFRQAdded, initialSubject, initialUnit }: AdminFRQDialogProps) {
  const [formData, setFormData] = useState({
    subject: '',
    unit: '',
    question: '',
    difficulty: 'Medium',
    time_limit: 25,
    exam_type: 'Practice',
    year: new Date().getFullYear(),
    sample_response: '',
    stimulus_image_url: '',
    stimulus_image_description: '',
    stimulus_image_2_url: '',
    stimulus_image_2_description: '',
    frq_type: '',
    frq_specific_data: {},
    max_points: 0
  })

  const [parts, setParts] = useState<FRQPart[]>([
    {
      part_label: 'a',
      part_question: '',
      points: 1,
      hint: '',
      sample_answer: '',
      order_index: 1
    }
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFRQType, setSelectedFRQType] = useState<BaseFRQType | null>(null)

  // FRQ Type handlers
  const handleFRQTypeSelect = (frqType: BaseFRQType) => {
    setSelectedFRQType(frqType)
    setFormData(prev => ({
      ...prev,
      frq_type: frqType.id,
      max_points: frqType.defaultMaxPoints,
      time_limit: frqType.defaultTimeLimit
    }))

    // Reset parts based on FRQ type requirements
    if (frqType.hasMultipleParts) {
      // Keep existing parts or create default structure
      if (parts.length === 0) {
        setParts([
          {
            part_label: 'a',
            part_question: '',
            points: 1,
            hint: '',
            sample_answer: '',
            order_index: 1
          }
        ])
      }
    } else {
      // Single part FRQ - ensure only one part
      setParts([
        {
          part_label: '1',
          part_question: '',
          points: frqType.defaultMaxPoints,
          hint: '',
          sample_answer: '',
          order_index: 1
        }
      ])
    }
  }

  const handleFRQDataChange = (data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }))
  }

  // Image upload handlers
  const handleImageUpload = async (file: File, imageType: 'primary' | 'secondary'): Promise<string> => {
    try {
      const result = await uploadFRQImage(file)
      
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Update form data with the new image URL
      setFormData(prev => ({
        ...prev,
        [imageType === 'primary' ? 'stimulus_image_url' : 'stimulus_image_2_url']: result.url
      }))
      
      return result.url
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }

  const handleImageRemove = async (imageType: 'primary' | 'secondary') => {
    const imageUrl = imageType === 'primary' 
      ? formData.stimulus_image_url 
      : formData.stimulus_image_2_url
    
    if (imageUrl) {
      // Extract path and delete from storage
      const imagePath = extractImagePath(imageUrl)
      if (imagePath) {
        await deleteFRQImage(imagePath)
      }
      
      // Clear from form data
      setFormData(prev => ({
        ...prev,
        [imageType === 'primary' ? 'stimulus_image_url' : 'stimulus_image_2_url']: '',
        [imageType === 'primary' ? 'stimulus_image_description' : 'stimulus_image_2_description']: ''
      }))
    }
  }

  // Reset form when dialog opens and set initial values
  useEffect(() => {
    if (open) {
      setFormData({
        subject: initialSubject || '',
        unit: initialUnit || '',
        question: '',
        difficulty: 'Medium',
        time_limit: 25,
        exam_type: 'Practice',
        year: new Date().getFullYear(),
        sample_response: '',
        stimulus_image_url: '',
        stimulus_image_description: '',
        stimulus_image_2_url: '',
        stimulus_image_2_description: '',
        frq_type: '',
        frq_specific_data: {},
        max_points: 0
      })
      setSelectedFRQType(null)
      setParts([
        {
          part_label: 'a',
          part_question: '',
          points: 1,
          hint: '',
          sample_answer: '',
          order_index: 1
        }
      ])
      setError(null)
    }
  }, [open, initialSubject, initialUnit])

  const addPart = () => {
    const nextLabel = String.fromCharCode(97 + parts.length) // 'a', 'b', 'c', etc.
    setParts(prev => [...prev, {
      part_label: nextLabel,
      part_question: '',
      points: 1,
      hint: '',
      sample_answer: '',
      order_index: prev.length + 1
    }])
  }

  const removePart = (index: number) => {
    if (parts.length > 1) {
      setParts(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updatePart = (index: number, field: keyof FRQPart, value: string | number) => {
    setParts(prev => prev.map((part, i) => 
      i === index ? { ...part, [field]: value } : part
    ))
  }

  const getTotalPoints = () => {
    return parts.reduce((sum, part) => sum + part.points, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.subject || !formData.unit || !formData.question || !formData.frq_type) {
        throw new Error('Please fill in all required fields including FRQ type')
      }

      if (parts.some(part => !part.part_question)) {
        throw new Error('Please fill in all part questions')
      }

      // Submit to API
      const response = await fetch('/api/admin/frq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          topic: formData.unit, // Use unit as topic for now
          parts: parts.map((part, index) => ({
            ...part,
            order_index: index + 1
          }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create FRQ')
      }

      // Success
      onFRQAdded?.()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New FRQ Question
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* FRQ Type Selection */}
          <SimpleFRQTypeSelector
            selectedClass={formData.subject}
            selectedFRQType={formData.frq_type}
            onFRQTypeSelect={handleFRQTypeSelect}
          />

          {/* FRQ-Specific Configuration */}
          {selectedFRQType && (
            <SimpleFRQFields
              frqType={selectedFRQType}
              formData={formData}
              onFormDataChange={handleFRQDataChange}
            />
          )}

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value, unit: '' }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {apClasses.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unit">Unit *</Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.subject && unitsByClass[formData.subject] ? (
                        unitsByClass[formData.subject].map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">Select a subject first</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>



                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map(diff => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                  <Input
                    id="time_limit"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.time_limit}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_limit: parseInt(e.target.value) || 25 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2000"
                    max="2030"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="question">Main Question *</Label>
                <Textarea
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter the main FRQ question text..."
                  rows={4}
                  required
                />
              </div>

              {/* Stimulus Images Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                  <Label className="text-base font-medium">Stimulus Images (Optional)</Label>
                </div>
                
                {/* Primary Stimulus Image */}
                <Card className="border-dashed border-2 border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-700">Primary Stimulus Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ImageUploadDropzone
                      onImageUpload={(file) => handleImageUpload(file, 'primary')}
                      currentImageUrl={formData.stimulus_image_url}
                      onImageRemove={() => handleImageRemove('primary')}
                      placeholder="Drag & drop primary stimulus image here"
                      disabled={isSubmitting}
                    />
                    {formData.stimulus_image_url && (
                      <div>
                        <Label htmlFor="stimulus_image_description">Image Description (for accessibility)</Label>
                        <Input
                          id="stimulus_image_description"
                          value={formData.stimulus_image_description}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            stimulus_image_description: e.target.value 
                          }))}
                          placeholder="Describe the image content..."
                          className="mt-1"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Secondary Stimulus Image */}
                <Card className="border-dashed border-2 border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-700">Secondary Stimulus Image (Optional)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ImageUploadDropzone
                      onImageUpload={(file) => handleImageUpload(file, 'secondary')}
                      currentImageUrl={formData.stimulus_image_2_url}
                      onImageRemove={() => handleImageRemove('secondary')}
                      placeholder="Drag & drop secondary stimulus image here"
                      disabled={isSubmitting}
                    />
                    {formData.stimulus_image_2_url && (
                      <div>
                        <Label htmlFor="stimulus_image_2_description">Image Description (for accessibility)</Label>
                        <Input
                          id="stimulus_image_2_description"
                          value={formData.stimulus_image_2_description}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            stimulus_image_2_description: e.target.value 
                          }))}
                          placeholder="Describe the image content..."
                          className="mt-1"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label htmlFor="sample_response">Sample Response (Optional)</Label>
                <Textarea
                  id="sample_response"
                  value={formData.sample_response}
                  onChange={(e) => setFormData(prev => ({ ...prev, sample_response: e.target.value }))}
                  placeholder="Enter a sample complete response to this FRQ..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Question Parts */}
          {selectedFRQType?.hasMultipleParts && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Question Parts
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Total: {getTotalPoints()} points
                  </Badge>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPart}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Part
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parts.map((part, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center justify-between">
                      Part ({part.part_label})
                      {parts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePart(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Part Question *</Label>
                      <Textarea
                        value={part.part_question}
                        onChange={(e) => updatePart(index, 'part_question', e.target.value)}
                        placeholder={`Enter the question for part ${part.part_label}...`}
                        rows={2}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Points</Label>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={part.points}
                          onChange={(e) => updatePart(index, 'points', parseInt(e.target.value) || 1)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Hint (Optional)</Label>
                      <Textarea
                        value={part.hint}
                        onChange={(e) => updatePart(index, 'hint', e.target.value)}
                        placeholder={`Enter a hint for part ${part.part_label}...`}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>Sample Answer (Optional)</Label>
                      <Textarea
                        value={part.sample_answer}
                        onChange={(e) => updatePart(index, 'sample_answer', e.target.value)}
                        placeholder={`Enter a sample answer for part ${part.part_label}...`}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create FRQ'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
