import { field } from "../field"
import type { DefaultFieldOptions } from "../field"
import Big from "big.js"

export function big<IsOptional extends boolean>(options: { min?: Big, max?: Big } & DefaultFieldOptions<IsOptional>)
{
    return field<Big, string, IsOptional, typeof options>({
        options,
        verifier({ value })
        {
            if (!(value instanceof Big)) throw new Error()
            if (options.min && value.lt(options.min)) throw new Error()
            if (options.max && value.gt(options.max)) throw new Error()
        },
        fromBase({ baseValue }) { return new Big(baseValue) },
        toBase({ value }) { return value.toString() }
    })
}