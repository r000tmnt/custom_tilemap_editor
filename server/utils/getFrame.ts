import fs from 'node:fs'

export default function (pathPrefix: string, name: string) {
    const frames = fs.readdirSync(pathPrefix).filter(files => files.includes(name))

    return frames
} 