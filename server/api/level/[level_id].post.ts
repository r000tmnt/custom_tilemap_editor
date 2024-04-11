import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    try{
        const newLevel = `import { t } from '../../utils/i18n'

        export default {
            ${body}
        }`

        const filePath = path.join(process.cwd(), `${process.env.OUTPUT_PATH}/level/`,`${body.id}.js`)

        fs.appendFileSync(filePath, newLevel)

        return { status: 200 }
    }catch(err){
        console.log(err)
        return { status: 500, err }
    }


})