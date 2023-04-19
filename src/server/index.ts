import * as express from 'express'
import { readdir, stat, rm, mkdir, writeFile } from 'fs/promises'
import { join } from 'path/posix'

const port = process.env.port || process.env.PORT || 3409
const app = express()

app.use(express.static('data/www'))

app.get('/api/games', async (_req, res) => {
  const names = await readdir('data/www/games')

  const dirs: string[] = []

  for (const name of names) {
    const path = join('data/www/games', name)
    const stats = await stat(path)

    if (stats.isDirectory()) dirs.push(name)
  }

  res.json(dirs)
})

app.delete('/api/games/:name', async (req, res) => {
  const { name } = req.params

  const path = join('data/www/games', name)
  const stats = await stat(path)

  if (stats.isDirectory()) {
    await rm(path, { recursive: true })

    res.status(204).send()
  } else {
    res.status(404).send()
  }
})

app.post(
  '/api/games/:name',
  express.text(),
  async (req, res) => {
    const { name } = req.params
    const { body } = req

    const path = join('data/www/games', name)
    const stats = await stat(path)

    if (stats.isDirectory()) {
      res.status(409).send()
    } else {
      await mkdir(path)

      const indexHtmlPath = join(path, 'index.html')

      await writeFile(indexHtmlPath, body, 'utf-8')

      res.status(201).send()
    }
  }
)

app.put(
  '/api/games/:name',
  express.text(),
  async (req, res) => {
    const { name } = req.params
    const { body } = req

    const path = join('data/www/games', name, 'index.html')

    await writeFile(path, body, 'utf-8')

    res.status(204).send()
  }
)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
