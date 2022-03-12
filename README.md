# What is this?
Struct type checker, for anything, validating, generating api calls, generate forms, or databases, etc anything.

# Example

## Built-in Date field
```ts
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
```

## Defining struct
```ts
const test = struct({
    someValue: string({ optional: true }),
    someValue2: string({ label: "Some Value 2" }),
    manyStuff: struct({
        otherValue: date({ })
    }).asFieldLike({ label: "Many Stuff" })
})
```

## Defining values for test struct
```ts
const testValues: ValuesOfStruct<typeof test['TYPE']> = {
    someValue: '123',
    someValue2: 'abc',
    manyStuff: {
        otherValue: new Date()
    }
}
// Or 
const testValues = test.typed({
    someValue: '123',
    someValue2: 'abc',
    manyStuff: {
        otherValue: new Date()
    }
})
```
```ts
typeof testValues // would have a type like
{
    someValue?: string,
    someValue2: string.
    manyStuff: {
        otherValue: Date
    }
}
```

## How to convert to JSON
```ts
// Get values as base values
const testBaseValues = test.toBase(testValues)
// Which would give a result like
{
    someValue?: '123',
    someValue2: 'abc',
    manyStuff: {
        otherValue: 1647112539930
    }
}

// Convert to JSON
const json = JSON.stringify(testBaseValues)

// How to parse JSON back
test.fromBase(JSON.parse(json))
```
