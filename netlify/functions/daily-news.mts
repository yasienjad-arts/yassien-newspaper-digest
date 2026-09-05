import { fetchAllHeadlines } from '../../lib/headlines.mts'
import { formatDigest } from '../../lib/digest.mts'
import { sendTelegramMessage } from '../../lib/telegram.mts'
import { NEWSPAPERS } from '../../lib/newspapers.mts'

export default async (req: Request) => {
  const botToken = Netlify.env.get('TELEGRAM_BOT_TOKEN')
  const chatId = Netlify.env.get('TELEGRAM_CHAT_ID')
  const timeZone = Netlify.env.get('TIME_ZONE') || 'Asia/Beirut'

  if (!botToken || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables')
    return
  }

  const results = await fetchAllHeadlines(NEWSPAPERS)
  const digest = formatDigest(results, timeZone)
  const sendResults = await sendTelegramMessage(botToken, chatId, digest)

  const failures = sendResults.filter((r) => !r.ok)
  if (failures.length > 0) {
    console.error('Failed to send some digest chunks to Telegram:', failures.map((f) => f.error))
  }

  const sourceFailures = results.filter((r) => r.error)
  if (sourceFailures.length > 0) {
    console.warn(
      'Some newspaper sources could not be fetched:',
      sourceFailures.map((r) => `${r.source.name}: ${r.error}`),
    )
  }
}
