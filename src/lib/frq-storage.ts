import { PastFRQ } from '@/types/frq'
import { defaultFRQs } from '@/data/frqs'

const FRQ_STORAGE_KEY = 'past-frqs'

export function getAllPastFRQs(): { [id: string]: PastFRQ } {
  // Start with default FRQs
  const allFRQs: { [id: string]: PastFRQ } = {}
  
  // Add all default FRQs first
  Object.values(defaultFRQs).forEach(courseFRQs => {
    courseFRQs.forEach(frq => {
      allFRQs[frq.id] = frq
    })
  })

  // Add user-added FRQs from localStorage if in browser
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(FRQ_STORAGE_KEY)
    if (stored) {
      const userFRQs = JSON.parse(stored)
      // User FRQs override defaults
      Object.assign(allFRQs, userFRQs)
    }
  }
  
  return allFRQs
}

export function getPastFRQsByCourse(course: string): PastFRQ[] {
  const allFRQs = getAllPastFRQs()
  return Object.values(allFRQs).filter(frq => frq.course === course)
}

export function addPastFRQ(frq: Omit<PastFRQ, 'id'>): PastFRQ {
  const id = `${frq.course}-${frq.year}-${frq.questionNumber}`
  const newFRQ: PastFRQ = { ...frq, id }
  
  // Only store user-added FRQs in localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(FRQ_STORAGE_KEY)
    const userFRQs = stored ? JSON.parse(stored) : {}
    userFRQs[id] = newFRQ
    localStorage.setItem(FRQ_STORAGE_KEY, JSON.stringify(userFRQs))
  }
  
  return newFRQ
}

export function deletePastFRQ(id: string): void {
  // Only allow deleting user-added FRQs
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(FRQ_STORAGE_KEY)
    if (stored) {
      const userFRQs = JSON.parse(stored)
      delete userFRQs[id]
      localStorage.setItem(FRQ_STORAGE_KEY, JSON.stringify(userFRQs))
    }
  }
}

export function updatePastFRQ(id: string, updates: Partial<PastFRQ>): PastFRQ {
  // Only allow updating user-added FRQs
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(FRQ_STORAGE_KEY)
    if (stored) {
      const userFRQs = JSON.parse(stored)
      if (userFRQs[id]) {
        const updatedFRQ = { ...userFRQs[id], ...updates }
        userFRQs[id] = updatedFRQ
        localStorage.setItem(FRQ_STORAGE_KEY, JSON.stringify(userFRQs))
        return updatedFRQ
      }
    }
  }
  
  // If not found in user FRQs, check if it's a default FRQ
  const allFRQs = getAllPastFRQs()
  if (allFRQs[id]) {
    return { ...allFRQs[id], ...updates }
  }
  
  throw new Error(`FRQ with id ${id} not found`)
} 