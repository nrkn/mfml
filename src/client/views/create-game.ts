import { div, form, h1, input, label, span, textarea } from '@nrkn/h'
import { redirect } from '../redirect'
import { GridArg, grid, gridFor } from './util/grid'
import { fullScreen, lightGreyBg, noMargin, readable } from './util/attr'
import { defaultDocHtml, defaultGameHtml } from '../../lib/const'
import { postGame, putGame } from '../store/game'

const id = 'createGame'

export const createGameView = async () =>  createOrEdit( id, 'Create Game' )

declare const monaco: any

export const createOrEdit = (
  id: string,
  title: string,
  name?: string,
  html?: string
) => {
  const createGameHeader = h1(noMargin, lightGreyBg, title )

  const isEdit = name !== undefined && html !== undefined

  const gameNameEl = isEdit ? input({ readonly: true, value: name } ) : input()
  
  //const gameHtmlEl = textarea({ style: { overflowY: 'scroll' } })
  const gameHtmlEl = div({ id: 'monaco-editor', style: { height: '100%', width: '100%' } })

  const initMonacoEditor = (value: string) => {
    return monaco.editor.create(gameHtmlEl, {
      value,
      language: 'html',
      theme: 'vs-dark',
      automaticLayout: true,
    })
  }

  let sectionsHtml = isEdit ? '' : defaultGameHtml

  if( isEdit ){
    // it's a document - we need to just find the section children of the template
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const template = doc.querySelector('template')

    if( template === null ){
      throw new Error('Invalid document')
    }

    const sections = template.content.querySelectorAll('section')

    // now we need to generate the html from the sections

    const shtml = Array.from(sections).map(section => section.outerHTML).join('\n')

    sectionsHtml = shtml
  }

  const editorInstance = initMonacoEditor(sectionsHtml)

  const letsGo = input({ type: 'submit', value: 'Save' })

  const gridForm = gridFor(form)

  const gridAuto1fr: GridArg = {
    grid: {
      rows: 'auto 1fr',
      gap: '1em'
    }
  }

  const subgridAuto1fr: GridArg = {
    grid: {
      rows: 'auto 1fr'
    }
  }

  const gridAuto1frAuto: GridArg = {
    grid: {
      rows: 'auto 1fr auto',
      gap: '1em'
    }
  }

  const gridSplitHalfCols: GridArg = {
    grid: {
      cols: '1fr 1fr',
      gap: '1em'
    }
  }

  const gridLabel = (...args: any[]) =>
    gridFor(label)(
      subgridAuto1fr,
      {
        style: {
          overflow: 'hidden'
        }
      },
      ...args
    )

  const formEl = gridForm(
    readable,
    gridAuto1frAuto,
    {
      style: {
        overflow: 'hidden',
      }
    },
    gridLabel(span('Game Name'), gameNameEl),
    gridLabel(span('Game HTML'), gameHtmlEl),
    letsGo
  )

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault()

    // todo - if errors, show them

    // otherwise, save game then redirect

    // todo - save game

    try {
      const html = (
        defaultDocHtml
          .replace(/{{name}}/, gameNameEl.value)
          .replace(/{{html}}/, editorInstance.getValue())
      )

      if( isEdit ){
        await putGame( name, html )
      } else {
        await postGame(gameNameEl.value, html)
      }

      redirect('#games')
    } catch (err: any) {
      alert(err.message)
    }
  })

  const previewEl = div(readable, { style: { overflowY: 'scroll' } })

  const createViewEl = grid(
    { id },
    gridAuto1fr,
    fullScreen,
    {
      style: {
        maxHeight: '100vh',
        marginBottom: '4em',
        padding: '2em'
      }
    },
    createGameHeader,
    grid(
      {
        style: {
          overflow: 'hidden',
          maxHeight: '100%'
        }
      },
      gridSplitHalfCols,
      formEl,
      previewEl
    )
  )

  let lastPreviewHtml = ''
  const tick = () => {
    const currentHtml = editorInstance.getValue()
    if (currentHtml !== lastPreviewHtml) {
      previewEl.innerHTML = currentHtml
      lastPreviewHtml = currentHtml      
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)

  return createViewEl
}