import { StartTag } from '../ast';
import { parseFormalArgs } from '../utils/parse-formal-args';
import { Tag } from '../types';

const MACRO = 'macro';
const END_MACRO = 'end_macro';
const CALLER = 'caller';
const END_CALLER = 'end_caller';
const RE = /^(?:#macro\s+(.+))|(caller\(\))|(\/macro)$/;

/**
 * @example {{ #macro my_macro x y }}...{{ caller() }}{{ /macro }}{{ my_macro "foo" 1 }}
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    const [, rawStatement, caller, end] = content.match(RE) ?? [];

    if (end) {
      const tag = {
        ...base,
        name: END_MACRO,
      };

      if (ast.verifyStartTag(MACRO, tag)) {
        ast.end(tag);
      }

      return;
    }

    if (caller) {
      const tag = {
        ...base,
        name: CALLER,
        rawStatement,
      };

      if (ast.verifyStartTag(MACRO, tag)) {
        ast.start(tag);

        // Self closing
        ast.end({
          ...base,
          startIndex: base.endIndex,
          name: END_CALLER,
        });
      }

      return;
    }

    if (rawStatement) {
      ast.start({
        ...base,
        name: MACRO,
        rawStatement,
      });

      return;
    }

    return false;
  },

  async compile({ template, tag, context, out }, compileContent) {
    if (tag.name === MACRO) {
      const affix = `${(tag as StartTag).node.level.toString(32)}_${(tag as StartTag).node.index.toString(32)}`;
      const { name, args } = parseStatement(tag as StartTag);
      const lines: string[] = [];
      lines.push(`${context}.${name}=async(${['_c', ...args].join(',')})=>{`);
      if (args.length) {
        lines.push(`const ${context}_m_${affix}={`, `...${context},`);
        args.forEach((param) => {
          lines.push(`${param.replace(/(\w+)=.+/, '$1')},`);
        });
        lines.push(`};`);
      }
      const loc = out.pushLine(...lines);
      await compileContent({
        template,
        tag: tag as StartTag,
        context: `${context}_m_${affix}`,
        out,
      });
      return loc;
    }

    if (tag.name === CALLER) {
      const loc = out.pushLine(`await _c?.();`);
      await compileContent({ template, tag: tag as StartTag, context, out });
      return loc;
    }

    if (tag.name === END_CALLER) {
      return;
    }

    if (tag.name === END_MACRO) {
      out.pushLine('};');
      return;
    }

    return false;
  },
};

function parseStatement(tag: StartTag) {
  const [, name, args] = tag.rawStatement!.match(/^(\w+?)(?:\s+(.+?))?$/)!;

  return {
    name,
    args: parseFormalArgs(args),
  };
}
