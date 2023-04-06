import { AccountDTO } from "../models/account"

export function base64Encode(data: string | number) {
    return Buffer.from(data.toString()).toString('base64')
}

export function base64Decoded(value: string) {
    return Buffer.from(value, 'base64').toString('ascii')
}