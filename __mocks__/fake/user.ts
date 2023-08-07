import { faker } from "@faker-js/faker"

export const fakeUserData = {
    email: faker.internet.email(),
    id: faker.string.uuid(),
}


export const fakeLoginData = {
    email: fakeUserData.email,
    password: "1234567"
}


export const fakeCookie = {
    jwt: faker.string.alphanumeric(),
    rs: faker.string.alphanumeric(),
}