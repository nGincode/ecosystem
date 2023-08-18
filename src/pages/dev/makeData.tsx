import { faker } from '@faker-js/faker'

export type Person = {
    uuid: any
    img: any
    firstName: string
    lastName: string
    age: number
    visits: number
    progress: number
    status: 'relationship' | 'complicated' | 'single'
    subRows?: Person[]
}

const range = (len: number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = (): any => {
    return {
        uuid: faker.random.numeric(),
        img: 'https://source.unsplash.com/random/200x200?sig=1',
        username: faker.name.firstName(),
        email: faker.internet.email(),
        fullName: faker.name.fullName(),
        phone: faker.datatype.number(1000),
        address: faker.name.fullName(),
        dateOfBirth: '2023-09-09',
        role: 'admin',
        status: faker.helpers.shuffle<Person['status']>([
            'relationship',
            'complicated',
            'single',
        ])[0]!,
    }
}

export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): Person[] => {
        const len = lens[depth]!
        return range(len).map((d): Person => {
            return {
                ...newPerson()
            }
        })
    }

    return makeDataLevel()
}
