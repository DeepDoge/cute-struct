import { DefaultFieldOptions, field } from "../field"

export function string<IsOptional extends boolean>(options: { min?: number, max?: number } & DefaultFieldOptions<IsOptional>)
{
    return field<string, string, IsOptional, typeof options>({
        options,
        verifier({ value })
        {
            if (typeof value !== 'string') throw new Error()
            if (options.min && value.length < options.min) throw new Error()
            if (options.max && value.length > options.max) throw new Error()
        }
    })
}