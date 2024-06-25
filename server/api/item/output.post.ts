import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const pathPrefix = `${process.env.DATA_PATH}/item/`
    // Get the list of item data file
    const items = fs.readdirSync(pathPrefix)

    console.log(items)

    // Check if folder exist
    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase`)
    }

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase/item/`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase/item/`)
    }

    try{
        for(let i=0; i < items.length; i++){
            const content = fs.readFileSync(`${pathPrefix}${items[i]}`, { encoding: 'utf-8' })

            const newItem = `export default {
                data: ${content},

                getAll(){
                    return this.data
                },

                getOne(id){
                    return this.data.find(a => a.id === id)
                },

                search(keyWord){
                    return this.data.filter(a => a.name.includes(keyWord))
                }
            }
            `     
            
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/item/`,items[i].replace(".json", ".js"))
            fs.writeFileSync(filePath, newItem)
        }

        return { status: 200 }
    }catch(error){
        console.log(error)
        return { status: 500, error }
    }
})