import { problems as data } from '~/assets/api/problems.json'
import { ProblemListItem } from '~~/types/problems'

export default defineEventHandler(() => {
  return { problems: data as ProblemListItem[] }
})
