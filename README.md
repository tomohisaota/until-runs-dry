# until-runs-dry
Keep running jobs in parallel until the data source runs dry

# How to install

```shell
npm install until-runs-dry
```

# How to use

```typescript
import {untilRunsDry} from "until-runs-dry";

// flag to stop generator
let shouldContinue = true

async function* generator(): AsyncGenerator<number> {
    for (let i = 0; shouldContinue && (i < 10); i++) {
        console.log(`yield ${i}`)
        yield i
    }
}

async function processor(target: number) {
    await new Promise(r => setTimeout(r, 100 * target))
    console.log(`process ${target}`)
    if (target === 8) {
        throw new Error("Stop here")
    }
}

function onError(err: unknown) {
    console.log("Error, stop generator")
    shouldContinue = false
}

async function main() {
    await untilRunsDry({
        generator,
        processor,
        onError,
        concurrency: 3,
    })
}

main()
```

# Version History

- 1.0.0
    - Initial Release

# License

This project is under the MIT license.
Copyright (c) 2024 Tomohisa Ota