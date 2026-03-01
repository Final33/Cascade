import { PastFRQ } from "@/types/frq"

export const calcBcFRQs: PastFRQ[] = [
  {
    id: "calc-bc-2024-1",
    course: "calc-bc",
    year: 2024,
    questionNumber: 1,
    title: "Series and Sequences",
    content: `Consider the series Σ(n=1 to ∞) (2n-1)/(3^n).

(a) Write out the first four terms of the series.

(b) Use the ratio test to determine whether the series converges or diverges.

(c) If the series converges, find its sum using the formula for the sum of a geometric series.

(d) Consider the related series Σ(n=1 to ∞) n/(3^n). Does this series converge? If so, find its sum.`,
    topics: ["Series", "Sequences", "Convergence Tests", "Geometric Series"],
    rubric: {
      points: 9,
      criteria: [
        "1 point: Correctly writes first four terms",
        "3 points: Correctly applies ratio test",
        "2 points: Correctly determines and finds sum if convergent",
        "3 points: Correctly analyzes and finds sum of related series"
      ]
    }
  },
  {
    id: "calc-bc-2024-2",
    course: "calc-bc",
    year: 2024,
    questionNumber: 2,
    title: "Polar Curves",
    content: `Consider the polar curve r = 2sin(3θ) for 0 ≤ θ ≤ 2π.

(a) Find all values of θ in [0, 2π] where r = 0.

(b) Find the area of one petal of the rose curve.

(c) Find the total area enclosed by the curve.

(d) Find the length of the curve over [0, 2π].`,
    topics: ["Polar Coordinates", "Area in Polar Form", "Arc Length"],
    rubric: {
      points: 9,
      criteria: [
        "2 points: Correctly finds zeros",
        "2 points: Correctly calculates area of one petal",
        "2 points: Correctly calculates total area",
        "3 points: Correctly calculates arc length"
      ]
    }
  }
] 