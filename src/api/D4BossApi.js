import moment from "moment-timezone"
import Https from "../util/Https.js"

async function getNextBoss() {
    let boss = await new Https().httpsGet("https://api.worldstone.io/world-bosses/")
    return JSON.parse(boss)
}

function timeToString(time) {
    return time.format("h:mm:ss a")
}

function timeToMinutesLeft(time) {
    return time.diff(moment().tz("Europe/Berlin"), "minutes")
}

function countdownToTime(minutes) {
    return moment().tz("Europe/Berlin").add(minutes, "minutes")
}

function messageCountdown(name, time) {
    return "The next boss is " + name + " in " + timeToMinutesLeft(time) + " minutes!"
}

function messageWithTime(name, time) {
    return "The next boss is " + name + " in " + timeToMinutesLeft(time) + " minutes at " + timeToString(time) + "."
}

export function D4BossApi() {
    this.bossName
    this.bossTime

    this.getMessage = async () => {
        if (this.bossTime === undefined || moment().tz("Europe/Berlin").isAfter(this.bossTime)) {
            let boss = await getNextBoss()

            this.bossTime = countdownToTime(boss.time)
            this.bossName = boss.name
        }
        return messageWithTime(this.bossName, this.bossTime)
    }

    this.getMessageCountdown = async () => {
        let message = null

        if (this.bossTime === undefined || moment().tz("Europe/Berlin").isAfter(this.bossTime)) {
            message = this.getMessage()
            console.log(await message)
        } else if (this.bossTime != undefined && timeToMinutesLeft(this.bossTime) < 20) {
            message = messageCountdown(this.bossName, this.bossTime)
        }

        return message
    }
}
