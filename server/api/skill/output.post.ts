import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { items } = event.context.formidable.fields
    const { skill, type } = body

    // Check if folder exist
    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase`)
    }

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase/skill/`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase/skill/`)
    }

    if(type.legnth){
        try{
            for(let i=0; i < skill.length; i++){
                const newLevel = `export default {
                    data: [${skill[i]}]
                }
                `     
                
                const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/skill/`,`skill_${type}.js`)
                fs.appendFileSync(filePath, newLevel)
            }

            return { status: 200 }
        }catch(err){
            console.log(err)
            return { status: 500, err }
        }
    }else{
        try{
            for(let i=0; i < skill.length; i++){
                const newLevel = `import skill_sword from "./skill_sword"
                import skill_status from "./skill_status"
                import skill_knife from "./skill_knife"
                import skill_type from "./skill_type"

                export default {
                    ...skill_sword,
                    ...skill_status,
                    ...skill_knife,
                    ...skill_type
                }
                `     
                
                const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/skill/`,`skill.js`)
                fs.appendFileSync(filePath, newLevel)
            }

            return { status: 200 }
        }catch(err){
            console.log(err)
            return { status: 500, err }
        }
    }
})