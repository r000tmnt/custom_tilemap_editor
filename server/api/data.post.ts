import fs from 'node:fs';
// import path from 'node:path';

export default defineEventHandler((event) => {
    const param = getRouterParams(event)

    console.log("param :>>> ", param)

    const { folder, width, height, codeName, name } = param

    console.log(`${process.env.URL}${folder}`)

    const newMap = []

    for(let i=0; i < Number(width); i++){
        const row : number[] = []
        newMap.push(row)

        for(let j=0; j < Number(height); j++){
            newMap[i].push(0)
        }
    }

    try{
        const newLevel = `import { t } from '../../utils/i18n'

        export default {
            "id": ${codeName},
            "name": ${name},
            "map": ${newMap},
            "audio": "", // Audio for battle phase
            "assets": [ // define in numeric order
                "",
                "",
                "",
                "",
                ""
            ],
            // conversation - 對話階段, 
            // battle - 戰鬥階段
            // intermission - 整備階段
            // end - 回到標題畫面
            "phase": [ 'conversation', 'titleCard', 'battle', 'conversation', 'end' ],
            "event": [], // Pre-defined events
            "enemy": [],
            "objective": {
                // In what condition does player clear the level
                // Clear all, pass X turns, Defeat XXX...etc
                "victory": {
                    "target": "enemy",
                    "value": 0
                },
                // In what condition does player lose the level
                // Defeat all, XXX down...etc
                "fail": {
                    "target": "player",
                    "value": 0
                },
                // In what condition does player get bonus
                "optional": [
                    {
                        "target": "turn",
                        "value": 6,
                        "prize": [
                            { // Prize for clear the level
                                "id": 'currency_1',
                                "type": 1,
                                "amount": 100
                            }
                        ]
                    }
                ]
            },
            "difficulty": 1
        }`

        fs.appendFileSync(`${process.env.URL}${folder}/${codeName}.js`, newLevel)

        return { status: 200 }
    }catch(err){
        return { status: 500, err }
    }


})