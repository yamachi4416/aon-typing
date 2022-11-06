import data from '~/assets/api/newProblems.json'
import { ProblemListItem } from '~~/types/problems'

export default defineEventHandler(() => {
  return data.slice(0, 6) as ProblemListItem[]
})
