import fs from 'node:fs';

export default defineEventHandler(async(event) => {
    // console.log("DELETE :>>>", event.context)
    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { id } = event.context.formidable.fields
    const { id } = body

    try {
        fs.unlinkSync(`${process.env.DATA_PATH}/level/${id}.json`)

        return { status: 200 }
    } catch (error) {
        console.log(error)

        return { status: 500 }
    }
})