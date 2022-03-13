export type BaseValues = string | number

type FieldVerifier<Field extends DefaultFieldLike> = (params: { value: Field['TYPE'] }) => void
type FromBase<Field extends DefaultFieldLike> = (params: { baseValue: Field['BASETYPE'] }) => Field['TYPE']
type ToBase<Field extends DefaultFieldLike> = (params: { value: Field['TYPE'] }) => Field['BASETYPE']

export type DefaultFieldLike = FieldLike<any, any, boolean, DefaultFieldOptions<boolean>>
export interface FieldLike<Value, BaseValue, IsOptional extends boolean, FieldOptions extends DefaultFieldOptions<IsOptional>>
{
    TYPE: Value
    BASETYPE: BaseValue
    options: FieldOptions
    verify: FieldVerifier<this>
    toBase: ToBase<this>
    fromBase: FromBase<this>
}
// export type DefaultField = Field<any, BaseValues, boolean>
export interface Field<Value, BaseValue extends BaseValues, IsOptional extends boolean, FieldOptions extends DefaultFieldOptions<IsOptional>> extends FieldLike<Value, BaseValue, IsOptional, FieldOptions>
{

}

export interface DefaultFieldOptions<IsOptional extends boolean>
{
    label?: string
    optional?: IsOptional
}

interface FieldConstructor<Field extends DefaultFieldLike>
{
    options: Field['options'],
    verifier: Field['verify']
}

interface FieldConstructorExtra_Converters<Field extends DefaultFieldLike>
{
    toBase: Field['toBase'],
    fromBase: Field['fromBase']
}

export function field<
    Value,
    BaseValue extends BaseValues,
    IsOptional extends boolean,
    FieldOptions extends DefaultFieldOptions<IsOptional>
>(
    params: FieldConstructor<Field<Value, BaseValue, IsOptional, FieldOptions>> &
        (Value extends BaseValue ? 
            Partial<FieldConstructorExtra_Converters<Field<Value, BaseValue, IsOptional, FieldOptions>>> : 
            FieldConstructorExtra_Converters<Field<Value, BaseValue, IsOptional, FieldOptions>>)
): Field<Value, BaseValue, IsOptional, FieldOptions>
{
    if (!params.fromBase) params.fromBase = ({ baseValue }) => baseValue as any
    if (!params.toBase) params.toBase = ({ value }) => value as any

    return Object.freeze({
        TYPE: null,
        BASETYPE: null,
        options: params.options,
        verify(x)
        {
            if (params.options.optional && (x.value === null || x.value === undefined)) return
            params.verifier(x)
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
    })
}