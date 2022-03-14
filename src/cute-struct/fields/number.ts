import { field } from "../field"

export const number = field<number, number, { min?: number, max?: number }>({
    typeName: 'number',
    verifier({ value, options })
    {
        if (typeof value !== 'number') throw new Error()
        if (options.min && value < options.min) throw new Error()
        if (options.max && value > options.max) throw new Error()

        return value
    }
})