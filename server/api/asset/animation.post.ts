import fs from 'node:fs';
import path from 'node:path';
import formidable from 'formidable';

export default defineEventHandler(async(event) => {
    const form = formidable({ multiples: true })

    const result = new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            // console.log("fields :>>>", fields)
            // console.log("files :>>>", files)    
            
            if(err){
                reject({ status: 500, error: err })
            }

            const { type, target, name, level } = fields

            let fileCount = 0

            if(files){
                const loopFile = () => {
                    const file = files[String(fileCount)]

                    if(file){
                        // If file Exist
                        console.log("file :>>>", file[0])
                        const { filepath } = file[0]

                        const newFileName = `${type}_${target}_${level}_${name}_${fileCount + 1}.png`

                        const pathPrefix = `./public/assets/images/${target}/animation`

                        const newfilePath = path.join(process.cwd(), pathPrefix, newFileName)

                        try {
                            const rawData = fs.readFileSync(filepath)
                            fs.writeFile(newfilePath, rawData, function(err){
                                if(err){
                                    console.log("write file err:>>>", err)
                                }
                            })
                            fileCount += 1
                            loopFile()                            
                        } catch (error) {
                            reject({ status: 500, error })
                        }
                    }else{
                        // If file not exist
                        resolve({ status: 200 })
                    }
                }
                loopFile()

            }
        })
    })

    return result
})