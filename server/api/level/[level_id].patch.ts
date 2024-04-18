import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    // const body = await readBody(event)

    // console.log("body :>>> ", body)

    const { id } = event.context.formidable.fields

    try{
        const filePath = path.join(process.cwd(), `${process.env.DATA_PATH}/level/`,`${id}.json`)

        fs.writeFileSync(filePath, JSON.stringify(event.context.formidable.fields))

        return { status: 200 }
    }catch(err){
        console.log(err)
        return { status: 500, err }
    }


})