import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler(() => {
    try{
        const files = fs.readdirSync(`${process.env.DATA_PATH}/level/`)

        console.log(files)

        return { status: 200, files }
    }catch(error){
        return { status: 500, files: [], error }
    }
})