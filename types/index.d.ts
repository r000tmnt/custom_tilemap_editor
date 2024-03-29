declare global {
    interface levelDataResponse {
        status: number,
        files: string[]
        err? : {}
    }
}

export { levelDataResponse }