import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const pathPrefix = `${process.env.DATA_PATH}/mob/`
    // Get the list of skill data file
    const mobs = fs.readdirSync(pathPrefix)

    console.log(mobs)

    // Check if folder exist
    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase`)
    }

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase/mob/`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase/mob/`)
    }

    try{
        for(let i=0; i < mobs.length; i++){
            const content = fs.readFileSync(`${pathPrefix}${mobs[i]}`, { encoding: "utf-8" })

            const newMob = `export default ${content}`     
            
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/mob/`, mobs[i].replace(".json", ".js"))
            fs.writeFileSync(filePath, newMob)
        }

        // Generate the collector file
        try{
            let moblist = ""
            let mobExpand = ""
            for(let i=0; i < mobs.length; i++){
                const mobName = mobs[i].split(".")[0]
                moblist += `import ${mobName} from "./mob/${mobName}"\n`
                mobExpand += `...${mobName},\n`
            }

            const classCollector = `${moblist}
                export default {
                    data: [
                        ${mobExpand}
                    ],

                getAll(){
                    return this.data
                },

                getOne(id){
                    return this.data.find(c => c.id === id)
                },

                search(keyWord){
                    return this.data.filter(c => c.name.includes(keyWord))
                }
            }
            `

            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/`,`mob.js`)
            fs.writeFileSync(filePath, classCollector)

            return { status: 200 }
        }catch(error){
            console.log(error)
            return { status: 500, error }
        }            
    }catch(error){
        console.log(error)
        return { status: 500, error }
    }

})