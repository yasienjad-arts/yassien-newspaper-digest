import { XMLParser } from 'fast-xml-parser'

export interface NewspaperSource {
  name: string
  homepage: string
  rssUrl?: string
  fallbackRssUrl?: string
  /** CSS-free heuristic used when no RSS feed is available: matches headline anchor text. */
  htmlHeadlinePattern?: RegExp
}

export interface Headline {
  title: string
  link: string
}

export interface SourceResult {
  source: NewspaperSource
  headlines: Headline[]
  error?: string
}

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'

const FETCH_TIMEOUT_MS = 15_000
const MAX_HEADLINES_PER_SOURCE = 6

async function fetchText(url: string): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en-US;q=0.8,en;q=0.6',
      },
      signal: controller.signal,
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    return await response.text()
  } finally {
    clearTimeout(timeout)
  }
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseRss(xml: string): Headline[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
  })

  const doc = parser.parse(xml)

  const items: any[] =
    doc?.rss?.channel?.item ??
    doc?.feed?.entry ??
    []

  const list = Array.isArray(items) ? items : [items]

  return list
    .map((item) => {
      const title = cleanTitle(
        String(item?.title?.['#text'] ?? item?.title ?? '')
      )

      let link = ''

      if (typeof item?.link === 'string') {
        link = item.link
      } else if (Array.isArray(item?.link)) {
        const alternate =
          item.link.find(
            (value: any) =>
              value?.['@_rel'] === 'alternate' ||
              value?.['@_href']
          ) ?? item.link[0]

        link =
          alternate?.['@_href'] ??
          alternate?.href ??
          ''
      } else {
        link =
          item?.link?.['@_href'] ??
          item?.link?.href ??
          item?.guid?.['#text'] ??
          item?.guid ??
          ''
      }

      return {
        title,
        link: String(link),
      }
    })
    .filter((headline) => headline.title && headline.link)
}

function uniqueHeadlines(headlines: Headline[]): Headline[] {
  const seen = new Set<string>()

  return headlines.filter((headline) => {
    const key = headline.title.trim()

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}

/** Best-effort fallback for sources without a working RSS feed. */
function parseHtmlHeadlines(
  html: string,
  pattern: RegExp,
  baseUrl: string
): Headline[] {
  const headlines: Headline[] = []

  const anchorRegex =
    /<a\s[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gis

  let match: RegExpExecArray | null

  while ((match = anchorRegex.exec(html)) !== null) {
    const [, href, innerHtml] = match

    const title = cleanTitle(innerHtml)

    pattern.lastIndex = 0

    if (
      !title ||
      title.length < 12 ||
      !pattern.test(title)
    ) {
      continue
    }

    let link = href

    try {
      link = new URL(href, baseUrl).toString()
    } catch {
      continue
    }

    if (!link.startsWith('http')) continue

    if (!headlines.some((h) => h.title === title)) {
      headlines.push({ title, link })
    }
  }

  return headlines
}

async function tryRss(url: string): Promise<Headline[]> {
  const xml = await fetchText(url)

  return uniqueHeadlines(
    parseRss(xml)
  ).slice(0, MAX_HEADLINES_PER_SOURCE)
}

export async function fetchSourceHeadlines(
  source: NewspaperSource
): Promise<SourceResult> {
  const errors: string[] = []

  try {
    /*
     * 1. Primary RSS
     */
    if (source.rssUrl) {
      try {
        const headlines = await tryRss(source.rssUrl)

        if (headlines.length > 0) {
          return { source, headlines }
        }

        errors.push('Primary RSS returned no headlines')
      } catch (error) {
        errors.push(
          `Primary RSS: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        )
      }
    }

    /*
     * 2. Original newspaper website
     */
    try {
      const html = await fetchText(source.homepage)

      const pattern =
        source.htmlHeadlinePattern ?? /[؀-ۿ]/

      const headlines = parseHtmlHeadlines(
        html,
        pattern,
        source.homepage
      ).slice(0, MAX_HEADLINES_PER_SOURCE)

      if (headlines.length > 0) {
        return { source, headlines }
      }

      errors.push('Homepage returned no headlines')
    } catch (error) {
      errors.push(
        `Homepage: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`
      )
    }

    /*
     * 3. Fallback RSS
     * Used when the original newspaper blocks Netlify
     * with HTTP 403 or other bot protection.
     */
    if (source.fallbackRssUrl) {
      try {
        const headlines = await tryRss(
          source.fallbackRssUrl
        )

        if (headlines.length > 0) {
          return { source, headlines }
        }

        errors.push('Fallback RSS returned no headlines')
      } catch (error) {
        errors.push(
          `Fallback RSS: ${
            error instanceof Error
              ? error.message
              : String(error)
          }`
        )
      }
    }

    return {
      source,
      headlines: [],
      error: errors.join(' | '),
    }
  } catch (error) {
    return {
      source,
      headlines: [],
      error:
        error instanceof Error
          ? error.message
          : String(error),
    }
  }
}

export async function fetchAllHeadlines(
  sources: NewspaperSource[]
): Promise<SourceResult[]> {
  return Promise.all(
    sources.map(fetchSourceHeadlines)
  )
}
