// assemble just what's needed for stage 1, stage 2 etc.

import { interpret } from './interpret'
import { handleKeyState } from './key-state'
import { Interpreter } from './types'

export const stages: Record<string,Interpreter> = {
  s1: () => ( node: Node ) => interpret()( node ),
  s2: ( keys: Set<string> ) => ( node: Node ) => interpret( handleKeyState( keys ) )( node )
}