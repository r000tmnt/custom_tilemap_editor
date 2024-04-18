export default defineEventHandler(async(event) => {
    const { fields, files } = event.context.formidable;
    
    console.log("fields :>>>", fields)
    console.log("files :>>>", files)
    
    // const body = await readBody(event)

    // console.log(body)

    // const { type } = body

    // files.forEach((file: any) => {
    //     console.log(file)

    //     const filePath = path.join(process.cwd(), `./public/assets/image/${type}`)

    //     fs.writeFileSync(filePath, file)
    // });

    

    // const relativePath = path.relative(process.cwd(), "./public")
    // const files = fs.readdirSync(`${relativePath}/assets/images/${type}`)
    // const assets = files.map(file => `/assets/images/${type}/${file}`)

    // return { status: 200, assets: assets.filter(a => a.includes(".png")) }
    return { status: 200 }
})