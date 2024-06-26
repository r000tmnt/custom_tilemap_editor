import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    // console.log("POST :>>>", event)

    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { type, name, en, zh } = event.context.formidable.fields
    const { type, name, en, zh } = body

    try{
        const enFilePath = path.join(process.cwd(), `locale/${type}/`,`${name}_en.json`)
        const zhFilePath = path.join(process.cwd(), `locale/${type}/`,`${name}_zh.json`)

        fs.writeFileSync(enFilePath, JSON.stringify(en))
        fs.writeFileSync(zhFilePath, JSON.stringify(zh))

        return { status: 200 }
    }catch(error){
        console.log(error)
        return { status: 500, error }
    }


})