import responseModel from "./serverResponse"

interface levelDataResponse extends responseModel {
    data: levleDataModel
}

interface levelList extends responseModel {
    files: string[]
    err? : {}
}

interface optionEffectModel {
    target: string
    attribute: string
    type?: number
    value: number | string
}

interface dialogueOptionModel {
    value: string
    style: string
    size: string
    content: string
    effect: optionEffectModel[]
}

interface eventDialogueModel {
    person: string
    style: string
    size: string
    content: string
    audio?: string[]
    option?: dialogueOptionModel[]
}

interface eventSceneModel{
    background: string
    audio: string
    people: number
    dialogue: eventDialogueModel[]
}

interface eventPositionModel{
    x: number
    y: number
}

interface eventItemModel{
    amount: number
    id: string
    type: number
}

interface levelEventModel {
    position: eventPositionModel
    item: eventItemModel[]
    scene: eventSceneModel[]
    trigger: string
}

interface tileInfoModel extends eventPositionModel {
    events: levelEventModel[]
    indexes: number[]
}

interface characterReferenceModel {
    name?: string
    job?: string
    startingPoint: eventPositionModel
}

interface objetivePrizeModel {
    id: string
    type: number
    amount: number
}

interface objectiveDataModel {
    target: string
    value: number
}

interface objectiveOptionalModel extends objectiveDataModel {
    prize: objetivePrizeModel[]
}

interface levelObjectiveModel {
    victory: objectiveDataModel
    fail: objectiveDataModel
    optional: objectiveOptionalModel[]
}

interface levleDataModel {
    id: string
    name: string
    map: number[][]
    event: levelEventModel[]
    phase: string[]
    enemy: characterReferenceModel[]
    player: characterReferenceModel[]
    objective: levelObjectiveModel
    audio: string
    assets: string[]
    difficulty: number
}

interface levelAssetResponseModel{
    status: number
    assets: string[]
    error?: {}
}

interface levelAssetModel {
    bg: string[]
    env: string[]
    class: string[]
    mob: string[]
    portrait: string[]
}

interface audioAssetModel {
    general: string[]
    battle: string[]
}

interface animationAssetModel {
    class: string[]
    mob: string[]
}

interface effectItemReferenceModel {
    id: string,
    type: number
}

interface translationDataModel {
    class: string[]
    item: string[]
    level: string[]
    skill: string[]
}

export { 
    responseModel,
    levelList,
    levelDataResponse, 
    levleDataModel, 
    levelEventModel ,
    levelAssetModel,
    levelAssetResponseModel,
    audioAssetModel,
    animationAssetModel,
    tileInfoModel,
    eventItemModel,
    eventSceneModel,
    eventDialogueModel,
    dialogueOptionModel,
    optionEffectModel,
    effectItemReferenceModel,
    eventPositionModel,
    objectiveDataModel,
    objectiveOptionalModel,
    translationDataModel
}