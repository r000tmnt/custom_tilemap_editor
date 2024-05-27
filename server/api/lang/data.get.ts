import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler((event) => {
    const query = getQuery(event)

    console.log(query)

    const { type, name } = query

    // Get both en and zh translation
    try{
        let enFilePath = "", zhFilePath = ""

        enFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).replace(".json", "_en.json")}`)
        zhFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).replace(".json", "_zh.json")}`)
        
        const enData = fs.readFileSync(enFilePath, { encoding: 'utf-8' })
        const zhData = fs.readFileSync(zhFilePath, { encoding: 'utf-8' })

        console.log("data:>>> ", enData)
        console.log("data:>>> ", zhData)

        return { status: 200, data: { en: JSON.parse(enData), zh: JSON.parse(zhData) } }       
    }catch(err){
        return { status: 500, err }
    }
})