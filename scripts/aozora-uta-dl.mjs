import fs from 'fs'
import http from 'http'
import https from 'https'
import path from 'path'
import { TextDecoder } from 'util'
import console from 'console'
import jsdom from 'jsdom'
import jaChars from '../libs/TypingJapaneseChars.mjs'

const normalizeMap = {
  一: '１',
  '…': '...',
}

const normalizeKana = (text) => {
  const hira = jaChars.kana2Hira(text || '') || ''
  return Array.from(hira)
    .map((s) => normalizeMap[s] || s)
    .join('')
}

const httpGet = async (url) => {
  return await new Promise((resolve) => {
    const h = url.startsWith('https') ? https : http
    const req = h.request(url, (res) => {
      let body = Buffer.from([])
      res.on('data', (chunk) => {
        body = Buffer.concat([body, chunk])
      })
      res.on('end', () => {
        resolve(body)
      })
    })
    req.setHeader(
      'user-agent',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62'
    )
    req.end()
  })
}

const fetchCard = async (cardUrl) => {
  const res = await httpGet(cardUrl)
  const document = new jsdom.JSDOM(res).window.document
  const info = {
    title: '',
    titleKana: '',
    author: '',
    authorKana: '',
    dlUrl: '',
  }

  ;(() => {
    const tds = Array.from(
      document.querySelectorAll('[summary="タイトルデータ"] td')
    )
    for (let i = 0; i < tds.length; i++) {
      const c = tds[i].textContent
      if (c.startsWith('作品名：')) {
        info.title = tds[++i]?.textContent?.trim()
      } else if (c.startsWith('作品名読み：')) {
        info.titleKana = normalizeKana(tds[++i]?.textContent?.trim())
      } else if (c.startsWith('著者名：')) {
        info.author = tds[++i]?.textContent?.trim()
      }
    }
  })()
  ;(() => {
    const tds = Array.from(
      document.querySelectorAll('[summary="作家データ"] td')
    )
    for (let i = 0; i < tds.length; i++) {
      const c = tds[i].textContent
      if (c.startsWith('作家名読み：')) {
        info.authorKana = normalizeKana(tds[++i]?.textContent?.trim())
      }
    }
  })()

  const dlLink = document
    .querySelector('[summary="ダウンロードデータ"] a[href$=".html"]')
    ?.getAttribute('href')

  if (dlLink) {
    info.dlUrl = new URL(dlLink, cardUrl).href
  }

  console.log(info)

  return info
}

const fetchDocument = async (url) => {
  const txt = new TextDecoder('sjis')
  const res = txt.decode(await httpGet(url))
  const document = new jsdom.JSDOM(res).window.document
  const mainText = document.querySelector('.main_text')
  const words = [{ info: '', info2: '' }]

  Array.from(mainText.childNodes.values()).forEach((node) => {
    if (node.nodeName === 'BR') {
      words.push({ info: '', info2: '' })
      return
    }

    const word = words[words.length - 1]
    if (node.nodeName === 'RUBY') {
      const rb = Array.from(node.getElementsByTagName('rb'))
        .map((r) => r.textContent)
        .join('')
      const rt = Array.from(node.getElementsByTagName('rt'))
        .map((r) => r.textContent)
        .join('')
      word.info += rb
      word.info2 += rt
    } else if (node.nodeName === '#text') {
      const text = node.textContent.trimStart()
      if (text) {
        word.info += text
        word.info2 += normalizeKana(text)
      }
    }
  })

  return {
    title: document.querySelector('.title').textContent,
    author: document.querySelector('.author').textContent,
    words: words.filter((word) => word.info),
  }
}

const splitWords = (words, regex, max) => {
  const ret = []

  const nwords = words.reduce((a, word) => {
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
            info2: i2[i],
          }))
        )
      }
    }

    return a
  }, [])

  let w = { info: '', info2: '' }
  ret.push(w)
  for (const word of nwords) {
    const { info, info2 } = word
    if (w.info.length + info.length > max) {
      w = { info, info2 }
      ret.push(w)
    } else {
      w.info += info
      w.info2 += info2
    }
  }

  return ret
}

const main = async () => {
  const args = process.argv.slice(2)

  if (!args.length) {
    console.error('args: [dataDir] [cardUrl]')
    return
  }

  let cardUrl, distDir
  if (args.length === 1) {
    cardUrl = new URL(args[0])
  } else {
    distDir = args[0]
    cardUrl = new URL(args[1])
  }

  const link = cardUrl.href
  const info = await fetchCard(link)
  const page = await fetchDocument(info.dlUrl)

  page.id = path.basename(cardUrl.pathname, '.html').replace('card', '')
  page.links = [{ site: '青空文庫', name: '図書カード', link }]

  const max = 40
  page.words = splitWords(
    page.words.slice(0),
    /(?=「)|(?<=(?<!。)」)|(?<=。(?!」))/,
    max
  )
  page.words = splitWords(
    page.words.slice(0),
    /(?=「)|(?<=(?<!。)」)|(?<=。(?!」))|(?<=、)/,
    max + 20
  )

  page.words.unshift(
    { info: info.title, info2: info.titleKana },
    { info: info.author, info2: info.authorKana }
  )

  page.words.forEach((word) => {
    word.info = word.info.trim()
    word.info2 = word.info2.trim()
  })

  const data = {
    title: `${page.title}（${page.author}）`,
    type: 'japanese',
    skip: false,
    tags: ['日本語', '青空文庫', '日本文学', '物語'],
    createdAt: '2021-05-31',
    updatedAt: '2021-05-31',
    words: page.words,
    links: page.links,
  }

  if (distDir) {
    if (fs.existsSync(distDir)) {
      const dist = path.resolve(distDir, `${page.id}.json`)
      if (fs.existsSync(dist)) {
        const tmp = JSON.parse(fs.readFileSync(dist))
        if (tmp.skip) {
          console.info(`skip write: ${dist}`)
          return
        }
      }
      fs.writeFileSync(dist, JSON.stringify(data, null, 2))
      console.info(`write: ${dist}`)
    } else {
      console.error(`${distDir} is not exists.`)
    }
  } else {
    console.log(data)
  }
}

main()
