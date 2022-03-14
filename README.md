# What is this?
A runtime type checker.

Basically it let's you validate type of something on runtime when you need to.<br/>
Can be used for the API server side to check if the value sent is correct.<br/>
And can be used for generating type for that API function so we know what we need to send client side etc.<br/>

It also let's you read a detailed info about the struct and its fields on runtime when you need to.<br/>
So you can also use this to generate forms, databases and etc.<br/>

# Example

## Built-in Date field
```ts
export const date = field<Date, number, { min?: Date, max?: Date }>({
    verifier({ value, options })
    {
        if (!(value instanceof Date)) throw new Error()
        if (options.min && value < options.min) throw new Error()
        if (options.max && value > options.max) throw new Error()
    },
    fromBase({ baseValue }) { return new Date(baseValue) },
    toBase({ value }) { return value.getTime() }
})
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
    // If the field has been set `optional` like above, it gives a partial type in struct
    someValue2: string,
    manyStuff: {
        otherValue: Date
    }
}
```

## Verifying Struct
```ts
// Returns the value back
// Changes might have been made to the value
// - For example it will give the default value for empty fields with a default value 
// Throws if it fails
test.verify(testValues)
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
let values = test.fromBase(JSON.parse(json))
// Then you can verify it with
values = test.verify(values)
```
