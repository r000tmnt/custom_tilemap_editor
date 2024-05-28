import fs from 'node:fs';
import path from 'node:path';
import formidable from 'formidable';

export default defineEventHandler(async(event) => {
    const form = formidable({ multiples: true })

    const result = new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
            console.log("fields :>>>", fields)
            // console.log("files :>>>", files)    
            
            if(err){
                reject({ status: 500, error: err })
            }

            if(files){
                let fileCount = 0

                const loopFile = () => {
                    const file = files[String(fileCount)]

                    if(file){
                        // If file Exist
                        console.log("file :>>>", file[0])
                        const { filepath, originalFilename } = file[0]
                        const { type } = fields
                        const newfilePath = path.join(process.cwd(), `./public/assets/images/${type? type[0]: 'env'}`, originalFilename? originalFilename : `${String(Date.now())}.png`)

                        try {
                            const rawData = fs.readFileSync(filepath)
                            fs.writeFile(newfilePath, rawData, function(err){
                                console.log("write file err:>>>", err)
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

            // const { type } = fields
        })
    })

    return result
})