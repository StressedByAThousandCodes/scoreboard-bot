import { kv } from '@vercel/kv'

export async function updateScore(user: string, points: number) {
  await kv.incrby(`score:${user}`, points)
}

export async function getScoreboard() {
  const keys = await kv.keys('score:*')
  const entries = []

  for (const key of keys) {
    const user = key.replace('score:', '')
    const score = await kv.get<number>(key)
    entries.push({ user, score })
  }

  entries.sort((a, b) => b.score! - a.score!)

  return entries.map(e => `${e.user}: ${e.score}`).join('\n')
}
