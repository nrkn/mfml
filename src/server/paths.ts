import { kebabCase } from 'lodash'

export const getGamePath = ( name: string ) => 
  `data/www/games/${kebabCase(name)}`
