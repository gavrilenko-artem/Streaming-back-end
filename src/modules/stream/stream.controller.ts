import { Router, Request, Response, NextFunction } from 'express'
import WebTorrent, { Torrent, TorrentFile } from 'webtorrent'

const router = Router()
const client = new WebTorrent()

let state = {
  percent: 0,
  downloadSpeed: 0,
  ratio: 0,
}

let error = ''

interface streamRequest extends Request {
  params: {
    magnet: string
    fileName: string
  }
  headers: {
    range: string
  }
}

interface errorWithStatus extends Error {
  status: number
}

client.on('error', (err: Error) => {
  console.error('err', err.message)
  error = err.message
})

client.on('torrent', () => {
  state = {
    percent: Math.round(client.progress * 100 * 100) / 100,
    // downloadSpeed: Number(prettyBytes(client.downloadSpeed)),
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio,
  }
})

router.get('/add/:magnetHash', (req: Request, res: Response) => {
  const magnetHash = req.params.magnetHash

  if (!client) {
    return res.status(500).send('Torrent client is not available')
  }

  client.add(magnetHash, torrent => {
    const files = torrent.files.map(data => ({
      name: data.name,
      length: data.length,
    }))
    res.status(200).send(files)
  })
})

router.get('/stats', (req: Request, res: Response) => {
  state = {
    percent: Math.round(client.progress * 100 * 100) / 100,
    // downloadSpeed: Number(prettyBytes(client.downloadSpeed)),
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio,
  }
  res.status(200).send({
    state,
  })
})

router.get(
  '/:magnet/:fileName',
  (req: streamRequest, res: Response, next: NextFunction) => {
    const {
      params: { magnet, fileName },
      headers: { range },
    } = req

    if (!client) {
      const err = new Error(
        'Torrent client is not available'
      ) as errorWithStatus
      err.status = 500
      return next(err)
    }

    if (!range) {
      const err = new Error('Range is not defined') as errorWithStatus
      err.status = 416
      return next(err)
    }

    const torrent = client.get(magnet) as Torrent
    const file = torrent.files.find(file => file.name === fileName)

    if (!file) {
      const err = new Error(`File not found: ${fileName}`) as errorWithStatus
      err.status = 404
      return next(err)
    }

    // Размер файла
    const fileSize = file.length

    // Стартовая и конечная позиция
    const [startPosition, endPosition] = range.replace(/bytes=/, '').split('-')
    const start = Number(startPosition)
    const end = endPosition ? Number(endPosition) : fileSize - 1
    const chankSize = end - start + 1

    const headers = {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Content-Length': chankSize,
      'Accept-Ranges': 'bytes',
    }

    res.writeHead(206, headers)

    const streamPosition = {
      start,
      end,
    }

    const stream = file.createReadStream(streamPosition)
    stream.pipe(res)

    stream.on('error', err => {
      return next(err)
    })
  }
)

export default router
