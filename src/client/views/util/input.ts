import { input } from '@nrkn/h'
import { ElArg } from '@nrkn/h/dist/lib/types'

export type MinMaxStep = {
  min: number
  max: number
  step: number
}

export const minMaxStepInput = (
  { min, max, step }: Partial<MinMaxStep> = {},
  type: 'number' | 'range' = 'number'
) =>
  (...args: ElArg[]) =>
    input({ type, min, max, step }, ...args)

export const numberInput = (...args: ElArg[]) =>
  input({ type: 'number' }, ...args)

export const numberRange = (...args: ElArg[]) =>
  input({ type: 'range' }, ...args)

export const numberBetween = (min: number, max: number) =>
  (...args: ElArg[]) =>
    minMaxStepInput({ min, max })(...args)

export const numberBetweenRange = (min: number, max: number) =>
  (...args: ElArg[]) =>
    minMaxStepInput({ min, max }, 'range')(...args)

export const intInput = (...args: ElArg[]) =>
  minMaxStepInput({ step: 1 })(...args)

export const intRange = (...args: ElArg[]) =>
  minMaxStepInput({ step: 1 }, 'range')(...args)

export const intBetween = (min: number, max: number) =>
  (...args: ElArg[]) =>
    minMaxStepInput({ min, max, step: 1 })(...args)

export const intBetweenRange = (min: number, max: number) =>
  (...args: ElArg[]) =>
    minMaxStepInput({ min, max, step: 1 }, 'range')(...args)

export const uintInput = (...args: ElArg[]) =>
  minMaxStepInput({ min: 0, step: 1 })(...args)

export const uintRange = (...args: ElArg[]) =>
  minMaxStepInput({ min: 0, step: 1 }, 'range')(...args)

export const uintBetween = (min: number, max: number) => {
  min = Math.max(min, 0)

  return (...args: ElArg[]) =>
    minMaxStepInput({ min, max, step: 1 })(...args)
}

export const uintBetweenRange = (min: number, max: number) => {
  min = Math.max(min, 0)

  return (...args: ElArg[]) =>
    minMaxStepInput({ min, max, step: 1 }, 'range')(...args)
}
