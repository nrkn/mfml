import * as express from 'express'
import { readdir, stat, rm, mkdir, writeFile } from 'fs/promises'
import { join } from 'path/posix'
import { getGamePath } from './paths'
import { gamesRoot, wwwRoot } from './const'
import { deleteGame, getGameNames, postGame, putGame } from './store/game'

const port = process.env.port || process.env.PORT || 3409
const app = express()

app.use(express.static(wwwRoot))

app.use(( req, _res, next ) => {
  const { method, url } = req

  console.log( 'req', { method, url } )

  next()
})

app.get('/api/games', async (_req, res) => {
  res.json( await getGameNames() )
})

app.delete('/api/games/:name', async (req, res) => {
  const { name } = req.params

  try {
    await deleteGame(name)

    console.log( 'deleted', name )

    res.status(204).send()
  } catch( err: any ){
    console.error( err )

    res.status(404).send(err.message)
  }
})

app.post(
  '/api/games/:name',
  express.text(),
  async (req, res) => {
    const { name } = req.params
    const { body } = req
    
    try {
      await postGame(name, body)
      
      console.log( 'posted', name )

      res.status(201).send()
    } catch( err: any ){
      console.error( err )

      res.status(409).send(err.message)
    }
  }
)

app.put(
  '/api/games/:name',
  express.text(),
  async (req, res) => {
    const { name } = req.params
    const { body } = req

    try {
      await putGame(name, body)

      console.log( 'put', name )

      res.status(204).send()
    } catch( err: any ){
      console.error( err )
      
      res.status(404).send(err.message)
    }
  }
)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
