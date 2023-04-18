export const spaceSeparated = ( value: string ) => 
  value.split( ' ' ).map( s => s.trim() ).filter( s => s !== '' )
