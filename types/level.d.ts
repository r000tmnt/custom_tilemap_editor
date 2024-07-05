import responseModel from "./serverResponse"

interface levelDataResponse extends responseModel {
    data: levleDataModel
}

interface levelList extends responseModel {
    files: string[]
}

interface optionEffectModel {
    target: string
    attribute: string
    type?: number
    value: number | string
}

interface optionConditionModel {
    type: string
    value: string
    possess?: boolean
    greater?: boolean
    percentage?: number
    down?: boolean // If player or enemy is on the field
    required?: number // This option will appeared if xx option selected
}

interface dialogueOptionModel {
    value: string
    style: string
    size: string
    response: eventDialogueModel[]
    condition: optionConditionModel
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
    requireOption?: string
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
    depth: number[][][]
    event: levelEventModel[]
    phase: string[]
    enemy: characterReferenceModel[]
    player: characterReferenceModel[]
    objective: levelObjectiveModel
    audio: string
    assets: string[]
    difficulty: number
}

interface levelAssetResponseModel extends responseModel{
    assets: string[]
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

interface translationDetailModel {
    en: any
    zh: any
}

interface translationResponse extends responseModel{
    data: translationDetailModel
}

export { 
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
    translationDataModel,
    translationResponse
}