import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler((event) => {
    const params = getRouterParams(event)

    console.log("params:>>> ", params)

    const { type } = params

    try{
        const files = fs.readdirSync(`../../../locale/${type}/`)

        console.log(files)

        return { status: 200, files }
    }catch(err){
        return { status: 500, files: [], err }
    }
})