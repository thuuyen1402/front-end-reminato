export async function waitResolve(ms: number = 1000) {
    return await new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, ms)
    })
}