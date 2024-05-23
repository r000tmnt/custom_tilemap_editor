import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler((event) => {
    const query = getQuery(event)

    console.log(query)

    const { target} = query
    try{
        const mobs = fs.readFileSync(`${process.env.DATA_PATH}/class/class_${target}.json`, { encoding: 'utf-8' })

        console.log(mobs)

        return { status: 200, mobs: JSON.parse(mobs) }
    }catch(err){
        return { status: 500, mobs: [], err }
    }
})