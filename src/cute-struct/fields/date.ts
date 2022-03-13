import { field } from "../field"
import type { DefaultFieldOptions } from "../field"

export function date<IsOptional extends boolean>(options: { min?: Date, max?: Date } & DefaultFieldOptions<IsOptional>)
{
    return field<Date, number, IsOptional, typeof options>({
        options,
        verifier({ value })
        {
            if (!(value instanceof Date)) throw new Error()
            if (options.min && value < options.min) throw new Error()
            if (options.max && value > options.max) throw new Error()
        },
        fromBase({ baseValue }) { return new Date(baseValue) },
        toBase({ value }) { return value.getTime() }
    })
}