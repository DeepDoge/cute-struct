import { field } from "../field"

export const string = field<string, string, { min?: number, max?: number }>({
    verifier({ value, options })
    {
        if (typeof value !== 'string') throw new Error()
        if (options.min && value.length < options.min) throw new Error()
        if (options.max && value.length > options.max) throw new Error()

        return value
    }
})