import { getGame } from '../store/game'
import { createOrEdit } from './create-game'

// this isn't really what we want to do - the editView is going to have
// a bunch of things for helping to manage sections - but for now is fine
// to just have one big ol' html editor
export const editGameView = async ( name: string ) => {
  const game = await getGame( name )

  return createOrEdit( 'editGame', 'Edit Game', name, game )
}
