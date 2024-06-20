import {untilRunsDry} from "../src/untilRunsDry";

async function* generator(): AsyncGenerator<number> {
    for (let i = 0; i < 10; i++) {
        yield i
    }
}

describe('untilRunsDry', () => {
    it("should run task with concurrency==1", async () => {
        try {
            const result: string[] = []
            await untilRunsDry({
                generator: generator(),
                processor: async (target) => {
                    result.push(`start target=${target}`)
                    await new Promise(r => setTimeout(r, 100 * target)) // skew timing
                    result.push(`end target=${target}`)
                },
                concurrency: 1,
            })
            expect(result).toEqual([
                // one by one
                'start target=0',
                'end target=0',
                'start target=1',
                'end target=1',
                'start target=2',
                'end target=2',
                'start target=3',
                'end target=3',
                'start target=4',
                'end target=4',
                'start target=5',
                'end target=5',
                'start target=6',
                'end target=6',
                'start target=7',
                'end target=7',
                'start target=8',
                'end target=8',
                'start target=9',
                'end target=9'
            ])
        } catch (e) {
            console.log(e)
        }
    })

    it("should run task with concurrency==1", async () => {
        const result: string[] = []
        await untilRunsDry({
            generator: generator(),
            processor: async (target) => {
                result.push(`start target=${target}`)
                await new Promise(r => setTimeout(r, 100 * target))// skew timing
                result.push(`end target=${target}`)
            },
            concurrency: 3,
        })
        expect(result).toEqual([
            // 3 at first (===concurrency)
            'start target=0',
            'start target=1',
            'start target=2',
            // one job ends, another one starts
            'end target=0',
            'start target=3',
            // one job ends, another one starts
            'end target=1',
            'start target=4',
            // one job ends, another one starts
            'end target=2',
            'start target=5',
            // one job ends, another one starts
            'end target=3',
            'start target=6',
            // one job ends, another one starts
            'end target=4',
            'start target=7',
            // one job ends, another one starts
            'end target=5',
            'start target=8',
            // one job ends, another one starts
            'end target=6',
            'start target=9',
            // one job ends, another one starts
            'end target=7',
            'end target=8',
            // drain
            'end target=9'
        ])
    })
});