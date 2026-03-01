import { PastFRQ } from "@/types/frq"

export const calcAbFRQs: PastFRQ[] = [
  {
    id: "calc-ab-2024-1",
    course: "calc-ab",
    year: 2024,
    questionNumber: 1,
    title: "Particle Motion",
    content: `A particle moves along a straight line. The particle's velocity at time t is given by v(t) = t^2 - 4t + 3 for 0 ≤ t ≤ 4.

(a) Find all times t, where 0 ≤ t ≤ 4, at which the particle's velocity is 0.

(b) For 0 ≤ t ≤ 4, find when the particle is moving to the right and when it is moving to the left.

(c) Find the total distance traveled by the particle from t = 0 to t = 4.

(d) If the particle's position at time t = 0 is x = 2, find the particle's position at time t = 4.`,
    topics: ["Derivatives", "Motion", "Integration", "Position and Velocity"],
    rubric: {
      points: 9,
      criteria: [
        "1 point: Correctly finds zeros of velocity function",
        "2 points: Correctly determines direction of motion",
        "3 points: Correctly calculates total distance traveled",
        "3 points: Correctly finds position at t = 4"
      ]
    }
  },
  {
    id: "calc-ab-2024-2",
    course: "calc-ab",
    year: 2024,
    questionNumber: 2,
    title: "Area and Volume",
    content: `Let R be the region bounded by the graphs of y = x^2 and y = 4 - x^2.

(a) Find the points of intersection of the two curves.

(b) Find the area of region R.

(c) Find the volume of the solid formed when region R is revolved about the x-axis.

(d) Find the volume of the solid formed when region R is revolved about the y-axis.`,
    topics: ["Integration", "Area Between Curves", "Volume of Revolution"],
    rubric: {
      points: 9,
      criteria: [
        "2 points: Correctly finds intersection points",
        "2 points: Correctly calculates area",
        "2 points: Correctly calculates volume about x-axis",
        "3 points: Correctly calculates volume about y-axis"
      ]
    }
  }
] 