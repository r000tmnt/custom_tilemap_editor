import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async(event) => {
    const query = getQuery(event)

    console.log(query)

    const { type } = query

    const relativePath = path.relative(process.cwd(), "./public")
    const files = fs.readdirSync(`${relativePath}/assets/images/${type}`)
    const assets = files.map(file => `/_nuxt/${relativePath}/assets/images/${file}`)

    return { status: 200, assets }
})