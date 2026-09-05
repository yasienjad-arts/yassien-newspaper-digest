import type { NewspaperSource } from './headlines.mts'

export const NEWSPAPERS: NewspaperSource[] = [
  {
    name: 'النهار',
    homepage: 'https://www.annahar.com/',
    rssUrl: 'https://www.annahar.com/rss',
  },
  {
    name: 'الأخبار',
    homepage: 'https://www.al-akhbar.com/',
    fallbackRssUrl:
      'https://news.google.com/rss/search?q=site%3Aal-akhbar.com&hl=ar&gl=LB&ceid=LB%3Aar',
  },
  {
    name: 'الجمهورية',
    homepage: 'https://www.aljoumhouria.com/',
    fallbackRssUrl:
      'https://news.google.com/rss/search?q=site%3Aaljoumhouria.com&hl=ar&gl=LB&ceid=LB%3Aar',
  },
  {
    name: 'الديار',
    homepage: 'https://addiyar.com/',
    fallbackRssUrl:
      'https://news.google.com/rss/search?q=site%3Aaddiyar.com&hl=ar&gl=LB&ceid=LB%3Aar',
  },
  {
    name: 'نداء الوطن',
    homepage: 'https://www.nidaalwatan.com/',
    fallbackRssUrl:
      'https://news.google.com/rss/search?q=site%3Anidaalwatan.com&hl=ar&gl=LB&ceid=LB%3Aar',
  },
  {
    name: 'اللواء',
    homepage: 'https://aliwaa.com.lb/',
    htmlHeadlinePattern: /[؀-ۿ]{6,}/,
    fallbackRssUrl:
      'https://news.google.com/rss/search?q=site%3Aaliwaa.com.lb&hl=ar&gl=LB&ceid=LB%3Aar',
  },
  {
    name: 'الشرق',
    homepage: 'https://www.elsharkonline.com/',
    rssUrl: 'https://www.elsharkonline.com/feed/',
  },
  {
    name: 'البناء',
    homepage: 'https://al-binaa.com/',
    fallbackRssUrl:
      'https://news.google.com/rss/search?q=site%3Aal-binaa.com&hl=ar&gl=LB&ceid=LB%3Aar',
  },
  {
    name: 'الشرق الأوسط',
    homepage: 'https://aawsat.com/',
    rssUrl: 'https://aawsat.com/feed',
  },
]
