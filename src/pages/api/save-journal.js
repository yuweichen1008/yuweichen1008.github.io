/**
 * POST /api/save-journal — dev only
 * Body: { slug: string, content: string }
 * Writes content to src/data/journal/<slug>.md
 */

const fs = require('fs')
const path = require('path')

module.exports = function handler(req, res) {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug, content } = req.body || {}

  if (!slug || !content || typeof slug !== 'string' || typeof content !== 'string') {
    return res.status(400).json({ error: 'slug and content are required' })
  }

  // Sanitize slug — only allow safe filename characters
  const safeName = slug.replace(/[^a-z0-9-]/g, '') + '.md'
  if (!safeName || safeName === '.md') {
    return res.status(400).json({ error: 'Invalid slug' })
  }

  const journalDir = path.join(process.cwd(), 'data', 'journal')
  if (!fs.existsSync(journalDir)) {
    fs.mkdirSync(journalDir, { recursive: true })
  }

  const filePath = path.join(journalDir, safeName)
  fs.writeFileSync(filePath, content, 'utf8')

  res.status(200).json({ file: `data/journal/${safeName}` })
}
