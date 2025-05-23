import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'

export async function loader(path: string) {
  return readFile(join(cwd(), path), 'utf-8')
}
