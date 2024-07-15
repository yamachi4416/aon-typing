type ProblemType = 'japanese' | 'english'

export interface ProblemItemTag {
  id: string
  name: string
}

export interface ProblemListItem {
  id: string
  title: string
  words: number
  chars: number
  type: ProblemType
  tags: ProblemItemTag[]
}

export interface ProblemTagSummary {
  id: string
  name: string
  count: number
}

export interface TagInfo {
  id: string
  name: string
  problems: ProblemListItem[]
}

export interface ProblemDetailLink {
  site: string
  name: string
  link: string
}

export interface ProblemDetailWord {
  info?: string
  info2?: string
  word: string
}

export interface ProblemDetail {
  id: string
  title: string
  type: ProblemType
  tags: ProblemItemTag[]
  createdAt: string
  updatedAt: string
  words: ProblemDetailWord[]
  links?: ProblemDetailLink[]
  optional?: {
    cd?: string[]
    coCd: string[]
  }
}

export interface RailwayProblemDetail extends ProblemDetail {}

export interface RailwayCorporation {
  code: string
  name: string
  operationLines: {
    id?: string | null
    code: string
    name: string
    yomi: string
  }[]
}
