import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler(() => {
    try{
        const mobs = fs.readFileSync(`${process.env.DATA_PATH}/mobs.json`, { encoding: 'utf-8' })

        console.log(mobs)

        return { status: 200, mobs: JSON.parse(mobs) }
    }catch(err){
        return { status: 500, mobs: [], err }
    }
})