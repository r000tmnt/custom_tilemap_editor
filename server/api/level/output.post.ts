import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const pathPrefix = `${process.env.DATA_PATH}/level/`
    const levels = fs.readdirSync(pathPrefix)

    console.log(levels)

    // Check if folder exist
    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase`)
    }

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase/level/`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase/level/`)
    }


    try{
        for(let i=0; i < levels.length; i++){
            const content = fs.readFileSync(`${pathPrefix}${levels[i]}`, { encoding: "utf-8" })
            const newLevel = `import { t } from '../../utils/i18n'

            export default {
                ${content}
            }`     
                        
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/level/`, levels[i].replace(".json", ".js"))
            fs.appendFileSync(filePath, newLevel)
        }

        // Generate level collector
        const levelCollector = `
        ${`/**
        * Place the conversation event at the beginning of the event array and state the trigger value as "auto"
        * Other event like drop item or character interation are place after conversation event
        */`}
        export default {
            data: [],
            
            getAll(){
                return this.data
            },

            getOne(id){
                return this.data.find(k => k.id === id)
            },

            search(keyWord){
                return this.data.filter(k => k.name.includes(keyWord))
            },

            getTile(id, row, col){
                const map = this.data.find(l => l.id === id).map
        
                return map[row][col]
            },

            ${`/**
            * Loading level data from the pointed path
            * @param {string} id - The id of the level 
            */`}
            async load(id){
                const index = this.data.findIndex(k => k.id === id)
                const levelData = await import(${"`" + "./level/" + "${" + "id" + "}" + ".js" + "`"})
        
                console.log('level data:>>> ', levelData)
        
                if(index >= 0){
                    this.data[index] = {...levelData.default}
                }else{
                    this.data.push({...levelData.default})
                }
        
                console.log('level :>>>', this.data)
            }
        }
        `

        const levelCollectorPath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/`,"level.js")

        try {
            fs.appendFileSync(levelCollectorPath, levelCollector)

            // Generate level list
            const levelList = levels.map(lv => {
                if(!lv.includes("test")){
                    return lv.split(".json")
                }
            })

            const levelListPath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/`,"levelList.js")
        
            console.log("Level list :>>>", levelList)

            const file = `export default {
                data: ${levelList}
            }`

            try{
                fs.appendFileSync(levelListPath, file)
                return { status: 200 }
            }catch(error){
                console.log("Generate level list error :>>>", error)
                return { status: 500, error }
            }

        } catch (error) {
            console.log("Generate level collector error :>>>", error)
            return { status: 500, error }
        }
    }catch(error){
        console.log("Output level data error :>>>", error)
        return { status: 500, error }
    }
})