import {
  findChild, getAttrs, isElement, removeAttrs, unwrap
} from '../lib/dom'

import { spaceSeparated } from '../lib/util'

const qattrs = ['q-if', 'q-or', 'q-not']
const sattrs = ['k-give', 'k-take']

const removeQueryAttrs = removeAttrs(qattrs)
const removeStateAttrs = removeAttrs(sattrs)

const removeElseAttr = (node: HTMLElement) =>
  node.removeAttribute('q-else')

const getQueryKeys = (node: HTMLElement) => {
  const [qif, qor, qnot] = getAttrs(qattrs)(node)

  const ifKeys = qif !== null ? spaceSeparated(qif) : []
  const orKeys = qor !== null ? spaceSeparated(qor) : []
  const notKeys = qnot !== null ? spaceSeparated(qnot) : []

  return [ifKeys, orKeys, notKeys]
}

const isQuery = (ifKeys: string[], orKeys: string[], notKeys: string[]) =>
  ifKeys.length > 0 || orKeys.length > 0 || notKeys.length > 0

const isFirstAttr = (node: HTMLElement) => node.hasAttribute('q-first')

const isElseAttr = (node: Node): node is HTMLElement =>
  isElement(node) && node.hasAttribute('q-else')

const unwrapMf = (node: Node) => {
  if (!isElement(node)) return node

  if (node.localName !== 'm-f') {
    return node
  }

  return unwrap(node)
}

const handleQ = (keys: Set<string>) =>
  (node: HTMLElement) => {
    // handle query first, because if it fails the query, we don't want to 
    // give/take keys or handle first    
    const [ifKeys, orKeys, notKeys] = getQueryKeys(node)
    const isQ = isQuery(ifKeys, orKeys, notKeys)

    if (isQ) {
      removeQueryAttrs(node)

      const isValid = testKeys(keys)(ifKeys, orKeys, notKeys)
      const elseNode = findElseChild(node)

      // it's a query node, but it's not valid
      if (!isValid) {
        if (elseNode !== undefined) {
          removeElseAttr(elseNode)

          return unwrapMf(elseNode)
        }

        return document.createDocumentFragment()
      }

      // it was valid so remove the elseNode if necessary
      if (elseNode !== undefined) {
        elseNode.remove()
      }
    }

    return node
  }

const handleS = (keys: Set<string>) =>
  (node: HTMLElement) => {
    const [give, take] = getAttrs(sattrs)(node)
    const giveKeys = give !== null ? spaceSeparated(give) : []
    const takeKeys = take !== null ? spaceSeparated(take) : []

    setKeys(keys)(giveKeys, takeKeys)

    removeStateAttrs(node)
  }

const handleL = (keys: Set<string>) =>
  (node: HTMLElement) => {
    const first = findValidQuery(keys)(node)

    if (first !== undefined) {
      removeQueryAttrs(first)

      return unwrapMf(first)
    }

    const elseNode = findElseChild(node)

    if (elseNode !== undefined) {
      removeElseAttr(elseNode)

      return unwrapMf(elseNode)
    }

    return document.createDocumentFragment()
  }

export const handleKeyState = (keys: Set<string>) =>
  (node: Node) => {
    if (!isElement(node)) {
      return node
    }

    // handle query first, because if it fails the query, we don't want to give/take keys
    // or handle qfirst    
    const maybeQ = handleQ(keys)(node)

    if (node !== maybeQ) return maybeQ

    // handle state attrs
    // no need to reassign, it doesn't change node
    handleS(keys)(node)

    // handle qfirst
    if (isFirstAttr(node)) return handleL(keys)(node)

    return unwrapMf(node)
  }

// we need to cast - shame we can't infer from the predicate  
const findElseChild = findChild(isElseAttr)

const isValidQuery = (keys: Set<string>) =>
  (n: Node): n is HTMLElement => {
    if (!isElement(n)) return false

    const [ifKeys, orKeys, notKeys] = getQueryKeys(n)
    const isQ = isQuery(ifKeys, orKeys, notKeys)

    // we only test queries
    if (!isQ) return false

    const isValid = testKeys(keys)(ifKeys, orKeys, notKeys)

    return isValid
  }

const findValidQuery = (keys: Set<string>) =>
  findChild(isValidQuery(keys))

const testKey = (keys: Set<string>) =>
 ( key: string ) => {
    const isNot = key.startsWith('!')

    return isNot ? !keys.has(key.slice(1)) : keys.has(key)
 }

const testKeys = (keys: Set<string>) =>
  (ifKeys: string[], orKeys: string[], notKeys: string[]) => {
    const hasIf = ifKeys.length > 0
    const hasOr = orKeys.length > 0
    const hasNot = notKeys.length > 0

    if (!hasIf && !hasOr && !hasNot) {
      return true
    }

    const tk = testKey( keys )

    if( !ifKeys.every( tk ) ) return false

    if( hasOr && !orKeys.some( tk ) ) return false

    if( notKeys.some( tk ) ) return false

    return true
  }

const setKeys = (keys: Set<string>) =>
  (giveKeys: string[], takeKeys: string[]) => {
    giveKeys.forEach(key => keys.add(key))
    takeKeys.forEach(key => keys.delete(key))
  }
