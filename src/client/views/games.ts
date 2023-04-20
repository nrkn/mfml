import { button, div, h1, p } from '@nrkn/h'
import { deleteGame, getGameNames } from '../store/game'
import { ulFrom } from './ul-from'
import { redirect } from '../redirect'

export const gamesView = async (id = 'games') => {
  const gameNames = await getGameNames()

  const gamesHeader = h1('Games')

  const createButton = button('Create a game')

  createButton.addEventListener('click', () => {
    redirect('#createGame')
  })

  const gameToNode = (name: string) => {
    const playButton = button('Play')
    const editButton = button('Edit')
    const deleteButton = button('Delete')

    const gameEl = div(
      p(name),
      ulFrom(
        playButton, editButton, deleteButton
      )
    )

    playButton.addEventListener('click', () => {
      redirect('#play/' + name)
    })

    editButton.addEventListener('click', () => {
      redirect('#editGame/' + name)
    })

    deleteButton.addEventListener('click', async () => {
      if (!confirm(`Are you sure you want to delete "${name}"?`)) return

      await deleteGame(name)
      gameEl.remove()
    })

    return gameEl
  }

  const gamesViewEl = div(
    { id },
    gamesHeader,
    ulFrom(createButton),
    gameNames.length > 0 ?
      ulFrom(...gameNames.map(gameToNode)) :
      p('No games - why not make one?')
  )

  return gamesViewEl
}