import type { SourceResult } from './headlines.mts'

export function formatDigestHeader(timeZone: string): string {
  const now = new Date()
  const formatted = new Intl.DateTimeFormat('ar', {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)

  return `🗞️ <b>ملخص الصحف اليومي</b>\n${formatted}`
}

export function formatDigest(results: SourceResult[], timeZone: string): string {
  const sections = results.map(({ source, headlines, error }) => {
    if (error || headlines.length === 0) {
      return `<b>${source.name}</b>\n⚠️ تعذر جلب العناوين حاليًا`
    }

    const lines = headlines.map((h) => `• <a href="${h.link}">${h.title}</a>`)
    return `<b>${source.name}</b>\n${lines.join('\n')}`
  })

  return [formatDigestHeader(timeZone), ...sections].join('\n\n')
}
