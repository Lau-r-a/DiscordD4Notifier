import { REST, Routes } from "discord.js"
import { Client, GatewayIntentBits } from "discord.js"

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN)

export function DiscordUtil(token) {
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] })
    this.client.login(token)

    this.client.on("ready", () => {
        console.log("Logged in as " + this.client.user.tag)
    })

    this.initCommands = async (commands) => {
        try {
            console.log("Started refreshing application (/) commands.")

            await rest.put(Routes.applicationCommands(process.env.APPID), {
                body: commands,
            })

            console.log("Successfully reloaded application (/) commands.")
        } catch (error) {
            console.error(error)
        }
    }

    this.initListeners = (listenerArray) => {
        this.client.on("interactionCreate", (interaction) => {
            listenerArray.forEach((element) => {
                if (element.name == interaction.commandName) {
                    element.callback(interaction)
                }
            })
        })
    }

    this.sendMessage = async (userId, message) => {
        const user = await this.client.users.fetch(userId, false)
        user.send(message)
    }
}
