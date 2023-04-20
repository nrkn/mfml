import { ul, li } from '@nrkn/h'

export const ulFrom = ( ...nodes: Node[] ) => 
  ul( ...nodes.map( n => li( n ) ) )
