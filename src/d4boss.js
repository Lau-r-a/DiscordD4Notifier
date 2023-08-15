import * as https from "https"

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
export async function getNextBoss() {
    let boss = await httpsGet("https://api.worldstone.io/world-bosses/")
    return JSON.parse(boss)
}
