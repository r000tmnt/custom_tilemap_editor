import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async(event) => {
    const query = getQuery(event)

    console.log(query)

    const { type } = query

    const relativePath = path.relative(process.cwd(), "./public")

    try {
        const files = fs.readdirSync(`${relativePath}/assets/images/${type}`)
        const assets = files.map(file => `/assets/images/${type}/${file}`)

        return { status: 200, assets: assets.filter(a => a.includes(".png")) }        
    } catch (error) {
        console.log("get image asset error :>>>", error)
        return { status: 500, error }   
    }
})