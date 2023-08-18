import { DiscordUtil } from "./util/DiscordUtil.js"
import { D4BossApi } from "./api/D4BossApi.js"
import ScheduleController from "./util/ScheduleController.js"

const scheduler = new ScheduleController()
const d4BossApi = new D4BossApi()
const discordUtil = new DiscordUtil(process.env.TOKEN)
//users from env
const users = process.env.USERS.split(",")

discordUtil.initListeners([
    {
        name: "ping",
        callback: async (interaction) => {
            await interaction.reply("Pong!")
        },
    },
    {
        name: "next",
        callback: async (interaction) => {
            let message = await d4BossApi.getMessage()
            await interaction.reply(message)
        },
    },
])

discordUtil.initCommands([
    {
        name: "ping",
        description: "Replies with Pong!",
    },
    {
        name: "next",
        description: "Return time till next world boss in minutes",
    },
])

console.log(await d4BossApi.getMessage())

scheduler.scheduleJob(5, async () => {
    let message = await d4BossApi.getMessageCountdown()

    if (message !== null) {
        users.forEach((user) => {
            discordUtil.sendMessage(user, message)
        })
    }
})
