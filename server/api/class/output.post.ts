import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const pathPrefix = `${process.env.DATA_PATH}/class/`
    // Get the list of skill data file
    const classes = fs.readdirSync(pathPrefix)

    console.log(classes)

    // Check if folder exist
    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase`)
    }

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase/class/`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase/class/`)
    }

    try{
        for(let i=0; i < classes.length; i++){
            const content = fs.readFileSync(`${pathPrefix}${classes[i]}`, { encoding: "utf-8" })

            const newClass = `export default ${content}`     
            
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/class/`, classes[i].replace(".json", ".js"))
            fs.writeFileSync(filePath, newClass)
        }

        // Generate the collector file
        try{
            let classlist = ""
            let classExpand = ""
            for(let i=0; i < classes.length; i++){
                const className = classes[i].split(".")[0]
                classlist += `import ${className} from "./class/${className}"\n`
                classExpand += `...${className},\n`
            }

            const classCollector = `${classlist}
                export default {
                    data: [
                        ${classExpand}
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

            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/`,`class.js`)
            fs.appendFileSync(filePath, classCollector)

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