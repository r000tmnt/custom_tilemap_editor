import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { items } = event.context.formidable.fields
    const { items, type } = body

    // Check if folder exist
    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase`)
    }

    if(!fs.existsSync(`${process.env.OUTPUT_PATH}/dataBase/item/`)){
        fs.mkdirSync(`${process.env.OUTPUT_PATH}/dataBase/item/`)
    }

    try{
        for(let i=0; i < items.length; i++){
            const newLevel = `import { t } from '../../utils/i18n'

            export default {
                data: [${items[i]}]
            },

            getAll(){
                return this.data
            },

            getOne(id){
                return this.data.find(a => a.id === id)
            },

            search(keyWord){
                return this.data.filter(a => a.name.includes(keyWord))
            }
            `     
            
            const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/dataBase/item/`,`item_${type}.js`)
            fs.appendFileSync(filePath, newLevel)
        }

        return { status: 200 }
    }catch(err){
        console.log(err)
        return { status: 500, err }
    }


})