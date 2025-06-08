import data from '~/assets/api/newProblems.json'
import type { ProblemListItem } from '~~/types/problems'

export default defineEventHandler(() => {
  return data as ProblemListItem[]
})
