/* 

  all we do is take the sections in the template, determine the first one, eg
  with id="start", otherwise literally the first one, then show just that 

  when the user navigates, we hide the current one, and show the new one


  stage 1
  
  with no handlers add, the interpreter just clones the section and returns it
  as is

  stage 2

  with the statekey handler, the interpreter modifies the section according to
  any filter test attributes or tags, and modifies the state according to any 
  state changes caused by attributes or tags
  
*/

import { div, p } from '@nrkn/h'
import { isFragment, isHtmlElement } from '../lib/dom'
import { stages } from '../mfml/configs'
import { Interpreter } from '../mfml/types'

// root is Node instead of HTMLElement, it could be a DocumentFragment, or in
// future maybe eg an SVGElement

export const gamePlayer = (state: any, targetEl: HTMLElement) => {
  const secMap = new Map<string, HTMLElement>()
  const missing: number[] = []

  let isFirst = true
  let current = 'start'
  let missingMessage = ''
  let interp: Interpreter 

  const start = (gameRoot: Node, stage: 1 | 2 = 1) => {
    secMap.clear()
    missing.length = 0
    isFirst = true
    targetEl.innerHTML = ''
    interp = stages[`s${stage}`]

    if (!isHtmlElement(gameRoot) && !isFragment(gameRoot)) {
      targetEl.append(
        p(
          'gameRoot must be an HTMLElement or DocumentFragment, but it is a ',
          gameRoot.constructor.name
        )
      )

      return
    }

    // this will discard any sections with no id, there's no way to get to them 
    // we should warn the user
    const sections = Array.from(gameRoot.querySelectorAll('section'))

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i]
      const { id } = s

      if (id === '') {
        // use 1-based indexing for the user message
        missing.push(i + 1)
        continue
      }

      secMap.set(id, s)
    }

    if (secMap.size === 0) {
      targetEl.append(
        p(
          'gameRoot must contain at least one section with an id'
        )
      )

      return
    }

    // we will add this to targetEl for the first section, but not subsequent
    missingMessage = missing.length > 0 ?
      `Section(s) [${missing.join(', ')}] have no id and were discarded` :
      ''

    current = secMap.has('start') ? 'start' : secMap.keys().next().value      

    playSection()
  }

  const playSection = () => {
    const section = secMap.get(current)!
    const output = div(interp(state)(section))
    const messageEl = p(missingMessage)

    if (isFirst && missingMessage !== '') {
      targetEl.append(messageEl)
    }

    targetEl.append(output)

    const links = output.querySelectorAll('a')

    for (const link of links) {
      const target = link.getAttribute('href')

      if (target === null) continue

      link.addEventListener('click', (e) => {
        e.preventDefault()

        if (isFirst) {
          if (missingMessage !== '') messageEl.remove()
          isFirst = false
        }

        current = target.startsWith('#') ? target.slice(1) : target
        output.remove()
        playSection()
      })
    }
  }

  const stop = () => {
    targetEl.innerHTML = ''
  }

  return { start, stop }
}
