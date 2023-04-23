import { ElArg } from '@nrkn/h/dist/lib/types'

export type HFactory<K extends HTMLElement = HTMLElement> = (
  (...args: ElArg[]) => K
)