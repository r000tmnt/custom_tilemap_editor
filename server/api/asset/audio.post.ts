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
                        console.log("file :>>>", file[0])
                        fileCount += 1
                        loopFile()
                    }
                }
                loopFile()
            }

            // const { type } = fields
        })
    })
    

    // files.forEach((file: any) => {
    //     console.log(file)
    //     const filePath = path.join(process.cwd(), `./public/assets/audio/${type}`)

    //     fs.writeFileSync(filePath, file)
    // });
    return { status: 200 }
})