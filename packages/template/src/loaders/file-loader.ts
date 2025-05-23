import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const loader = async (path: string) =>
  readFile(join(process.cwd(), path), 'utf-8');
