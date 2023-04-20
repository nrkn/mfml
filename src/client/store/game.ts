const join = ( ...args: string[] ) => args.join( '/' )

const rootPath = '/games'
const apiPath  = '/api' + rootPath

export const getGameNames = async () => {
  const res = await fetch( apiPath )

  if ( res.status !== 200 ) {
    throw Error( 'Failed to fetch game names' )
  }

  return res.json() as Promise<string[]>
}

export const getGame = async ( name: string ) => {
  const path = join( rootPath, name, 'index.html' )
  const res = await fetch( path )

  if ( res.status !== 200 ) {
    throw Error( `Failed to fetch game "${ name }"` )
  }
  
  return res.text()
}

export const deleteGame = async ( name: string ) => {
  const path = join( apiPath, name )
  const res = await fetch( path, { method: 'DELETE' } )

  if ( res.status !== 204 ) {
    throw Error( `Failed to delete game "${ name }"` )
  }
}

export const postGame = async ( name: string, html: string ) => {
  const path = join( apiPath, name )
  const res = await fetch( path, { method: 'POST', body: html } )

  if ( res.status !== 201 ) {
    throw Error( `Failed to create game "${ name }"` )
  }
}

export const putGame = async ( name: string, html: string ) => {
  const path = join( apiPath, name )
  const res = await fetch( path, { method: 'PUT', body: html } )

  if ( res.status !== 204 ) {
    throw Error( `Failed to update game "${ name }"` )
  }
}
