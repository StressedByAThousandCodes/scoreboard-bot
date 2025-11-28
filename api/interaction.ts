import { Hono } from 'hono'
import { verifyKey } from 'discord-interactions'
import { getScoreboard, updateScore } from '../lib/scoreboard'

const app = new Hono()

app.post('/', async (c) => {
  const signature = c.req.header('X-Signature-Ed25519')!
  const timestamp = c.req.header('X-Signature-Timestamp')!
  const rawBody = await c.req.text()

  // Verify request came from Discord
  const isValid = verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY!)
  if (!isValid) return c.text('Invalid signature', 401)

  const interaction = JSON.parse(rawBody)

  // 1. Discord PING check
  if (interaction.type === 1) {
    return c.json({ type: 1 })
  }

  // 2. Handle slash commands (/score)
  if (interaction.type === 2 && interaction.data.name === 'score') {
    const user = interaction.data.options[0].value
    const points = parseInt(interaction.data.options[1].value, 10)

    await updateScore(user, points)
    const scoreboard = await getScoreboard()

    return c.json({
      type: 4, // immediate response
      data: {
        content: `Score updated!\n\n${scoreboard}`
      }
    })
  }

  return c.text('OK')
})

export default app
