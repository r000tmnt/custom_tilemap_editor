import type responseModel from "./serverResponse"

interface skillCostModel {
    attribute: string
    value: number
}

interface skillEffectModel {
    type: number
    range: number
    base_on_attribute: string
    multiply_as: number
    base_number: number
    desc: string
}

interface skillStatusEffectModel extends skillEffectModel {
    status: string
}

interface skillDataModel {
    id: string
    name: string
    weapon: string
    type: number
    cost: skillCostModel
    animation: string
    effect: skillEffectModel | skillStatusEffectModel
}

interface skillState {
    sword: skillDataModel[]
    kneif: skillDataModel[]
    wand: skillDataModel[]
    staff: skillDataModel[]
    axe: skillDataModel[]
    bow: skillDataModel[]
    gun: skillDataModel[]
}

interface skillResponseModel extends responseModel {
    data: skillDataModel []
}

export {
    skillDataModel,
    skillCostModel,
    skillEffectModel,
    skillStatusEffectModel,
    skillState,
    skillResponseModel
}