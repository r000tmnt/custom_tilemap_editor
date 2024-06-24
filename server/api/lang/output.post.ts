import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async() => {
    // Copy anything under the locale directory to outPut directory
    try {
        const entries = fs.readdirSync("./locale", { recursive: true, withFileTypes: true })

        for(let entry of entries){
            let src = path.join(entry.path, entry.name)
            let destPath = src.replace("./locale", `./${process.env.OUTPUT_PATH}`)
            let destDir = path.dirname(destPath)

            if(entry.isFile()){
                fs.mkdirSync(destDir, { recursive: true })
                fs.copyFile(src, destPath, (err) => { console.log("copy file failed: ", err) })
            }
        }

        return { status: 200 }        
    } catch (error) {
        console.log("api failed: ", error)
    }
})