import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler((event) => {
    const query = getQuery(event)

    console.log("query :>>> ", query)

    const { folder } = query

    console.log(`${process.env.URL}${folder}`)

    try{
        const files = fs.readdirSync(`${folder}`)

        console.log(files)

        return { status: 200, files }
    }catch(err){
        return { status: 500, files: [], err }
    }


})