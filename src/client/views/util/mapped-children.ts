import { attr } from '@nrkn/h'
import { ElArg } from '@nrkn/h/dist/lib/types'
import { isHtmlElement, isNode } from '../../../lib/dom'

export const addMappedChildren = (
  parent: HTMLElement, fn: (arg: Node | string | number) => Node
) =>
  (...args: ElArg[]) => {
    const proto = fn('')
    const localName = isHtmlElement( proto ) ? proto.localName : undefined


    for (const arg of args) {
      const isn = isNode(arg)
      if (isn || typeof arg === 'string' || typeof arg === 'number') {
        if( localName !== undefined && isn && isHtmlElement( arg ) )
        
        parent.append(fn(arg))
      } else {
        attr(parent, arg)
      }
    }

    return parent
  }
