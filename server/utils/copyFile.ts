import fs from "node:fs"
import path from "node:path"

/**
 * Copy files in the folder to the destination
 * @param source - The directory of the source files
 * @param relativePath - The path to inspect
 * @param entry - Each entry in the folder
 * @param extra - If the source directory is used for tools other then the framework (In this case, is Nuxt 3)
 */
export default function copyFile (source: string, relativePath: string, entry: fs.Dirent, extra: boolean) {
    let src = path.join(`${relativePath}/`, entry.name)
    let destPath = src.replace(source, `${extra? `${process.env.OUTPUT_PATH}/${source}`: process.env.OUTPUT_PATH}`)

    console.log("original path :>>>", src)
    console.log("destPath :>>>", destPath)

    // If the entry is a file
    if(entry.isFile()){
        fs.copyFile(src, destPath, (err) => { if(err) console.log("copy file failed: ", err) })
    }else{
        // If the directory doesn't exist
        if(!fs.existsSync(destPath)){
            // Create directory
            fs.mkdirSync(destPath)
        }

        const subEntries = fs.readdirSync(src, { recursive: true, withFileTypes: true })

        console.log("subEntries :>>>", subEntries)

        // Loop the subfolder entries
        subEntries.forEach(subFiles => {
            copyFile(source, src, subFiles, extra)
        })
    }
}