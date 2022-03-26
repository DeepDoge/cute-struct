import type { ExcludeMatchingProperties } from "../types"
import type { DefaultFieldLike, DefaultFieldOptions, FieldLike } from "./field"

export type DefaultFields = Record<string, DefaultFieldLike>

export type KeysOfStruct<Fields extends DefaultFields> = Extract<keyof Fields, string>
export type ValuesOfStruct<Fields extends DefaultFields> =
    Required<ExcludeMatchingProperties<{
        [P in KeysOfStruct<Fields>]: Fields[P]['options']['optional'] extends true ?
        never : Fields[P]['TYPE']
    }, never>> &
    Partial<ExcludeMatchingProperties<{
        [P in KeysOfStruct<Fields>]: Fields[P]['options']['optional'] extends true ?
        Fields[P]['TYPE'] : never
    }, never>>
export type BaseValuesOfStruct<Fields extends DefaultFields> =
    Required<ExcludeMatchingProperties<{
        [P in KeysOfStruct<Fields>]: Fields[P]['options']['optional'] extends true ?
        never : Fields[P]['BASETYPE']
    }, never>> &
    Partial<ExcludeMatchingProperties<{
        [P in KeysOfStruct<Fields>]: Fields[P]['options']['optional'] extends true ?
        Fields[P]['BASETYPE'] : never
    }, never>>


export interface Struct<Fields extends DefaultFields>
{
    TYPE: Fields
    fields: Readonly<Fields>
    ToEntiries(values: ValuesOfStruct<Fields>): [KeysOfStruct<Fields>, any][]
    fromEntiries(entiries: [KeysOfStruct<Fields>, any][]): ValuesOfStruct<Fields>
    verify(values: ValuesOfStruct<Fields> & Record<string, any>): ValuesOfStruct<Fields>
    typed(values: ValuesOfStruct<Fields> & Record<string, any>): ValuesOfStruct<Fields>
    toBase(values: ValuesOfStruct<Fields>): BaseValuesOfStruct<Fields>
    fromBase(baseValues: BaseValuesOfStruct<Fields>): ValuesOfStruct<Fields>
    asFieldLike<IsOptional extends boolean>(options: DefaultFieldOptions<ValuesOfStruct<Fields>, IsOptional>):
        FieldLike<ValuesOfStruct<Fields>, BaseValuesOfStruct<Fields>, IsOptional, typeof options>
}

export function struct<Fields extends DefaultFields>(fields: Fields)
{
    const struct: Struct<Fields> = {
        get TYPE(): Fields { return null },
        fields: Object.freeze(fields),
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
            return struct.fromEntiries(struct.ToEntiries(values).map(([key, value]) =>
            {
                const field = fields[key]
                try
                {
                    return [key, field.verify({ value })]
                } catch (error)
                {
                    throw new Error(`fields->${field.options.label ?? key}: ${error.message}`)
                }
            }))
        },
        fromBase(baseValues)
        {
            return struct.fromEntiries(struct.ToEntiries(baseValues).map(([key, baseValue]) => [key, fields[key].fromBase({ baseValue })]))
        },
        toBase(values)
        {
            return struct.fromEntiries(struct.ToEntiries(values).map(([key, value]) => [key, fields[key].toBase({ value })]))
        },
        asFieldLike(options)
        {
            return Object.freeze({
                TYPE: null,
                BASETYPE: null,
                typeName: 'struct',
                options,
                fromBase({ baseValue: baseValues })
                {
                    return struct.fromBase(baseValues)
                },
                toBase({ value: values })
                {
                    return struct.toBase(values)
                },
                verify({ value })
                {
                    if (value === null || value === undefined)
                    {
                        if (options.optional) return { } as ValuesOfStruct<Fields>
                        if (options.default !== undefined) return options.default
                    }
                    return struct.verify(value)
                }
            })
        }
    }

    return Object.freeze(struct)
}