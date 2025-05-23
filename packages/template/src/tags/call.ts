import { StartTag } from '../ast';
import { parseActualArgs } from '../utils/parse-actual-args';
import { Tag } from '../types';

const CALL = 'call';
const END_CALL = 'end_call';
const RE = /^(?:#call\s+(.+))|(\/call)$/;

/**
 * @example {{ #call my_macro "foo" "bar" }}...{{ /call }}
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    const [, rawStatement, end] = content.match(RE) ?? [];

    if (end) {
      const tag = {
        ...base,
        name: END_CALL,
      };

      if (ast.verifyStartTag(CALL, tag)) {
        ast.end(tag);
      }

      return;
    }

    if (rawStatement) {
      ast.start({
        ...base,
        name: CALL,
        rawStatement,
      });

      return;
    }

    return false;
  },

  async compile({ template, tag, context, out }, compileContent) {
    if (tag.name === CALL) {
      const name = parseMacroName(tag as StartTag);
      const loc = out.pushLine(`await ${context}.${name}(async()=>{`);
      await compileContent({ template, tag: tag as StartTag, context, out });
      return loc;
    }

    if (tag.name === END_CALL) {
      const args = parseMacroActualArgs(tag.previousSibling!, context);
      return args.length
        ? out.pushLine(`},${args.join(',')});`)
        : out.pushLine(`});`);
    }

    return false;
  },
};

function parseMacroName(tag: StartTag) {
  const [name] = tag.rawStatement!.match(/^\S+/)!;

  return name;
}

function parseMacroActualArgs(tag: StartTag, context: string) {
  const [, args] = tag.rawStatement!.match(/^\S+\s+(.+)$/) ?? [];

  return parseActualArgs(args, context);
}
