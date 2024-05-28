import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    // console.log("POST :>>>", event)

    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { skill, type } = event.context.formidable.fields
    const { skill, type } = body
    try{
        const filePath = path.join(process.cwd(), `${process.env.DATA_PATH}/skill/`,`skill_${type}.json`)

        // Create or update the file
        fs.writeFileSync(filePath, skill)

        return { status: 200 }
    }catch(err){
        console.log(err)
        return { status: 500, err }
    }


})