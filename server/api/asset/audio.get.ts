import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async(event) => {
    const query = getQuery(event)

    console.log(query)

    const { type } = query

    const relativePath = path.relative(process.cwd(), "./public")
    const audioPath = (type === "general")? "/assets/audio/" : "/assets/audio/battle"

    try {
        const files = fs.readdirSync(`${relativePath}${audioPath}`)
        const assets = files.map(file => (type === "general")? `/assets/audio/${file}` : `/assets/audio/battle/${file}`)

        return { status: 200, assets: assets.filter(a => a.includes(".mp3") || a.includes(".wav")) }        
    } catch (error) {
        console.log("get audio error :>>>", error)
        return { status: 500, error }    
    }
})