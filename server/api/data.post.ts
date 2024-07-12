import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    // console.log("POST :>>>", event)

    const body = await readBody(event)

    console.log("body :>>> ", body)

    // const { id, name, width, height } = event.context.formidable.fields
    const { id, name, width, height } = body

    // The multi-dimentional array to define which asset to draw
    // [ [asset number] ]
    const newMap: number[][] = []
    // The multi-dimentional array to define the depth of each tile
    // [ [walkable, depth] ]
    const depth: number[][] = []

    for(let i=0; i < Number(height); i++){
        const row : number[] = []
        newMap.push(row)
        depth.push(row)

        for(let j=0; j < Number(width); j++){
            newMap[i].push(0)
            depth[i].push(1) // Default to be walkable
            depth[i].push(0) // Default to be ground level
        }
    }

    try{
        const newLevel = `{
            "id": "${id}",
            "name": "${name}",
            "map": ${JSON.stringify(newMap)},
            "audio": "", 
            "assets": [
                ""
            ],
            "phase": [ "conversation", "titleCard", "battle", "conversation", "end" ],
            "event": [],
            "enemy": [],
            "player": [],
            "objective": {
                "victory": {
                    "target": "enemy",
                    "value": 0
                },
                "fail": {
                    "target": "player",
                    "value": 0
                },
                "optional": [
                    {
                        "target": "turn",
                        "value": 6,
                        "prize": [
                            { 
                                "id": "currency_1",
                                "type": 1,
                                "amount": 100
                            }
                        ]
                    }
                ]
            },
            "difficulty": 1
        }`

        const filePath = path.join(process.cwd(), `${process.env.DATA_PATH}/level/`,`${id}.json`)

        fs.appendFileSync(filePath, newLevel)

        return { status: 200 }
    }catch(error){
        console.log(error)
        return { status: 500, error }
    }


})