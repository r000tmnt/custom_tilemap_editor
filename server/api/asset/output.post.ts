import fs from 'node:fs';
import path from 'node:path';
import copyFile from '~/server/utils/copyFile';

export default defineEventHandler(async() => {
    // Copy anything under the locale directory to outPut directory

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/assets`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/assets`)
    }

    try {
        const relativePath = path.relative(process.cwd(), "./public")

        console.log("relativePath :>>>", relativePath)

        const entries = fs.readdirSync(relativePath, { recursive: true, withFileTypes: true })

        console.log("entries :>>>", entries)

        for(let entry of entries){
            copyFile("public", relativePath, entry, false)
        }

        return { status: 200 }        
    } catch (error) {
        console.log("Output assets failed: ", error)
        return { status: 500, error }
    }
})