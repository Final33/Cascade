export interface CourseUnit {
  id: string
  label: string
}

export interface CourseConfig {
  id: string
  name: string
  units: CourseUnit[]
}

export const courseConfigs: Record<string, CourseConfig> = {
  "calc-ab": {
    id: "calc-ab",
    name: "AP Calculus",
    units: [
      { id: "limits", label: "Limits and Continuity" },
      { id: "derivatives", label: "Differentiation: Definition and Fundamental Properties" },
      { id: "derivatives-apps", label: "Differentiation: Composite, Implicit, and Inverse Functions" },
      { id: "apps-derivatives", label: "Applications of Differentiation" },
      { id: "integration", label: "Integration and Accumulation of Change" },
      { id: "differential-equations", label: "Differential Equations" },
      { id: "apps-integration", label: "Applications of Integration" },
    ],
  },
  "cs-a": {
    id: "cs-a",
    name: "AP CS A",
    units: [
      { id: "primitive-types", label: "Primitive Types" },
      { id: "objects", label: "Using Objects" },
      { id: "boolean", label: "Boolean Expressions and if Statements" },
      { id: "iteration", label: "Iteration" },
      { id: "writing-classes", label: "Writing Classes" },
      { id: "arrays", label: "Array" },
      { id: "array-lists", label: "ArrayList" },
      { id: "2d-arrays", label: "2D Array" },
      { id: "inheritance", label: "Inheritance" },
      { id: "recursion", label: "Recursion" },
    ],
  },
  "statistics": {
    id: "statistics",
    name: "AP Statistics",
    units: [
      { id: "exploring-data", label: "Exploring One-Variable Data" },
      { id: "modeling-dist", label: "Modeling Distributions of Data" },
      { id: "describing-relationships", label: "Describing Relationships" },
      { id: "sampling-experimentation", label: "Sampling and Experimentation" },
      { id: "probability", label: "Probability" },
      { id: "random-variables", label: "Random Variables" },
      { id: "sampling-dist", label: "Sampling Distributions" },
      { id: "confidence-intervals", label: "Confidence Intervals" },
      { id: "hypothesis-testing", label: "Hypothesis Testing" },
    ],
  },
  "world-history": {
    id: "world-history",
    name: "AP World History",
    units: [
      { id: "ancient", label: "The Ancient Period (to c. 600 BCE)" },
      { id: "classical", label: "The Classical Period (c. 600 BCE to c. 600 CE)" },
      { id: "post-classical", label: "The Post-Classical Period (c. 600 CE to c. 1450)" },
      { id: "early-modern", label: "The Early Modern Period (c. 1450 to c. 1750)" },
      { id: "modern", label: "The Modern Period (c. 1750 to c. 1900)" },
      { id: "contemporary", label: "The Contemporary Period (c. 1900 to Present)" },
    ],
  },
  "cs-principles": {
    id: "cs-principles",
    name: "AP CS Principles",
    units: [
      { id: "computing-systems", label: "Computing Systems and Networks" },
      { id: "programming", label: "Programming" },
      { id: "algorithms", label: "Algorithms and Programming" },
      { id: "data", label: "Data" },
      { id: "impact", label: "Impact of Computing" },
    ],
  }
} as const

export type CourseId = keyof typeof courseConfigs 