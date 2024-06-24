import type { baseAttributeModel } from './item'
import type responseModel from './serverResponse'

interface characterDataModel {
    id: string
    name: string
    prefer_attributes: string[],
    base_attribute: baseAttributeModel,
    skill: string[]
}

interface itemDropModel {
    id: string
    amount: number
    type: number
    rate: number
}

interface classDataModel extends characterDataModel {
    bag: itemDropModel[]
}

interface mobDataModel extends characterDataModel {
    prefer_action: string
    prefer_skill: string,
    drop: itemDropModel[]
}

interface mobResponseModel extends responseModel {
    data: mobDataModel[]
}

interface classResponseModel extends responseModel{
    data: classDataModel[]
}

export{
    itemDropModel,
    classDataModel,
    mobDataModel,
    mobResponseModel,
    classResponseModel
}