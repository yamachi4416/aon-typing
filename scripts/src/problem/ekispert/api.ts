import { httpFetch } from '../../lib/util'

interface PagingResult {
  ResultSet: {
    max?: string
    offset?: string
  }
}

interface Corporation {
  code: string
  Name: string
  Type: string
}

export interface CorporationApiResult {
  ResultSet: {
    apiVersion: string
    engineVersion: string
    max?: string
    offset?: string
    Corporation: Corporation[]
  }
}

interface Point {
  GeoPoint: {
    gcs: string
    lati: string
    lati_d: string
    longi: string
    longi_d: string
  }
  Prefecture: {
    Name: string
    code: string
  }
  Station: {
    Name: string
    Yomi: string
    Type: string
    code: string
  }
}

export interface StationApiResult {
  ResultSet: {
    apiVersion: string
    engineVersion: string
    Point: Point[]
  }
}

interface Line {
  Color: string
  Name: string
  Yomi: string
  code: string
  corporationIndex: string
}

export interface OperationLineApiResult {
  ResultSet: {
    apiVersion: string
    engineVersion: string
    max?: string
    offset?: string
    Corporation: Corporation[]
    Line: Line[]
  }
}

type FetchStationResult =
  ReturnType<typeof fetchStation> extends Promise<infer T> ? T : any

function joinWords(pages: Array<FetchStationResult['words']>) {
  let words = [...pages[0]]
  for (let i = 1; i < pages.length; i++) {
    const page = pages[i]
    const pstart = page.shift()
    const plast = page.pop()
    const wstart = words[0]
    const wlast = words[words.length - 1]
    if (!pstart || !plast) {
      throw new Error(`illegal page state ${pstart ? 'plast' : 'pstart'}`)
    }
    if (wstart.info === pstart.info) {
      words.unshift(...page, plast)
    } else if (wlast.info === plast.info) {
      words.push(...page, plast)
    } else if (wstart.info === plast.info) {
      words = [pstart, ...page, ...words]
    } else if (pstart.info === wlast.info) {
      words = [...words, ...page, plast]
    } else {
      throw new Error(
        `mismatch stations [${wstart.info}...${wlast.info}] [${pstart.info}...${plast.info}]`,
      )
    }
  }
  return words
}

async function* fetchPagingAll<T extends PagingResult>({
  baseUrl,
}: {
  baseUrl: string
}) {
  const fetchPage = async (offset: number) =>
    await httpFetch(`${baseUrl}&offset=${offset}`).then(
      ({ data }) => JSON.parse(data.toString()) as T,
    )

  const page1 = await fetchPage(1)
  yield page1

  const pageCount = Math.ceil(Number(page1.ResultSet.max) / 100) - 1
  for (let i = 0; i < pageCount; i++) {
    const offset = (i + 1) * 100 + 1
    yield await fetchPage(offset)
  }
}

export async function fetchStation({
  key,
  operationLineCode,
}: {
  key: string
  operationLineCode: string
}) {
  return await httpFetch(
    `https://api.ekispert.jp/v1/json/station?key=${key}&operationLineCode=${operationLineCode}`,
  )
    .then(({ data }) => JSON.parse(data.toString()) as StationApiResult)
    .then((data) => {
      const points = Array.isArray(data.ResultSet.Point)
        ? data.ResultSet.Point
        : [data.ResultSet.Point]
      const words = points.map((p: any) => ({
        info: p.Station.Name.replace(/\(.+?\)$/, '') as string,
        info2: p.Station.Yomi as string,
      }))
      return { points, words }
    })
}

export async function fetchStations({
  key,
  operationLineCodes,
}: {
  key: string
  operationLineCodes: string[]
}) {
  const fetchs = operationLineCodes.map(
    async (operationLineCode) => await fetchStation({ key, operationLineCode }),
  )

  const data = await Promise.all(fetchs)

  return {
    data,
    words: joinWords(data.map(({ words }) => words)),
  }
}

export async function fetchOperationLines({
  key,
  code,
}: {
  key: string
  code?: string
}) {
  const lines: {
    code: string
    name: string
    yomi: string
    corporation: { code: string }
  }[] = []

  for await (const page of fetchPagingAll<OperationLineApiResult>({
    baseUrl: `https://api.ekispert.jp/v1/json/operationLine?key=${key}${code ? `&code=${code}` : ''}`,
  })) {
    const result = page.ResultSet
    const corporations = Array.isArray(result.Corporation)
      ? result.Corporation
      : [result.Corporation]
    lines.push(
      ...result.Line.map((line) => ({
        code: line.code,
        name: line.Name,
        yomi: line.Yomi,
        corporation: corporations[Number(line.corporationIndex) - 1],
      })),
    )
  }

  return lines.toSorted((a, b) => Number(a.code) - Number(b.code))
}

export async function fetchOperationLine({
  key,
  code,
}: {
  key: string
  code: string
}) {
  return await fetchOperationLines({ key, code })
}

export async function fetchCorporations({ key }: { key: string }) {
  const corporations: {
    code: string
    name: string
  }[] = []

  for await (const page of fetchPagingAll<CorporationApiResult>({
    baseUrl: `https://api.ekispert.jp/v1/json/corporation?key=${key}&type=train`,
  })) {
    corporations.push(
      ...page.ResultSet.Corporation.map((c) => ({
        code: c.code,
        name: c.Name,
      })),
    )
  }

  return corporations
}
