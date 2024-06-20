export async function untilRunsDry<T>({generator, processor, onError, concurrency, checkInterval}: {
    generator: AsyncGenerator<T>,
    processor: (target: T) => Promise<void>
    onError?: (err: unknown) => void
    concurrency: number
    checkInterval?: number
}) {
    if (concurrency < 1) {
        throw new Error(`concurrency should be greater or equal to 1`)
    }
    let running = 0
    for await (const i of generator) {
        running += 1
        processor(i).then(() => {
            running -= 1
        }).catch(err => {
            running -= 1
            if (onError) {
                onError(err)
            }
        })
        while (running >= concurrency) {
            await new Promise(r => setTimeout(r, checkInterval ?? 50))
        }
    }
    // Drain
    while (running > 0) {
        await new Promise(r => setTimeout(r, checkInterval ?? 50))
    }
}