const ELEMENT_NODE = 1

export const isElement = (node: Node): node is HTMLElement =>
  node.nodeType === ELEMENT_NODE

export const removeAttrs = (attrs: string[]) => (node: HTMLElement) =>
  attrs.forEach(k => node.removeAttribute(k))

export const getAttrs = (attrs: string[]) => (node: HTMLElement) =>
  attrs.map(k => node.getAttribute(k))

export const unwrap = (node: Node) => {
  const children = document.createDocumentFragment()

  while (node.firstChild) {
    children.append(node.firstChild)
  }

  return children
}

export const findDescendent = (predicate: (node: Node) => boolean) => (
  node: Node
): Node | undefined => {
  if (predicate(node)) return node

  for (let i = 0; i < node.childNodes.length; i++) {
    const result = findDescendent(predicate)(node.childNodes[i])

    if (result !== undefined) return result
  }
}

export const findChild = <T extends Node>(predicate: (node: Node) => node is T ) =>
  (node: Node): T | undefined => {
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i]

      if (predicate(child)) return child
    }
  }
