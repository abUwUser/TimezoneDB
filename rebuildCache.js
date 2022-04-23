const fs = require("fs/promises")
const path = require("path")
require('dotenv').config()

let cache = {
    lastID: undefined,
    usernames: {},
    ids: {
        discord: {}
    }
}

const setLastId = async () => {
    const files = await fs.readdir(path.join(process.env.DB_FOLDER))

    const ids = files.filter(file => file !== "cache.json")
                    .map(file => parseInt(file.split(".")[0]))
                    .sort()

    cache.lastID = ids[ids.length - 1]
}

const setUsernames = async () => {
    const files = (await fs.readdir(path.join(process.env.DB_FOLDER))).filter(file => file !== "cache.json")

    for (file of files) {
        const fileName = file.split(".")[0]
        console.log("Getting the username for " + fileName)
        const data = JSON.parse(await fs.readFile(path.join(process.env.DB_FOLDER, file), "utf8"))
        cache.usernames[data.username] = fileName
    }
}

const setIDs = async () => {
    const files = (await fs.readdir(path.join(process.env.DB_FOLDER))).filter(file => file !== "cache.json")
    for (file of files) {
        const fileName = file.split(".")[0]
        console.log("Getting the parallel services' ID for " + fileName)
        const data = JSON.parse(await fs.readFile(path.join(process.env.DB_FOLDER, file), "utf8"))
        if(!data.ids?.discord) continue
        cache.ids.discord[data.ids.discord] = file.split(".")[0]
    }
}

(async () => {
    console.log("Setting last ID...")
    await setLastId()

    console.log("\nSetting usernames...")
    await setUsernames()
    
    console.log("\nSetting IDs...")
    await setIDs()

    await fs.writeFile(path.join(process.env.DB_FOLDER, "cache.json"), JSON.stringify(cache), "utf8")
})()