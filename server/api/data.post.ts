import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler( async(event) => {
    const body = await readBody(event)

    console.log("body :>>> ", body)

    const { id, name, width, height } = body

    // console.log(`${process.env.URL}${folder}`)

    const newMap = []

    for(let i=0; i < Number(height); i++){
        const row : number[] = []
        newMap.push(row)

        for(let j=0; j < Number(width); j++){
            newMap[i].push(0)
        }
    }

    try{
        const newLevel = `{
            "id": "${id}",
            "name": "${name}",
            "map": ${JSON.stringify(newMap)},
            "audio": "", 
            "assets": [ 
                "",
                "",
                "",
                "",
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

        const filePath = path.join(process.cwd(), `${process.env.DATA_PATH}`,`${id}.json`)

        fs.appendFileSync(filePath, newLevel)

        return { status: 200 }
    }catch(err){
        console.log(err)
        return { status: 500, err }
    }


})