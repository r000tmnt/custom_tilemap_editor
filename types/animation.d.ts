import { animationSort } from '~/types/animation';
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

export {
    animation,
    animationSort,
    animationEditData,
    animationCreateModel,
}