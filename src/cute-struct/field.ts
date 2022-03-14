export type BaseValues = string | number

export type DefaultFieldLike = FieldLike<any, any, boolean, DefaultFieldOptions<any, boolean>>
export interface FieldLike<Value, BaseValue, IsOptional extends boolean, FieldOptions extends DefaultFieldOptions<Value, IsOptional>>
{
    TYPE: Value
    BASETYPE: BaseValue
    typeName: string
    options: FieldOptions
    verify: (params: { value: Value }) => Value
    toBase: (params: { value: Value }) => BaseValue
    fromBase: (params: { baseValue: BaseValue }) => Value
}
// export type DefaultField = Field<any, BaseValues, boolean>
export interface Field<Value, BaseValue extends BaseValues, IsOptional extends boolean, FieldOptions extends DefaultFieldOptions<Value, IsOptional>> extends FieldLike<Value, BaseValue, IsOptional, FieldOptions>
{

}

export interface DefaultFieldOptions<Value, IsOptional extends boolean>
{
    label?: string
    optional?: IsOptional
    default?: Value
}

interface FieldParams<Field extends DefaultFieldLike>
{
    typeName: string
    verifier: (params: { value: Field['TYPE'], options: Field['options'] }) => Field['TYPE']
}

interface FieldParamsExtra_Converters<Field extends DefaultFieldLike>
{
    toBase: Field['toBase'],
    fromBase: Field['fromBase']
}

export function field<
    Value,
    BaseValue extends BaseValues,
    FieldOptions extends Record<string, any>
>(
    params:
        FieldParams<Field<Value, BaseValue, boolean, FieldOptions>> &
        (
            Value extends BaseValue ?
            Partial<FieldParamsExtra_Converters<Field<Value, BaseValue, boolean, FieldOptions>>> :
            FieldParamsExtra_Converters<Field<Value, BaseValue, boolean, FieldOptions>>
        )
)
{
    if (!params.fromBase) params.fromBase = ({ baseValue }) => baseValue as any
    if (!params.toBase) params.toBase = ({ value }) => value as any

    return <IsOptional extends boolean>(options: FieldOptions & DefaultFieldOptions<Value, IsOptional>) =>
    {
        if (options.default !== undefined) 
        {
            try
            {
                params.verifier({ value: options.default, options })
            } catch (error)
            {
                throw new Error(`Default value ${options.default} can't pass verifier. It's not valid.\n\t${error.message}`)
            }
        }

        const field: Field<Value, BaseValue, IsOptional, typeof options> = {
            TYPE: null,
            BASETYPE: null,
            typeName: params.typeName,
            options: options,
            verify(x)
            {
                if (x.value === null || x.value === undefined)
                {
                    if (options.optional) return x.value
                    if (options.default !== undefined) return options.default
                }
                return params.verifier({ value: x.value, options })
            },
            fromBase(x)
            {
                return params.fromBase(x)
            },
            toBase(x)
            {
                const base = params.toBase(x)
                return base
            }
        }

        return Object.freeze(field)
    }
}