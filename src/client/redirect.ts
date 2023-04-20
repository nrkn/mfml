export const redirect = ( path: string ) => {
  // set anchor part of location to the path (which starts with #)
  window.location.hash = path

  onRedirect( path )
}

let onRedirect: ( path: string ) => void = () => {}

export const setOnRedirect = ( fn: ( path: string ) => void ) => {
  onRedirect = fn
}