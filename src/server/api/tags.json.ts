import data from '~/assets/api/tags.json'
import { type ProblemTagSummary } from '~~/types/problems'

export default defineEventHandler(() => {
  return data as unknown as Record<string, ProblemTagSummary>
})
