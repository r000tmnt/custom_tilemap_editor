import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async(event) => {
    const query = getQuery(event)

    console.log(query)

    const { type } = query

    const relativePath = path.relative(process.cwd(), "./public")
    const audioPath = (type === "general")? "/assets/audio/" : "/assets/audio/battle"
    const files = fs.readdirSync(`${relativePath}${audioPath}`)
    const assets = files.map(file => `/assets/audio/${file}`)

    return { status: 200, assets: assets.filter(a => a.includes(".mp3") || a.includes(".wav")) }
})