import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler((event) => {
    const query = getQuery(event)

    console.log(query)

    const { target } = query
    try{
        const data = fs.readFileSync(`${process.env.DATA_PATH}/mob/mob_${target}.json`, { encoding: 'utf-8' })

        console.log(data)

        return { status: 200, data: JSON.parse(data) }
    }catch(err){
        return { status: 500, data: [], err }
    }
})