import type { Tag } from '../types'
import { tag as assignTag } from './assign'
import { tag as blockTag } from './block'
import { tag as breakTag } from './break'
import { tag as callTag } from './call'
import { tag as commentTag } from './comment'
import { tag as continueTag } from './continue'
import { tag as expressionTag } from './expression'
import { tag as forTag } from './for'
import { tag as ifTag } from './if'
import { tag as macroTag } from './macro'
import { tag as rawTag } from './raw'
import { tag as withTag } from './with'

export const tags = [
  assignTag,
  blockTag,
  callTag,
  commentTag,
  expressionTag,
  forTag,
  breakTag,
  continueTag,
  ifTag,
  macroTag,
  rawTag,
  withTag,
].reduce((acc, tag) => {
  for (const name of tag.names) {
    acc[name] = [...(acc[name] || []), tag]
  }
  return acc
}, {} as Record<string, Tag[]>)
