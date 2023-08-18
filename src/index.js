import { Client, GatewayIntentBits } from "discord.js"
import { initCommands } from "./util/discord.js"
import { getMessageCountdown, getMessage } from "./api/d4boss.js"
import ScheduleController from "./util/ScheduleController.js"

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const users = process.env.USERS.split(",")
const scheduler = new ScheduleController()

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag)
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!")
    }

    if (interaction.commandName === "next") {
        let message = await getMessage()
        await interaction.reply(message)
    }
})

async function sendMessage(userId, message) {
    const user = await client.users.fetch(userId, false)
    user.send(message)
}

initCommands([
    {
        name: "ping",
        description: "Replies with Pong!",
    },
    {
        name: "next",
        description: "Return time till next world boss in minutes",
    },
])

client.login(process.env.TOKEN)
console.log(await getMessage())

scheduler.scheduleJob(5, async () => {
    let message = await getMessageCountdown()

    if (message !== null) {
        users.forEach((user) => {
            sendMessage(user, message)
        })
    }
})
