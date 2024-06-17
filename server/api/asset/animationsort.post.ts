import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    const { oldIndex, newIndex, type, oldFileName } = body

    try {
        // const relativePath = path.relative(process.cwd(), "./public")
        // const files = fs.readdirSync(`${relativePath}/assets/images/${type}/animation`)
        // const assets = files.map(file => `/assets/images/${type}/animation/${file}`)

        return { status: 200,  }        
    } catch (error) {
        return { status: 200, error }  
    }
})