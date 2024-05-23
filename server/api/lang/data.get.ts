import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler((event) => {
    const query = getQuery(event)

    console.log(query)

    const { type, name } = query

    // Get both en and zh translation
    try{
        let enFilePath = "", zhFilePath = ""

        switch(type){
            case "class":
                enFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).split("_")[0]}_en.json`)
                zhFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).split("_")[0]}_zh.json`)
            break;
            case "item": case "level":
                enFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).replace(".json", "_en.json")}`)
                zhFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).replace(".json", "_zh.json")}`)
            break;
            case "skill":
                // And more...
                const statusKeyWord = {
                    buff: /(foucs)/,
                    debuff: /(poison)/
                }

                if(statusKeyWord.buff.test(String(name))){
                    enFilePath = path.join(process.cwd(), `locale/${type}`, "buff_en.json")
                    zhFilePath = path.join(process.cwd(), `locale/${type}`, "buff_zh.json")
                }else if(statusKeyWord.debuff.test(String(name))){
                    enFilePath = path.join(process.cwd(), `locale/${type}`, "debuff_en.json")
                    zhFilePath = path.join(process.cwd(), `locale/${type}`, "debuff_zh.json")
                }else{
                    enFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).split("_")[1]}_en.json`)
                    zhFilePath = path.join(process.cwd(), `locale/${type}`, `${String(name).split("_")[1]}_zh.json`)
                }
            break; 
        }
        
        const enData = fs.readFileSync(enFilePath, { encoding: 'utf-8' })
        const zhData = fs.readFileSync(zhFilePath, { encoding: 'utf-8' })

        console.log("data:>>> ", enData)
        console.log("data:>>> ", zhData)

        return { status: 200, data: { en: JSON.parse(enData), zh: JSON.parse(zhData) } }       
    }catch(err){
        return { status: 500, err }
    }
})