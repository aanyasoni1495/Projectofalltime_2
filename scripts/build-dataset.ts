// Reads the source spreadsheet, validates everything, and spits out dataset.json.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import * as XLSX from 'xlsx'
import { DatasetSchema } from '../src/data/schema'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const xlsxPath = resolve(root, 'pm question dataset 5bin.xlsx')
const outPath = resolve(root, 'src/data/dataset.json')

type Row = Record<string, unknown>

// Trim strings; convert empty/whitespace cells to null so zod .nullable() passes.
function norm(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const s = String(value).trim()
  return s === '' ? null : s
}

function readSheet(wb: XLSX.WorkBook, name: string): Row[] {
  const sheet = wb.Sheets[name]
  if (!sheet) throw new Error(`Missing sheet: ${name}`)
  const raw = XLSX.utils.sheet_to_json<Row>(sheet, { defval: null, raw: false })
  return raw.map((row) => {
    const out: Row = {}
    for (const key of Object.keys(row)) out[key.trim()] = norm(row[key])
    return out
  })
}

const wb = XLSX.read(readFileSync(xlsxPath), { type: 'buffer' })

const dataset = {
  archetypes: readSheet(wb, 'Archetypes'),
  companies: readSheet(wb, 'Companies'),
  features: readSheet(wb, 'Features'),
  metrics: readSheet(wb, 'Metrics'),
  segments: readSheet(wb, 'User_Segments'),
  genericProducts: readSheet(wb, 'Generic_Products'),
  binTemplates: readSheet(wb, 'Bin_Templates'),
}

const parsed = DatasetSchema.parse(dataset)

writeFileSync(outPath, JSON.stringify(parsed, null, 2) + '\n', 'utf8')

const counts = Object.entries(parsed)
  .map(([k, v]) => `${k}: ${(v as unknown[]).length}`)
  .join('\n')

console.log('Wrote', outPath)
console.log(counts)
