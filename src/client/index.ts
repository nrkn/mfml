import { h1 } from '@nrkn/h'
import { gamesView } from './views/games'
import { redirect, setOnRedirect } from './redirect'

// probably we will make a standard template for the system and have a container in it be targetEl, but body is fine for prototyping
const targetEl = document.body 

const notImplementedYetView = (name: string) =>
  async () => h1('Not implemented yet: ' + name)

const views: Record<string, (...args: string[]) => Promise<Node>> = {
  games: gamesView,
  play: notImplementedYetView('play'),
  editGame: notImplementedYetView('editGame'),
  createGame: notImplementedYetView('createGame'),
}

setOnRedirect(async path => {
  const parts = path.split('/')

  const [head, ...args] = parts

  if (!head.startsWith('#')) {
    throw Error('Invalid path')
  }

  const viewName = head.slice(1)

  const viewNode = await views[viewName](...args)

  targetEl.innerHTML = ''
  targetEl.append(viewNode) 
  targetEl.id = 'view_' + viewName
})

const hasAnchor = window.location.hash.length > 0

if( hasAnchor ) {
  redirect(window.location.hash)
} else {
  redirect('#games')
}

window.addEventListener('hashchange', () => {
  redirect(window.location.hash)
})
