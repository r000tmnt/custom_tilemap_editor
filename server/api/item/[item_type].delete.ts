import fs from 'node:fs';

export default defineEventHandler(async(event) => {
    console.log("DELETE :>>>", event.context)
    const type = await readBody(event)

    console.log("body :>>> ", type)

    // const type = event.context.formidable.fields

    try {
        // Delete item data
        fs.unlinkSync(`${process.env.DATA_PATH}/item/item_${type}.json`)

        return { status: 200 }
    } catch (error) {
        console.log(error)

        return { status: 500, error }
    }
})