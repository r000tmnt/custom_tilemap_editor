import fs from 'node:fs';

export default defineEventHandler(async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    const { id } = body

    try {
        fs.unlinkSync(`${process.env.DATA_PATH}${id}.json`)

        return { status: 200 }
    } catch (error) {
        console.log(error)

        return { status: 500 }
    }
})