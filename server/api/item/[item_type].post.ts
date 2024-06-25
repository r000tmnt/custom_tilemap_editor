import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    console.log("POST :>>>", event)

    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { item, type } = event.context.formidable.fields
    const { item, type } = body

    // console.log(`${process.env.URL}${folder}`)

    try{
        const filePath = path.join(process.cwd(), `${process.env.DATA_PATH}/item/`,`item_${type}.json`)

        // Create or update the file
        fs.writeFileSync(filePath, item)

        return { status: 200 }
    }catch(error){
        console.log(error)
        return { status: 500, error }
    }


})