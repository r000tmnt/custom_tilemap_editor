import { eventSceneModel, levelEventModel } from '~/types/level';
import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    // console.log("POST :>>>", event)

    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { type, name, en, zh } = event.context.formidable.fields
    const { type, name, en, zh } = body

    try{
        const enFilePath = path.join(process.cwd(), `locale/${type}/`,`${name}_en.json`)
        const zhFilePath = path.join(process.cwd(), `locale/${type}/`,`${name}_zh.json`)

        fs.writeFileSync(enFilePath, JSON.stringify(en))
        fs.writeFileSync(zhFilePath, JSON.stringify(zh))

        // Get level data
        const filePath = path.join(process.cwd(), `${process.env.DATA_PATH}/level/`, `${name}.json`)

        const data = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }))

        let dialogueCount = 1, optionCount = 1

        // Alter event scene dialogue string to get translation
        for(let i=0; i < data.event.length; i++){
            for(let j=0, scene = data.event[i].scene; j < scene.length; j++){
                for(let k=0, dialogue = scene[j].dialogue; k < dialogue.length; k++){
                    const option = dialogue[k].option
    
                    if(option !== undefined){
                        for(let l=0; l < option.length; l++){
                            // Check if the original value exist
                            if(option[l].value.length){
                                option[l].value = `${name}.option_${optionCount}.value`
                            }
    
                            for(let m=0, response = option[l].response; m < response.length; m++){
                                // Check if the original value exist
                                if(response[m].content.length)
                                    response[m].content = `${name}.option_${optionCount}.response.${m}`
                            }

                            optionCount += 1
                        }
                    }else{
                        // Check if the original value exist
                        if(dialogue[k].content.length)
                            dialogue[k].content = `${name}.dialogue_${dialogueCount}`
                            dialogueCount += 1
                    }
                }
            }
        }

        console.log(data)

        // Apply the changes to the file
        fs.writeFileSync(filePath, JSON.stringify(data))

        return { status: 200 }
    }catch(error){
        console.log(error)
        return { status: 500, error }
    }


})