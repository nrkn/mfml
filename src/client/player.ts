// this is the root for browserifying the gamePlayer 

import { div } from '@nrkn/h'
import { gamePlayer } from './game-player'

// for now
const stage: 1 | 2 = 1

const state = stage === 1 ? {} : new Set<string>()

const target = div()

document.body.prepend( target )

const template = document.querySelector('template')

if( template === null ){
  const msg = 'No template found'

  target.append( msg )
  
  throw Error(msg)
}

const gp = gamePlayer( state, target )

gp.start( template.content, stage )
