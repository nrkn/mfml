import { mkdir, readFile, readdir, rm, stat, writeFile } from 'fs/promises'
import { gamesRoot } from '../const'
import { join } from 'path/posix'
import { getGamePath } from '../paths'

export const getGameNames = async () => {
  const names = await readdir(gamesRoot)

  const dirs: string[] = []

  for (const name of names) {
    // no need to call getGamePath as we are using an existing path
    const path = join(gamesRoot, name)
    const stats = await stat(path)

    if (stats.isDirectory()) dirs.push(name)
  }

  return dirs
}

export const getGame = async (name: string) => {
  const path = join(getGamePath(name), 'index.html')
  const html = await readFile(path, 'utf-8')

  return html
}

export const deleteGame = async (name: string) => {
  const path = getGamePath(name)
  const stats = await stat(path)

  if (!stats.isDirectory())
    throw Error(`Failed to delete game "${name}"`)

  await rm(path, { recursive: true })
}

export const postGame = async (name: string, html: string) => {
  const path = getGamePath(name)
 
  await mkdir(path)

  const indexHtmlPath = join(path, 'index.html')

  await writeFile(indexHtmlPath, html, 'utf-8')
} 

export const putGame = async (name: string, html: string) => {
  const path = getGamePath(name)
  const stats = await stat(path)

  if (!stats.isDirectory()) {
    throw Error(`Game "${name}" does not exist`)
  } else {
    const indexHtmlPath = join(path, 'index.html')

    await writeFile(indexHtmlPath, html, 'utf-8')
  }
}