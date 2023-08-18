import { Client, GatewayIntentBits } from "discord.js"
import { initCommands } from "./commands.js"
import { getNextBoss } from "./d4boss.js"
import ScheduleController from "./ScheduleController.js"

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
const users = process.env.USERS.split(",")
const scheduler = new ScheduleController()

console.log(await getNextBoss())

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

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag)
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!")
    }

    if (interaction.commandName === "next") {
        let boss = await getNextBoss()
        await interaction.reply(
            "The next boss is " +
                boss.name +
                " in " +
                boss.time +
                " minutes at " +
                convertCountdownToTime(boss.time) +
                "."
        )
    }
})

async function sendMessage(userId, message) {
    const user = await client.users.fetch(userId, false)
    user.send(message)
}

function convertCountdownToTime(minutes) {
    return new Date(Date.now() + minutes * 60000).toLocaleTimeString()
}

client.login(process.env.TOKEN)

let lasttime = 0

scheduler.scheduleJob(5, async () => {
    let boss = await getNextBoss()
    console.log("Boss in: " + boss.time)
    if (lasttime < boss.time) {
        users.forEach((user) => {
            sendMessage(
                user,
                "The next boss is " +
                    boss.name +
                    " in " +
                    boss.time +
                    " minutes at " +
                    convertCountdownToTime(boss.time) +
                    "."
            )
        })
    }
    lasttime = boss
    if (boss.time < 20) {
        users.forEach((user) => {
            sendMessage(user, "The next boss is " + boss.name + " in " + boss.time + " minutes!")
        })
    }
})
