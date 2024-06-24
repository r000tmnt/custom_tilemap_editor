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

            const { type } = fields

            if(type){
                if(files){
                    let fileCount = 0

                    const loopFile = () => {
                        const file = files[String(fileCount)]

                        if(file){
                            // If file Exist
                            console.log("file :>>>", file[0])
                            const { filepath, originalFilename } = file[0]

                            console.log("audio")
                            const pathPrefix = `./public/assets/audio/${type[0].includes("battle")? 'battle' : ''}`

                            const newfilePath = path.join(process.cwd(), pathPrefix, originalFilename? originalFilename : `${String(Date.now())}.png`)

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
            }else{
                reject({ status: 500, error: "type is not defined" })
            }
        })
    })

    return result
})