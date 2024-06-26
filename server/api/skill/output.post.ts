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
        let skillList = ""
        let skillExpand = ""
        for(let i=0; i < skill.length; i++){
            const content = fs.readFileSync(`${pathPrefix}${skill[i]}`, { encoding: "utf-8" })

            const newSkill = `export default ${content}`     

            const skillName = skill[i].split(".")[0]

            skillList += `import ${skillName} from "./skill/${skillName}"\n`
            skillExpand += `...${skillName},\n`
            
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/skill/`, skill[i].replace(".json", ".js"))
            fs.writeFileSync(filePath, newSkill)
        }

        // Generate the collector file
        try{
            const skillCollector = `${skillList}

            export default {
                data: [
                    ${skillExpand}
                ],

                getAll(){
                    return this.data
                },

                getOne(id){
                    return this.data.find(s => s.id === id)
                },

                search(keyWord){
                    return this.data.filter(s => s.name.includes(keyWord))
                }
            }
            `     
            
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/`,`skill.js`)
            fs.writeFileSync(filePath, skillCollector)

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