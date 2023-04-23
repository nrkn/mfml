import { getGame } from '../store/game';
import { createOrEdit } from './create-game';

export const editGameView = async ( name: string ) => {
  const game = await getGame( name )

  return createOrEdit( 'editGame', 'Edit Game', name, game )
}
