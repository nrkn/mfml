import { JSDOM } from 'jsdom'
import { stages } from '../mfml/configs'

const dom = new JSDOM(
  `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <section id="start">
      <p>Hello world</p>      
    </section>
  </body>
</html>`
)

let sec: HTMLElement
let isec: HTMLElement

const { document } = dom.window

global.document = document

console.log( 's1' )

sec = document.querySelector('section')!

console.log( 'before', sec.outerHTML )

let interpret = stages.s1

isec = interpret()( sec ) as HTMLElement

console.log( 'after', isec.outerHTML )

document.body.innerHTML = `
  <section id="start">    
    <p k-give="started">Hello world!</p>
    <p>
      <span q-if="started" k-take="started">
        You should see this!
        <span q-else>But not this!</span>
      </span>      
    </p>
    <p>
      <span q-if="started">
        But not this!
        <span q-else k-give="startEnded">You should see this!</span>
      </span>
    </p>
    <p>Now we are gonna do some tidy text.</p>
    <p>
      <m-f q-if="startEnded">
        You should see this!
        <m-f q-else>But not this!</m-f>
      </m-f>
    </p>
  </section>
`

console.log( 's2' )

const keys = new Set<string>()

sec = document.querySelector('section')!

console.log( 'before', sec.outerHTML )

interpret = stages.s2

isec = interpret( keys )( sec ) as HTMLElement

console.log( 'after', isec.outerHTML )

console.log( 'keys', keys )
