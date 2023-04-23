import { iframe } from '@nrkn/h'

export const playGameView = async ( name: string ) => {
  const ifrEl = iframe({ id: 'gameHost'})

  ifrEl.src = `/games/${ name }`

  return ifrEl
}
