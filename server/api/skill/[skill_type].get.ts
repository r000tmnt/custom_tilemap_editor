import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async(event) => {
    const params = getRouterParams(event)

    console.log("params:>>> ", params)

    const { item_type } = params
    
    const { DATA_PATH } = process.env

    try {
        const filePath = path.join(process.cwd(), `${DATA_PATH}/skill/`, `skill_${item_type}.json`)

        const data = fs.readFileSync(filePath, { encoding: 'utf-8' })

        // const data = await import(`../../${DATA_PATH}${level_id}.json`)

        console.log("data:>>> ", data)

        // console.log(JSON.parse(data.split("default")[0]))

        return { status: 200, data: JSON.parse(data) }        
    } catch (error) {
        console.log(error)

        return { status: 500 }
    }

})