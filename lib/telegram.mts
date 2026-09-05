const TELEGRAM_MESSAGE_LIMIT = 4096

export interface TelegramSendResult {
  chunk: string
  ok: boolean
  error?: string
}

/** Splits text into Telegram-safe chunks, breaking on blank lines where possible. */
export function chunkForTelegram(text: string, limit = TELEGRAM_MESSAGE_LIMIT): string[] {
  if (text.length <= limit) return [text]

  const chunks: string[] = []
  let remaining = text

  while (remaining.length > limit) {
    let cut = remaining.lastIndexOf('\n\n', limit)
    if (cut <= 0) cut = remaining.lastIndexOf('\n', limit)
    if (cut <= 0) cut = limit

    chunks.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }

  if (remaining) chunks.push(remaining)
  return chunks
}

export async function sendTelegramMessage(
  botToken: string,
  chatId: string,
  text: string,
): Promise<TelegramSendResult[]> {
  const chunks = chunkForTelegram(text)
  const results: TelegramSendResult[] = []

  for (const chunk of chunks) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: chunk,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      })

      if (!response.ok) {
        const body = await response.text()
        results.push({ chunk, ok: false, error: `Telegram API ${response.status}: ${body}` })
      } else {
        results.push({ chunk, ok: true })
      }
    } catch (error) {
      results.push({ chunk, ok: false, error: error instanceof Error ? error.message : String(error) })
    }
  }

  return results
}
