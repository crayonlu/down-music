const express = require('express')
const axios = require('axios')
const helmet = require('helmet')
const url = require('url')

const app = express()
const PORT = process.env.PORT || 3003

app.use(helmet())
app.set('trust proxy', true)

const ALLOWED_HOSTS = (process.env.PROXY_ALLOW_HOSTS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
const ALLOW_ALL = process.env.PROXY_ALLOW_ALL === 'true' || ALLOWED_HOSTS.length === 0

function isHostAllowed(targetUrl) {
  if (!targetUrl) return false
  try {
    const parsed = new url.URL(targetUrl)
    if (ALLOW_ALL) return true
    return ALLOWED_HOSTS.includes(parsed.hostname)
  } catch (e) {
    console.debug('isHostAllowed: invalid url', e)
    return false
  }
}

app.get('/proxy', async (req, res) => {
  const target = req.query.url
  if (!target) {
    res.status(400).json({ code: 400, message: 'Missing url' })
    return
  }

  if (!isHostAllowed(target)) {
    res.status(403).json({ code: 403, message: 'Host not allowed by proxy' })
    return
  }

  try {
    console.log('MediaProxy: incoming proxy request to', target)
    const headers = {}
    if (req.headers.range) headers.Range = req.headers.range
    if (req.headers['user-agent']) headers['user-agent'] = req.headers['user-agent']
    if (req.headers['referer']) headers.referer = req.headers['referer']
    if (req.headers['origin']) headers.origin = req.headers['origin']

    const resp = await axios.get(target, {
      responseType: 'stream',
      headers,
      maxRedirects: Number(process.env.PROXY_MAX_REDIRECTS || 10),
      validateStatus: () => true,
    })

    Object.keys(resp.headers || {}).forEach(name => {
      if (name.toLowerCase() === 'access-control-allow-origin') return
      res.setHeader(name, resp.headers[name])
    })

    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ALLOW_ORIGIN || '*')

    res.status(resp.status)
    console.log('MediaProxy: proxied to', target, 'status', resp.status)
    resp.data.pipe(res)
  } catch (error) {
    console.error('Proxy error:', error && error.toString ? error.toString() : error)
    res.status(502).json({ code: 502, message: 'Bad Gateway' })
  }
})

app.listen(PORT, () => console.log(`media-proxy listening ${PORT}`))
