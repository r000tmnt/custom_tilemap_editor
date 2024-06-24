import fs from 'node:fs';
import { classDataModel } from '~/types/character';
// import path from 'node:path';

export default defineEventHandler((event) => {
    // const query = getQuery(event)

    // console.log(query)

    // const { target} = query
    try{
        const pathPrefix = `${process.env.DATA_PATH}/class/`

        const files = fs.readdirSync(pathPrefix)

        const data : classDataModel[] = []

        for(let i=0; i < files.length; i++){
            const job = fs.readFileSync(`${pathPrefix}${files[i]}`, { encoding: 'utf-8' })

            data.push(JSON.parse(job))
        }

        console.log(data)

        return { status: 200, data }
    }catch(err){
        return { status: 500, data: [], err }
    }
})