import responseModel from "./serverResponse"

interface itemTypeModel {
    type: number
    category: string
}

interface effectDataModel {
    rare: string
    desc: string
}

interface materialEffectModel {
    type: number
    target: string
    amount: number
    status: string
    rate?: number
    desc: string
}

interface keyEffectModel extends effectDataModel {
    enemy_number: number
    elite_rate: number
    item_drop_modify: string
}

interface baseAttributeModel {
    hp: number
    mp: number
    ap: number
    str: number
    def: number
    int: number
    spd: number
    spi: number
    lck: number
    maxHp: number
    maxMp: number
    maxAp: number
    moveSpeed: number
    sight: number
}

interface useConditionModel {
    compare: string
    target: string
}

interface baseDamageModel{
    min: number
    max: number
}

interface armorEffectModel {
    base_attribute: baseAttributeModel
    desc: string
}

interface weaponEffectModel {
    base_damage: baseDamageModel
    base_attribute: baseAttributeModel
    desc: string
}

interface otherEffectModel {
    desc: string
}

interface accessoryEffectModel {
    rare: string
    type: number
    target: string
    amount: number
    base_attribute: baseAttributeModel,
    desc: string
}

interface effectTypeModel extends effectDataModel{
    type: number
    target: string
    amount: number
}

interface potionEffectModel extends effectDataModel extends effectTypeModel {
    range: number
}

interface percentageEffectModel extends effectTypeModel {
    rate: number
}

interface itemDataModel {
    id: string
    name: string
    stackLimit: number
    type: number
    prefix: string[]
    suffix: string[]
}

interface materialDataModel {
    id: string
    name: string
    stackLimit: number
    type: number
    effect: materialEffectModel
}

interface otherDataModel {
    id: string
    name: string
    stackLimit: number
    type: number
    effect: otherEffectModel
}

interface keyDataModel extends itemDataModel {
    effect: keyEffectModel
}

interface armorDataModel extends itemDataModel {
    position: string
    effect: armorEffectModel
}

interface weaponDataModel extends itemDataModel {
    position: string
    effect: weaponEffectModel
}

interface accessoryDataModel extends itemDataModel{
    effect: accessoryEffectModel
}

interface potionDataModel extends itemDataModel {
    effect: potionEffectModel
    useCondition: useConditionModel
}

interface typeResponseModel extends responseModel {
    data: itemTypeModel[]
}

interface armorResponseModel extends responseModel {
    data: armorDataModel[]
}

interface weaponResponseModel extends responseModel {
    data: weaponDataModel[]
}

interface potionResponseModel extends responseModel {
    data: potionDataModel[]
}

interface keyResponseModel extends responseModel {
    data: keyDataModel[]
}

interface otherResponseModel extends responseModel {
    data: otherDataModel[]
}

interface materialResponseModel extends responseModel {
    data: materialDataModel[]
}

interface itemState {
    armor: armorDataModel[]
    accessory: accessoryDataModel[]
    key: keyDataModel[]
    material: materialDataModel[]
    other: otherDataModel[]
    potion: potionDataModel[]
    weapon: weaponDataModel[]
}

export{
    itemTypeModel,
    armorDataModel,
    weaponDataModel,
    keyDataModel,
    potionDataModel,
    otherDataModel,
    materialDataModel,
    typeResponseModel,
    weaponResponseModel,
    armorResponseModel,
    keyResponseModel,
    potionResponseModel,
    otherResponseModel,
    materialResponseModel,
    itemState,
    baseAttributeModel,
    accessoryEffectModel,
    accessoryDataModel
}