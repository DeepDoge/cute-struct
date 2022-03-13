import { field } from "../field"

export const date = field<Date, number, { min?: Date, max?: Date }>({
    verifier({ value, options })
    {
        if (!(value instanceof Date)) throw new Error()
        if (options.min && value < options.min) throw new Error()
        if (options.max && value > options.max) throw new Error()

        return value
    },
    fromBase({ baseValue }) { return new Date(baseValue) },
    toBase({ value }) { return value.getTime() }
})