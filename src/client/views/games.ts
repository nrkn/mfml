import { button, div, h1, p } from '@nrkn/h'
import { deleteGame, getGameNames } from '../store/game'
import { ulFrom } from './util/ul-from'
import { buttonTo, buttonConfirmFn } from './util/buttons'

export const gamesView = async ( id = 'games') => {
  const gameNames = await getGameNames()

  const gamesHeader = h1('Games')
  const createButton = buttonTo( '#createGame', 'Create a game')

  const gameToNode = (name: string) => {
    const playButton = buttonTo('#play/' + name, 'Play')
    const editButton = buttonTo('#editGame/' + name, 'Edit')

    const deleteButton = buttonConfirmFn(
      async () => {
        await deleteGame(name)
        gameEl.remove()
      },
      `Are you sure you want to delete "${name}"?`,
      'Delete'
    )

    const gameEl = div(
      p(name),
      ulFrom(
        playButton, editButton, deleteButton
      )
    )

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