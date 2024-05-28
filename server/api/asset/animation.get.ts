import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async(event) => {
    const query = getQuery(event)

    console.log(query)

    const { type } = query

    try {
        const relativePath = path.relative(process.cwd(), "./public")
        const files = fs.readdirSync(`${relativePath}/assets/images/${type}/animation`)
        const assets = files.map(file => `/assets/images/${type}/animation/${file}`)

        return { status: 200, assets }        
    } catch (error) {
        return { status: 200, error }  
    }
})