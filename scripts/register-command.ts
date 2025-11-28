const commands = [
  {
    name: "score",
    description: "Add points to a user",
    options: [
      { name: "user", type: 3, description: "User name", required: true },
      { name: "points", type: 4, description: "Points to add", required: true }
    ]
  }
]

async function main() {
  const url = `https://discord.com/api/v10/applications/${process.env.DISCORD_APP_ID}/commands`

  await fetch(url, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${process.env.DISCORD_BOT_TOKEN}`
    },
    body: JSON.stringify(commands)
  })

  console.log("Commands registered")
}

main()
