import * as https from "https"
import moment from "moment-timezone"

async function httpsGet(url) {
    return new Promise(async (resolve, reject) => {
        let body = []

        const req = https.request(url, (res) => {
            res.on("data", (chunk) => body.push(chunk))
            res.on("end", () => {
                const data = Buffer.concat(body).toString()
                resolve(data)
            })
        })
        req.on("error", (e) => {
            console.log(`ERROR httpsGet: ${e}`)
            reject(e)
        })
        req.end()
    })
}

async function getNextBoss() {
    let boss = await httpsGet("https://api.worldstone.io/world-bosses/")
    return JSON.parse(boss)
}

function convertCountdownToTime(minutes) {
    return moment().tz("Europe/Berlin").add(minutes, "minutes").format()
}

function messageCountdown(name, time) {
    return "The next boss is " + name + " in " + time + " minutes!"
}

function messageWithTime(name, time) {
    return "The next boss is " + name + " in " + time + " minutes at " + convertCountdownToTime(time) + "."
}

export function D4BossApi() {
    this.lastBossMinutes = 0

    this.getMessage = async () => {
        let boss = await getNextBoss()
        return messageWithTime(boss.name, boss.time)
    }

    this.getMessageCountdown = async () => {
        let boss = await getNextBoss()
        let message = null

        if (this.lastBossMinutes < boss.time) {
            message = messageWithTime(boss.name, boss.time)
        }

        if (boss.time < 20) {
            message = messageCountdown(boss.name, boss.time)
        }

        this.lastBossMinutes = boss.time

        return message
    }
}
