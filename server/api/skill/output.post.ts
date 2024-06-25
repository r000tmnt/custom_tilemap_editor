import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const pathPrefix = `${process.env.DATA_PATH}/skill/`
    // Get the list of skill data file
    const skill = fs.readdirSync(pathPrefix)

    console.log(skill)

    // Check if folder exist
    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase`)
    }

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase/skill/`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase/skill/`)
    }

    try{
        for(let i=0; i < skill.length; i++){
            const content = fs.readFileSync(`${pathPrefix}${skill[i]}`, { encoding: "utf-8" })

            const newLevel = `export default {
                data: ${content}
            }
            `     
            
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/skill/`, skill[i])
            fs.appendFileSync(filePath, newLevel)
        }

        // Generate the collector file
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
                
                const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/`,`skill.js`)
                fs.appendFileSync(filePath, newLevel)
            }

            return { status: 200 }
        }catch(error){
            console.log(error)
            return { status: 500, error }
        }            
        // return { status: 200 }
    }catch(error){
        console.log(error)
        return { status: 500, error }
    }

})