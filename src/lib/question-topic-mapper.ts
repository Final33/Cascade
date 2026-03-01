import { CourseId, courseConfigs } from './course-config'

// Topic keywords mapped to courses and units
const topicKeywords: Record<CourseId, Record<string, string[]>> = {
  "calc-ab": {
    "limits": ["limit", "limits", "continuity", "continuous", "discontinuous", "asymptote", "infinity", "approach"],
    "derivatives": ["derivative", "derivatives", "differentiation", "slope", "tangent", "rate of change", "power rule", "product rule", "quotient rule"],
    "derivatives-apps": ["implicit differentiation", "related rates", "chain rule", "composite function", "inverse function"],
    "apps-derivatives": ["optimization", "maximum", "minimum", "critical point", "inflection", "concave", "mean value theorem", "curve sketching"],
    "integration": ["integral", "integration", "antiderivative", "area under curve", "fundamental theorem", "u-substitution"],
    "differential-equations": ["differential equation", "separable", "slope field", "exponential growth", "decay"],
    "apps-integration": ["area between curves", "volume", "revolution", "accumulation", "average value"]
  },
  "cs-a": {
    "primitive-types": ["int", "double", "boolean", "char", "variable", "operator", "primitive", "data type"],
    "objects": ["object", "class", "method", "instance", "constructor", "encapsulation", "public", "private"],
    "boolean": ["boolean", "if", "else", "condition", "logical operator", "and", "or", "not"],
    "iteration": ["loop", "for", "while", "iteration", "nested loop", "break", "continue"],
    "writing-classes": ["class design", "constructor", "method", "encapsulation", "getter", "setter", "this"],
    "arrays": ["array", "index", "length", "traversal", "element", "one dimensional"],
    "array-lists": ["arraylist", "list", "add", "remove", "get", "set", "size"],
    "2d-arrays": ["2d array", "two dimensional", "matrix", "row", "column", "nested array"],
    "inheritance": ["inheritance", "extends", "super", "polymorphism", "override", "abstract"],
    "recursion": ["recursion", "recursive", "base case", "recursive call", "stack"]
  },
  "statistics": {
    "exploring-data": ["data", "distribution", "histogram", "boxplot", "outlier", "quartile", "median", "mean"],
    "modeling-dist": ["normal distribution", "standard deviation", "z-score", "bell curve", "gaussian"],
    "describing-relationships": ["correlation", "regression", "scatterplot", "linear relationship", "r-value"],
    "sampling-experimentation": ["sample", "population", "bias", "experiment", "survey", "random"],
    "probability": ["probability", "event", "outcome", "conditional", "independence", "tree diagram"],
    "random-variables": ["random variable", "expected value", "variance", "binomial", "geometric"],
    "sampling-dist": ["sampling distribution", "central limit theorem", "standard error"],
    "confidence-intervals": ["confidence interval", "margin of error", "confidence level", "estimate"],
    "hypothesis-testing": ["hypothesis test", "null hypothesis", "alternative", "p-value", "significance"]
  },
  "world-history": {
    "ancient": ["ancient", "mesopotamia", "egypt", "indus valley", "china", "greece", "rome", "prehistory"],
    "classical": ["classical", "han dynasty", "roman empire", "gupta", "byzantine", "silk road"],
    "post-classical": ["medieval", "islam", "crusades", "mongol", "renaissance", "feudalism"],
    "early-modern": ["exploration", "colonization", "reformation", "enlightenment", "revolution"],
    "modern": ["industrial revolution", "nationalism", "imperialism", "world war", "cold war"],
    "contemporary": ["globalization", "decolonization", "technology", "modern conflicts"]
  },
  "cs-principles": {
    "computing-systems": ["computer", "network", "internet", "protocol", "hardware", "software"],
    "programming": ["programming", "code", "algorithm", "function", "variable", "syntax"],
    "algorithms": ["algorithm", "efficiency", "sorting", "searching", "complexity"],
    "data": ["data", "database", "information", "storage", "processing"],
    "impact": ["ethics", "privacy", "security", "society", "digital divide"]
  }
}

// Subject-specific keywords for course detection
const courseKeywords: Record<CourseId, string[]> = {
  "calc-ab": ["calculus", "calc", "derivative", "integral", "limit", "function", "graph", "ap calculus", "ap calc"],
  "cs-a": ["java", "programming", "code", "object", "class", "array", "method", "ap computer science a", "ap cs a", "computer science a"],
  "statistics": ["statistics", "stats", "data", "probability", "distribution", "sample", "ap statistics", "ap stats"],
  "world-history": ["history", "historical", "civilization", "empire", "war", "culture", "ap world history", "ap world", "world history"],
  "cs-principles": ["computer science principles", "cs principles", "computing", "technology", "digital", "algorithm", "ap computer science principles", "ap cs principles"]
}

// Math-specific keywords that could apply to calculus or statistics
const mathKeywords = [
  "equation", "solve", "graph", "function", "variable", "linear", "quadratic", 
  "polynomial", "exponential", "logarithm", "trigonometry", "geometry"
]

export interface TopicAnalysis {
  detectedCourse: CourseId | null
  detectedUnits: string[]
  confidence: number
  suggestedDifficulty: "beginner" | "intermediate" | "advanced" | "ap-level"
  fallbackOptions: Array<{
    course: CourseId
    units: string[]
    confidence: number
  }>
}

export class QuestionTopicMapper {
  /**
   * Analyzes a topic string and maps it to course and units
   */
  static analyzeTopicString(topic: string): TopicAnalysis {
    const normalizedTopic = topic.toLowerCase().trim()
    // Legacy topic analysis - now replaced by AI-based detection
    
    // Score each course based on keyword matches
    const courseScores: Record<CourseId, number> = {
      "calc-ab": 0,
      "cs-a": 0,
      "statistics": 0,
      "world-history": 0,
      "cs-principles": 0
    }

    // Check for direct course mentions
    Object.entries(courseKeywords).forEach(([courseId, keywords]) => {
      keywords.forEach(keyword => {
        if (normalizedTopic.includes(keyword)) {
          // Course keyword match detected
          courseScores[courseId as CourseId] += 3 // High weight for direct course mentions
        }
      })
    })

    // Check for unit-specific keywords
    const unitMatches: Record<CourseId, string[]> = {
      "calc-ab": [],
      "cs-a": [],
      "statistics": [],
      "world-history": [],
      "cs-principles": []
    }

    Object.entries(topicKeywords).forEach(([courseId, units]) => {
      Object.entries(units).forEach(([unitId, keywords]) => {
        const matchCount = keywords.filter(keyword => 
          normalizedTopic.includes(keyword)
        ).length
        
        if (matchCount > 0) {
          // Unit keyword matches detected
          courseScores[courseId as CourseId] += matchCount * 2
          unitMatches[courseId as CourseId].push(unitId)
        }
      })
    })

    // Handle math keywords (could be calc or stats)
    const mathKeywordMatches = mathKeywords.filter(keyword => 
      normalizedTopic.includes(keyword)
    ).length

    if (mathKeywordMatches > 0) {
      // Math keyword processing (legacy approach)
      if (courseScores["calc-ab"] > 0) {
        courseScores["calc-ab"] += mathKeywordMatches
      } else if (courseScores["statistics"] > 0) {
        courseScores["statistics"] += mathKeywordMatches
      } else {
        // Default to calculus for general math terms
        courseScores["calc-ab"] += mathKeywordMatches * 0.5
        unitMatches["calc-ab"].push("derivatives") // Default to derivatives for general math
      }
    }

    // Find the best course match (legacy approach)
    const sortedCourses = Object.entries(courseScores)
      .sort(([,a], [,b]) => b - a)
      .filter(([,score]) => score > 0)

    if (sortedCourses.length === 0) {
      // No matches found - default to calculus with basic units
      return {
        detectedCourse: "calc-ab",
        detectedUnits: ["derivatives"],
        confidence: 0.1,
        suggestedDifficulty: "intermediate",
        fallbackOptions: []
      }
    }

    const [bestCourse, bestScore] = sortedCourses[0]
    const detectedCourse = bestCourse as CourseId
    const detectedUnits = unitMatches[detectedCourse]

    // If no specific units detected, use default units for the course
    if (detectedUnits.length === 0) {
      detectedUnits.push(this.getDefaultUnit(detectedCourse))
    }

    // Calculate confidence (0-1 scale)
    const maxPossibleScore = 10 // Rough estimate
    const confidence = Math.min(bestScore / maxPossibleScore, 1)

    // Determine difficulty based on keywords
    const suggestedDifficulty = this.determineDifficulty(normalizedTopic)

    // Create fallback options
    const fallbackOptions = sortedCourses.slice(1, 3).map(([course, score]) => ({
      course: course as CourseId,
      units: unitMatches[course as CourseId].length > 0 
        ? unitMatches[course as CourseId] 
        : [this.getDefaultUnit(course as CourseId)],
      confidence: Math.min(score / maxPossibleScore, 1)
    }))

    return {
      detectedCourse,
      detectedUnits,
      confidence,
      suggestedDifficulty,
      fallbackOptions
    }
  }

  /**
   * Gets a default unit for a course when no specific units are detected
   */
  private static getDefaultUnit(courseId: CourseId): string {
    const defaultUnits: Record<CourseId, string> = {
      "calc-ab": "derivatives",
      "cs-a": "objects",
      "statistics": "exploring-data",
      "world-history": "modern",
      "cs-principles": "programming"
    }
    return defaultUnits[courseId]
  }

  /**
   * Determines difficulty level based on keywords in the topic
   */
  private static determineDifficulty(topic: string): "beginner" | "intermediate" | "advanced" | "ap-level" {
    const beginnerKeywords = ["basic", "simple", "introduction", "beginner", "easy"]
    const advancedKeywords = ["advanced", "complex", "difficult", "challenging", "ap", "college"]
    const apKeywords = ["ap", "college board", "exam", "frq", "multiple choice"]

    if (apKeywords.some(keyword => topic.includes(keyword))) {
      return "ap-level"
    }
    
    if (advancedKeywords.some(keyword => topic.includes(keyword))) {
      return "advanced"
    }
    
    if (beginnerKeywords.some(keyword => topic.includes(keyword))) {
      return "beginner"
    }
    
    return "intermediate" // Default
  }

  /**
   * Validates that the detected course and units are valid
   */
  static validateMapping(courseId: CourseId, units: string[]): boolean {
    const courseConfig = courseConfigs[courseId]
    if (!courseConfig) return false

    const validUnits = courseConfig.units.map(unit => unit.id)
    return units.every(unit => validUnits.includes(unit))
  }

  /**
   * Gets a human-readable description of the detected mapping
   */
  static getAnalysisDescription(analysis: TopicAnalysis): string {
    if (!analysis.detectedCourse) {
      return "Could not determine course from topic"
    }

    const courseName = courseConfigs[analysis.detectedCourse]?.name || analysis.detectedCourse
    const unitNames = analysis.detectedUnits
      .map(unitId => {
        const unit = courseConfigs[analysis.detectedCourse!]?.units.find(u => u.id === unitId)
        return unit?.label || unitId
      })
      .join(", ")

    const confidencePercent = Math.round(analysis.confidence * 100)
    
    return `Detected: ${courseName} - ${unitNames} (${confidencePercent}% confidence)`
  }
}
