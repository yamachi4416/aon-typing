import data from '~/assets/api/tags.json'
import { ProblemTagSummary } from '~~/types/problems'

export default defineEventHandler(() => {
  return data as Record<string, ProblemTagSummary>
})
