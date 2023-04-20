import { button } from '@nrkn/h'
import { ElArg } from '@nrkn/h/dist/lib/types'
import { redirect } from '../../redirect'

export const buttonTo = ( path: string, ...args: ElArg[] ) => 
  buttonFn( () => redirect( path ), ...args )

export const buttonFn = ( click: () => void, ...args: ElArg[] ) => {
  const btn = button( ...args )

  btn.addEventListener( 'click', click )

  return btn
}

export const buttonConfirmFn = ( 
  click: () => void, message: string, ...args: ElArg[] 
) => {
  const btn = button( ...args )

  btn.addEventListener( 'click', () => {
    if ( confirm( message ) ) click()
  })

  return btn
}
