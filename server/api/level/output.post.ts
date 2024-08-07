import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const pathPrefix = `${process.env.DATA_PATH}/level/`
    const levels = fs.readdirSync(pathPrefix)
    let levelList = ""

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
            const levelName = levels[i].split(".")[0]
            if(!levels[i].includes("test")){
                levelList += `"${levelName}",\n`
            } 
            let content = fs.readFileSync(`${pathPrefix}${levels[i]}`, { encoding: "utf-8" })
            
            const data = JSON.parse(content)

            // Add translate function
            for(let i=0; i < data.event.length; i++){
                for(let j=0, scene = data.event[i].scene; j < scene.length; j++){
                    for(let k=0, dialogue = scene[j].dialogue; k < dialogue.length; k++){
                        const option = dialogue[k].option
        
                        if(option !== undefined){
                            for(let l=0; l < option.length; l++){
                                // Check if the original value exist
                                if(option[l].value.includes(levelName)){
                                    console.log("search value :>>>", option[l].value)
                                    content = content.replace(`"${option[l].value}"`, `t("${option[l].value}")`)
                                }
        
                                for(let m=0, response = option[l].response; m < response.length; m++){
                                    // Check if the original value exist
                                    if(response[m].content.includes(levelName)){
                                        console.log("search value :>>>", response[m].content)
                                        content = content.replace(`"${response[m].content}"`, `t("${response[m].content}")`)
                                    }
                                }
                            }
                        }else{
                            // Check if the original value exist
                            if(dialogue[k].content.includes(levelName))
                                console.log("search value :>>>", dialogue[k].content)
                                content = content.replace(`"${dialogue[k].content}"`, `t("${dialogue[k].content}")`)
                        }
                    }
                }
            }

            console.log("content altered :>>>", content)

            const newLevel = `import { t } from '../../utils/i18n'

            export default ${content}`     
                        
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/level/`, levels[i].replace(".json", ".js"))
            fs.writeFileSync(filePath, newLevel)
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
            fs.writeFileSync(levelCollectorPath, levelCollector)

            const levelListPath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/`,"levelList.js")
        
            console.log("Level list :>>>", levelList)

            const file = `export default {
                data: [
                    ${levelList}
                ]
            }`

            try{
                fs.writeFileSync(levelListPath, file)
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