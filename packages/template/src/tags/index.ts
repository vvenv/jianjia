import { Tag } from '../types';
import { tag as assignTag } from './assign';
import { tag as blockTag } from './block';
import { tag as callTag } from './call';
import { tag as commentTag } from './comment';
import { tag as expressionTag } from './expression';
import { tag as forTag } from './for';
import { tag as breakTag } from './break';
import { tag as continueTag } from './continue';
import { tag as ifTag } from './if';
import { tag as macroTag } from './macro';
import { tag as rawTag } from './raw';
import { tag as unclaimedTag } from './unclaimed';

export const sort = (a: Tag, b: Tag) => (b.priority ?? 0) - (a.priority ?? 0);

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
  unclaimedTag,
].sort(sort);
