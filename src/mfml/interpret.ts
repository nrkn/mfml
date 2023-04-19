import { NodeHandler } from './types'

export const interpret = (...handlers: NodeHandler[]) =>
  (node: Node) =>
    inter(handlers)(node.cloneNode(true))

const inter = (handlers: NodeHandler[]) =>
  (node: Node) => {
    for (const handler of handlers) {
      let newNode = handler(node)

      if (newNode !== node) {
        newNode = inter(handlers)(newNode)
        if (node.parentNode === null) throw Error('node.parentNode is null')

        node.parentNode.replaceChild(newNode, node)
        node = newNode

        break
      }
    }

    const childNodes = Array.from(node.childNodes)

    for (const childNode of childNodes) {
      inter(handlers)(childNode)
    }

    return node
  }
