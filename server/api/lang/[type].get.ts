import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler((event) => {
    const params = getRouterParams(event)

    console.log("params:>>> ", params)

    const { type } = params

    // Get file names first
    try{
        // const files = fs.readdirSync(`./locale/${type}/`)
        let files: string[] = []

        files = fs.readdirSync(`${process.env.DATA_PATH}/${type}/`)

        console.log(files)

        return { status: 200, files }
    }catch(error){
        return { status: 500, files: [], error }
    }
})