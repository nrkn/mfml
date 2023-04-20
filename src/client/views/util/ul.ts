import { ul, li } from '@nrkn/h'
import { ElArg } from '@nrkn/h/dist/lib/types'
import { addMappedChildren } from './mapped-children'

export const ulFrom = (...args: ElArg[]) => 
  addMappedChildren(ul(), li)(...args)
