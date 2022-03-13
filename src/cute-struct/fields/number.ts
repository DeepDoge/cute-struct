import { field } from "../field"
import type { DefaultFieldOptions } from "../field"

export function number<IsOptional extends boolean>(options: { min?: number, max?: number } & DefaultFieldOptions<IsOptional>)
{
    return field<number, number, IsOptional, typeof options>({
        options,
        verifier({ value })
        {
            if (typeof value !== 'number') throw new Error()
            if (options.min && value < options.min) throw new Error()
            if (options.max && value > options.max) throw new Error()
        }
    })
}