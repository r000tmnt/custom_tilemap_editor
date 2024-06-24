import { animationSort } from '~/types/animation';
import type responseModel from './serverResponse';
interface animation {
    [key: string]: string[]
}

interface animationSort {
    oldIndex: number
    newIndex: number
    type: string
    oldFileName: string
}

interface animationEditData {
    files: file[]
    name: string
}

interface animationCreateModel {
    type: string
    target: string
    level: number
    name: string
    frames: File[]
}

interface animationResponseModel extends responseModel {
    error?: {}
}

export {
    animation,
    animationSort,
    animationEditData,
    animationCreateModel,
    animationResponseModel
}