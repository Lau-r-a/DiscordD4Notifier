import { REST, Routes } from "discord.js"

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN)

export async function initCommands(commands) {
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
