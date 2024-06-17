interface animation {
    attack?: string[]
    down?: string[]
    idle?: string[]
    left?: string[]
    right?: string[]
    top?: string[]
}

interface animationSort {
    oldIndex: number
    newIndex: number
    type: string
    oldFileName: string
}

export {
    animation,
    animationSort
}