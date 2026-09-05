import type { NewspaperSource } from './headlines.mts'

/**
 * Sources for the daily digest. Several Lebanese newspaper sites sit behind
 * bot-protection (Cloudflare/Sucuri) that blocks even a plain HTTP fetch with
 * no RSS fallback available — those are listed with `homepage` only so
 * fetchSourceHeadlines can try, but they are expected to fail gracefully and
 * be skipped in the digest until a different fetching strategy is adopted.
 * L'Orient-Le Jour is intentionally excluded per project scope.
 */
export const NEWSPAPERS: NewspaperSource[] = [
  {
    name: 'النهار',
    homepage: 'https://www.annahar.com/',
    rssUrl: 'https://www.annahar.com/rss',
  },
  {
    name: 'الأخبار',
    homepage: 'https://www.al-akhbar.com/',
  },
  {
    name: 'الجمهورية',
    homepage: 'https://www.aljoumhouria.com/',
  },
  {
    name: 'الديار',
    homepage: 'https://addiyar.com/',
  },
  {
    name: 'نداء الوطن',
    homepage: 'https://www.nidaalwatan.com/',
  },
  {
    name: 'اللواء',
    homepage: 'https://aliwaa.com.lb/',
    htmlHeadlinePattern: /[؀-ۿ]{6,}/,
  },
  {
    name: 'الشرق',
    homepage: 'https://www.elsharkonline.com/',
    rssUrl: 'https://www.elsharkonline.com/feed/',
  },
  {
    name: 'البناء',
    homepage: 'https://al-binaa.com/',
  },
  {
    name: 'الشرق الأوسط',
    homepage: 'https://aawsat.com/',
    rssUrl: 'https://aawsat.com/feed',
  },
]
