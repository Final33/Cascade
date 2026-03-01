import { calcBcFRQs } from "./calc-bc"
import { calcAbFRQs } from "./calc-ab"
import { apCsFRQs } from "./ap-cs"
import { PastFRQ } from "@/types/frq"

export const defaultFRQs: { [course: string]: PastFRQ[] } = {
  "calc-ab": calcAbFRQs,
  "calc-bc": calcBcFRQs,
  "cs-a": apCsFRQs
}

export const allFRQs: PastFRQ[] = [
  ...calcBcFRQs,
  ...calcAbFRQs,
  ...apCsFRQs
]

export { calcBcFRQs, calcAbFRQs, apCsFRQs }

// Helper to get default FRQs for a course
export function getDefaultFRQsForCourse(course: string): PastFRQ[] {
  return defaultFRQs[course] || []
} 