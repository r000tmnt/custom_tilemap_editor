import fs from 'node:fs';
import { mobDataModel } from '~/types/character';
// import path from 'node:path';

export default defineEventHandler((event) => {
    // const query = getQuery(event)

    // console.log(query)

    // const { target } = query
    try{
        const pathPrefix = `${process.env.DATA_PATH}/mob/`

        const files = fs.readdirSync(pathPrefix)

        const data : mobDataModel[] = []

        for(let i=0; i < files.length; i++){
            const mob = fs.readFileSync(`${pathPrefix}${files[i]}`, { encoding: 'utf-8' })

            data.push(JSON.parse(mob))
        }

        console.log(data)

        return { status: 200, data }
    }catch(error){
        return { status: 500, error }
    }
})