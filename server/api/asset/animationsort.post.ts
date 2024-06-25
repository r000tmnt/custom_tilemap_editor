import fs from 'node:fs'
import path from 'node:path'

import getFrame from '~/server/utils/getFrame'

export default defineEventHandler(async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    const { oldIndex, newIndex, type, oldFileName } = body

    const animationTypeArr = oldFileName.split("_")

    const level = `${animationTypeArr[1]}_${animationTypeArr[2]}_${animationTypeArr[3]}`

    try {
        const relativePath = path.relative(process.cwd(), "./public")
        const pathPrefix = `${relativePath}/assets/images/${type}/animation`
        // Get files with simillar name
        const frames = getFrame(pathPrefix, level)

        const fileToExchange1 = `${pathPrefix}/${animationTypeArr[0]}_${animationTypeArr[1]}_${animationTypeArr[2]}_${animationTypeArr[3]}_${newIndex + 1}.png`

        const fileToExchange2 = `${pathPrefix}/${oldFileName}`

        const tempFileName = `${pathPrefix}/${animationTypeArr[0]}_${animationTypeArr[1]}_${animationTypeArr[2]}_${animationTypeArr[3]}_${frames.length + 1}.png`

        // Rename files
        fs.rename(fileToExchange1, tempFileName, function (err) {
            if(err){
                console.log(`Rename ${fileToExchange1} failed :>>>`, err)
            }else{
                console.log("Rename first time compelete")

                fs.rename(fileToExchange2, fileToExchange1, function (err) {
                    if(err){
                        console.log(`Rename ${oldFileName} failed :>>>`, err)
                    }else{
                        console.log("Rename second time compelete")

                        // Rename the first file back to the order
                        fs.rename(tempFileName, fileToExchange2, function (err) {
                            if(err){
                                console.log(`Rename ${tempFileName} failed :>>>`, err)
                            }else{
                                console.log("Rename third time compelete")
                            }
                        })
                    }
                })
        
            }
        })

        return { status: 200,  }        
    } catch (error) {
        return { status: 500, error }  
    }
})