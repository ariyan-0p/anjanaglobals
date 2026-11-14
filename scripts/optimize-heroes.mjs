import sharp from 'sharp'
import fs from 'node:fs/promises'

const files = ['singapore.jpg', 'baku.jpg', 'Dubai.jpg', 'Bali.jpg', 'Kualalumpur.jpg']
for (const f of files) {
  const p = `src/assets/${f}`
  const input = await fs.readFile(p)
  const meta = await sharp(input).metadata()
  const out = await sharp(input)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true, progressive: true })
    .toBuffer()
  if (out.length < input.length) await fs.writeFile(p, out)
  console.log(f, `${meta.width}x${meta.height}`, (input.length / 1e6).toFixed(2) + 'MB ->', (Math.min(out.length, input.length) / 1e6).toFixed(2) + 'MB')
}
