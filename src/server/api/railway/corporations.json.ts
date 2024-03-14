import data from '~/assets/api/railway/corporations.json'
import type { RailwayCorporation } from '~~/types/problems'

export default defineEventHandler(() => {
  return data as RailwayCorporation[]
})
