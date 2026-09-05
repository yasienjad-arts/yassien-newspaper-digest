import { fetchAllHeadlines } from '../../lib/headlines.mts'
import { formatDigest } from '../../lib/digest.mts'
import { sendTelegramMessage } from '../../lib/telegram.mts'
import { NEWSPAPERS } from '../../lib/newspapers.mts'

export default async (req: Request) => {
  const botToken = Netlify.env.get('TELEGRAM_BOT_TOKEN')
  const chatId = Netlify.env.get('TELEGRAM_CHAT_ID')
  const timeZone = Netlify.env.get('TIME_ZONE') || 'Asia/Beirut'

  if (!botToken || !chatId) {
    return Response.json(
      { ok: false, error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables' },
      { status: 500 },
    )
  }

  const results = await fetchAllHeadlines(NEWSPAPERS)
  const digest = formatDigest(results, timeZone)
  const sendResults = await sendTelegramMessage(botToken, chatId, digest)

  return Response.json({
    ok: sendResults.every((r) => r.ok),
    sources: results.map((r) => ({
      name: r.source.name,
      headlineCount: r.headlines.length,
      error: r.error,
    })),
    telegram: sendResults.map((r) => ({ ok: r.ok, error: r.error })),
  })
}
