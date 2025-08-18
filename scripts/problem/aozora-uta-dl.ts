import { Element, Window } from 'happy-dom'
import fs from 'node:fs/promises'
import path from 'node:path'
import { TextDecoder } from 'node:util'
import { kana2Hira } from '~~/libs/TypingUtil'
import { defineCommand } from '../_util/cli'
import { httpFetch } from '../_util/http'

const normalizeMap: Record<string, string> = {
  一: '１',
  二: '２',
  三: '３',
  '…': '...',
}

function normalizeKana(text?: string) {
  const hira = kana2Hira(text ?? '') ?? ''
  return Array.from(hira)
    .map((s) => normalizeMap[s] || s)
    .join('')
    .replace(/ヽ/g, (c, i, a) => {
      let j = 1
      while (a[i - j] === c) {
        j--
      }
      return a[i - j]
    })
}

async function fetchCard(cardUrl: string) {
  const { document } = new Window({ url: cardUrl })
  const info = {
    title: '',
    titleKana: '',
    author: '',
    authorKana: '',
    dlUrl: '',
  }

  {
    const tds = Array.from(
      document.querySelectorAll('[summary="タイトルデータ"] td'),
    )
    for (let i = 0; i < tds.length; i++) {
      const c = tds[i]!.textContent
      if (c?.startsWith('作品名：')) {
        info.title = tds[++i]?.textContent?.trim() ?? ''
      } else if (c?.startsWith('作品名読み：')) {
        info.titleKana = normalizeKana(tds[++i]?.textContent?.trim()) ?? ''
      } else if (c?.startsWith('著者名：')) {
        info.author = tds[++i]?.textContent?.trim() ?? ''
      }
    }
  }

  {
    const tds = Array.from(
      document.querySelectorAll('[summary="作家データ"] td'),
    )
    for (let i = 0; i < tds.length; i++) {
      const c = tds[i]!.textContent
      if (c?.startsWith('作家名読み：')) {
        info.authorKana = normalizeKana(tds[++i]?.textContent?.trim())
      }
    }
  }

  const dlLink = document
    .querySelector('[summary="ダウンロードデータ"] a[href$=".html"]')
    ?.getAttribute('href')

  if (dlLink) {
    info.dlUrl = new URL(dlLink, cardUrl).href
  }

  return info
}

async function fetchDocument(url: string) {
  const { document } = new Window()
  document.documentElement.innerHTML = new TextDecoder('sjis').decode(
    await httpFetch(url).then(({ data }) => data),
  )

  const mainText = document.querySelector('.main_text')
  const words = [{ info: '', info2: '' }]

  Array.from(mainText?.childNodes.values() ?? []).forEach((node) => {
    if (node.nodeName === 'BR') {
      words.push({ info: '', info2: '' })
      return
    }

    const word = words[words.length - 1]!
    if (node instanceof Element && node.nodeName === 'RUBY') {
      const rb = Array.from(node.getElementsByTagName('rb'))
        .map((r) => r.textContent)
        .join('')
      const rt = Array.from(node.getElementsByTagName('rt'))
        .map((r) => r.textContent)
        .join('')
      word.info += rb
      word.info2 += normalizeKana(rt)
    } else if (node) {
      if (node instanceof Element && node.classList?.contains('notes')) {
        return
      }
      const text = node.textContent?.trimStart()
      if (text) {
        word.info += text
        word.info2 += normalizeKana(text)
      }
    }
  })

  const ret = {
    id: undefined as never as string,
    title: document.querySelector('.title')?.textContent,
    author: document.querySelector('.author')?.textContent,
    words: words.filter((word) => word.info),
    links: undefined as never as Array<Record<string, string>>,
  }

  return ret
}

function splitWords(
  words: Array<{ info: string, info2: string }>,
  regex: RegExp,
  max: number,
) {
  const ret = []

  const nwords = words.reduce<Array<{ info: string, info2: string }>>(
    (a, word) => {
      if (word.info.length <= max) {
        a.push(word)
      } else {
        const i1 = word.info.split(regex)
        const i2 = word.info2.split(regex)
        if (i1.length !== i2.length || i1.length === 1) {
          a.push(word)
        } else {
          a.push(
            ...i1.map((v, i) => ({
              info: v,
              info2: i2[i]!,
            })),
          )
        }
      }

      return a
    },
    [],
  )

  let w = { info: '', info2: '' }
  ret.push(w)
  for (const word of nwords) {
    const { info, info2 } = word
    if (w.info.length + info.length > max) {
      w = { info, info2 }
      ret.push(w)
    } else {
      w.info = `${w.info}${info}`
      w.info2 = `${w.info2}${info2}`
    }
  }

  return ret
}

async function aozoraDL(args: { url: string, dist: string, word: number }) {
  const cardUrl = new URL(args.url)
  const distDir = args.dist
  const wordMax = args.word

  const link = cardUrl.href
  const info = await fetchCard(link)
  const page = await fetchDocument(info.dlUrl)

  page.id = path.basename(cardUrl.pathname, '.html').replace('card', '')
  page.id = '80' + page.id.padStart(5, '0')
  page.links = [{ site: '青空文庫', name: '図書カード', link }]

  if (wordMax > 0) {
    page.words = splitWords(
      page.words.slice(0),
      /(?=「)|(?<=(?<!。)」)|(?<=。(?!」))/,
      wordMax,
    )
    page.words = splitWords(
      page.words.slice(0),
      /(?=「)|(?<=(?<!。)」)|(?<=。(?!」))|(?<=、)/,
      wordMax + 20,
    )
  }

  page.words.unshift(
    { info: info.title, info2: info.titleKana },
    { info: info.author, info2: info.authorKana },
  )

  page.words.forEach((word: { info: string, info2: string }) => {
    word.info = word.info.trim()
    word.info2 = word.info2.trim()
  })

  const date = new Date().toISOString().substring(0, 10)

  const data = {
    title: `${page.title}（${page.author}）`,
    type: 'japanese',
    skip: false,
    tags: ['日本語', '青空文庫', '日本文学', '物語'],
    createdAt: date,
    updatedAt: date,
    words: page.words,
    links: page.links,
  }

  if (distDir) {
    const stat = await fs.stat(distDir)
    if (!stat.isDirectory()) {
      console.error(`${distDir} is not directory.`)
      return
    }
    const dist = path.resolve(distDir, `${page.id}.json`)
    const temp = JSON.parse(
      await fs.readFile(dist, { flag: 'r', encoding: 'utf8' }),
    )
    if (temp.skip) {
      console.info(`skip write: ${dist}`)
      return
    }
    await fs.writeFile(dist, JSON.stringify(temp, null, 2))
  } else {
    console.log(data)
  }
}

export default defineCommand({
  meta: {
    name: 'aozora',
    description: 'download uta info for typing problem json',
  },
  args: {
    aororaUtaUrl: {
      alias: 'u',
      type: 'string',
      description: 'request url',
      required: true,
    },
    dataDir: {
      alias: 'o',
      type: 'string',
      description: 'data directory',
      required: true,
    },
    wordCount: {
      alias: 'W',
      type: 'string',
      description: 'word max',
      default: '40',
    },
  },
  async run({ args: { aororaUtaUrl, wordCount: _wordCount, dataDir } }) {
    const wordCount = parseInt(_wordCount, 10)
    if (Number.isNaN(wordCount)) throw new Error('wordCount is not number')
    await aozoraDL({
      url: aororaUtaUrl,
      word: wordCount,
      dist: path.join(dataDir, 'problems'),
    })
  },
})
