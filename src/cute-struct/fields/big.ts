import Big from "big.js"
import { field } from "../field"

export const big = field<Big, string, { min?: Big, max?: Big }>({
    typeName: 'big',
    verifier({ value, options })
    {
        if (!(value instanceof Big)) throw new Error()
        if (options.min && value.lt(options.min)) throw new Error()
        if (options.max && value.gt(options.max)) throw new Error()

        return value
    },
    fromBase({ baseValue }) { return new Big(baseValue) },
    toBase({ value }) { return value.toString() }
})