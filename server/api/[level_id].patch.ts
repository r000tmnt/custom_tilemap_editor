import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    try{
        const filePath = path.join(process.cwd(), `${process.env.DATA_PATH}`,`${body.id}.json`)

        fs.writeFileSync(filePath, JSON.stringify(body))

        return { status: 200 }
    }catch(err){
        console.log(err)
        return { status: 500, err }
    }


})