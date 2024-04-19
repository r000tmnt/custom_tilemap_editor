import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler(() => {
    try{
        const mobs = fs.readFileSync(`${process.env.DATA_PATH}/mobs.json`)

        console.log(mobs)

        return { status: 200, mobs }
    }catch(err){
        return { status: 500, mobs: [], err }
    }
})