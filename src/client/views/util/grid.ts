import { div } from '@nrkn/h'
import { ElArg } from '@nrkn/h/dist/lib/types'
import { HFactory } from './types'

export type GridArgs = {
  rows: string | string[]
  cols: string | string[]
  gap: string
}

// simple util so types alongside  
export type GridArg = {
  grid: Partial<GridArgs> // for now - we can improve the GridArg type later
}

export type GridElArg = GridArg | ElArg

export const isGridArg = (arg: any): arg is GridArg =>
  arg && typeof arg.grid === 'object' 

export const gridArgToElArg = (arg: GridArg): ElArg => {
  const style: Partial<CSSStyleDeclaration> = {
    display: 'grid'
  }

  let { rows, cols, gap } = arg.grid

  if (rows !== undefined ){ 
    if( Array.isArray( rows ) ) rows = rows.join(' ')
    style.gridTemplateRows = rows
  }
  
  if (cols !== undefined ){ 
    if( Array.isArray( cols ) ) cols = cols.join(' ')
    style.gridTemplateColumns = cols
  }
  
  if (gap !== undefined){ 
    style.gap = arg.grid.gap
  }

  return { style }
}

export const gridFor = <K extends HTMLElement = HTMLElement>(
  containerFactory: HFactory<K>
) =>
  (...args: GridElArg[]) => {
    const elArgs = args.map(arg => {
      if (isGridArg(arg)) return gridArgToElArg(arg)

      return arg
    })

    return containerFactory(...elArgs)
  }

export const grid = gridFor(div)
