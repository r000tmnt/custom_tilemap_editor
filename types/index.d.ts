declare global {
    interface responseModel{
        status: number
    }

    interface levelDataResponse extends responseModel {
        data: levleDataModle
    }

    interface levelList extends responseModel {
        files: string[]
        err? : {}
    }

    interface optionEffectModle {
        target: string
        attribute: string
        value: number
    }

    interface dialogueOptionModle {
        value: string
        style: string
        size: string
        content: string
        effect: optionEffectModle[]
    }

    interface eventDialogueModel {
        person: string
        style: string
        size: string
        content: string
        audio?: string[]
        option?: dialogueOptionModle[]
    }

    interface levelEventModle {
        background: string
        audio: string
        people: number
        dialogue: eventDialogueModel[],
        trigger: string
    }

    interface levleDataModle {
        id: string
        name: string
        map: number[][]
        event: levelEventModle[]
        phase: string[]
        enemy: []
        objective: {}
        audio: string
        assets: string[]
        difficulty: number
    }

    interface levelAssetModle {
        env: string[]
        class: string[]
        mob: string[]
    }
}

export { 
    responseModel,
    levelList,
    levelDataResponse, 
    levleDataModle, 
    levelEventModle ,
    levelAssetModle
}