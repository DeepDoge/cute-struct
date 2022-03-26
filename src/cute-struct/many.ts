import type { DefaultFieldLike, DefaultFieldOptions, FieldLike } from "./field"

export type DefaultFields = Record<string, DefaultFieldLike>

export interface Many<FieldType extends DefaultFieldLike>
{
    TYPE: FieldType
    field: Readonly<FieldType>
    ToEntiries(values: FieldType['TYPE'][]): [number, FieldType['TYPE']][]
    fromEntiries(entiries: [number, FieldType['TYPE']][]): FieldType['TYPE'][]
    verify(values: FieldType['TYPE'][]): FieldType['TYPE'][]
    typed(values: FieldType['TYPE'][]): FieldType['TYPE'][]
    toBase(values: FieldType['TYPE'][]): FieldType['BASETYPE'][]
    fromBase(baseValues: FieldType['BASETYPE'][]): FieldType['TYPE'][]
    asFieldLike<IsOptional extends boolean>(options: DefaultFieldOptions<FieldType['TYPE'][], IsOptional>):
        FieldLike<FieldType['TYPE'][], FieldType['BASETYPE'][], IsOptional, typeof options>
}

export function many<FieldType extends DefaultFieldLike>(field: Readonly<FieldType>)
{
    const many: Many<FieldType> = {
        get TYPE(): FieldType { return null },
        field,
        ToEntiries(values)
        {
            return Object.entries(values) as any
        },
        fromEntiries(entiries)
        {
            return Object.fromEntries(entiries) as any
        },
        typed(values)
        {
            return values
        },
        verify(values)
        {
            return values.map((value, index) =>
            {
                try
                {
                    return field.verify({ value })
                } catch (error)
                {
                    throw new Error(`${field.options.label}[${index}]: ${error.message}`)
                }
            })
        },
        fromBase(baseValues)
        {
            return baseValues.map((baseValue) => field.fromBase({ baseValue }))
        },
        toBase(values)
        {
            return values.map((value) => field.toBase({ value }))
        },
        asFieldLike(options)
        {
            return Object.freeze({
                TYPE: null,
                BASETYPE: null,
                typeName: 'many',
                options,
                fromBase({ baseValue: baseValues })
                {
                    return many.fromBase(baseValues)
                },
                toBase({ value: values })
                {
                    return many.toBase(values)
                },
                verify({ value })
                {
                    if (value === null || value === undefined)
                    {
                        if (options.optional) return value
                        if (options.default !== undefined) return options.default
                    }
                    return many.verify(value)
                }
            })
        }
    }

    return Object.freeze(many)
}