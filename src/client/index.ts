import { h1 } from '@nrkn/h'
import { gamesView } from './views/games'
import { redirect, setOnRedirect } from './redirect'
import { createGameView } from './views/create-game'
import { playGameView } from './views/play'
import { editGameView } from './views/edit-game'

// probably we will make a standard template for the system and have a container in it be targetEl, but body is fine for prototyping
const targetEl = document.body 
const entry = '#games'

const notImplementedYetView = (name: string) =>
  async () => h1('Not implemented yet: ' + name)

const views: Record<string, (...args: string[]) => Promise<Node>> = {
  games: gamesView,
  play: playGameView,
  editGame: editGameView,
  createGame: createGameView,
}

const errView = (err: Error) => h1('Error: ' + err.message)

setOnRedirect(async path => {
  let viewNode: Node

  try {
    const parts = path.split('/')

    const [head, ...args] = parts
  
    if (!head.startsWith('#')) {
      throw Error('Invalid path')
    }
  
    const viewName = head.slice(1)
  
    viewNode = await views[viewName](...args)  
    
    targetEl.id = 'view_' + viewName
  } catch( err: any ){
    viewNode = errView(err)
  }

  targetEl.innerHTML = ''
  targetEl.append(viewNode)   
})

window.addEventListener('hashchange', () => {
  redirect(window.location.hash)
})

redirect( window.location.hash || entry )
