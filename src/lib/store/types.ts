export type StoreGet = <T = any>( key: string ) => T | undefined
export type StoreSet = <T = any>( key: string, value: T ) => void