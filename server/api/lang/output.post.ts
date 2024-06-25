import fs from 'node:fs';
import path from 'node:path';
import copyFile from '~/server/utils/copyFile';

export default defineEventHandler(async() => {
    // Copy anything under the locale directory to outPut directory

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/locale`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/locale`)
    }

    try {
        const relativePath = path.relative(process.cwd(), "./locale")

        console.log("relativePath :>>>", relativePath)

        const entries = fs.readdirSync(relativePath, { recursive: true, withFileTypes: true })

        console.log("entries :>>>", entries)

        for(let entry of entries){
            copyFile("locale", relativePath, entry, true)
        }

        return { status: 200 }        
    } catch (error) {
        console.log("Output locale failed: ", error)
        return { status: 500, error }
    }
})