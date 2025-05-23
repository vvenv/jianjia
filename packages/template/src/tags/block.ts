import { AST, EndTag, StartTag } from '../ast';
import { ROOT } from '../config';
import { Tag } from '../types';

const BLOCK = 'block';
const END_BLOCK = 'end_block';
const SUPER = 'super';
const END_SUPER = 'end_super';
const RE = /^(?:#block\s+(.+))|(super\(\))|(\/block)$/;

/**
 * @example {{ #block title }}{{ super() }}...{{ /block }}
 *                    ^^^^^      ^^^^^^^         ^^^^^^
 */
export const tag: Tag = {
  parse({ ast, base, content }) {
    const [, data, _super, end] = content.match(RE) ?? [];

    if (end) {
      const tag = {
        ...base,
        name: END_BLOCK,
      };

      if (ast.verifyStartTag(BLOCK, tag)) {
        ast.end(tag);
      }

      return;
    }

    if (_super) {
      const tag = {
        ...base,
        name: SUPER,
        data,
      };

      if (ast.verifyStartTag(BLOCK, tag)) {
        ast.start(tag);

        // Self closing
        ast.end({
          ...base,
          startIndex: base.endIndex,
          name: END_SUPER,
        });
      }

      return;
    }

    if (data) {
      const tag = {
        ...base,
        name: BLOCK,
        data,
      };

      if (ast.verifyStartTag(ROOT, tag)) {
        const startTag = ast.start(tag);

        if (startTag) {
          addTag(ast, startTag);
        }
      }

      return;
    }

    return false;
  },

  async compile({ template, tag, context, ast, out }, compileContent) {
    if (tag.name === BLOCK) {
      let loc;
      const tags = getTags(tag as StartTag, ast);
      if (tags.indexOf(tag as StartTag) === 0) {
        const { level, index } = (tag as StartTag).node;
        const affix = `${level.toString(32)}_${index.toString(32)}`;
        let curry = '';
        for (let i = 0; i < tags.length; i++) {
          const _tag = tags[i] as StartTag;
          ast.goto(_tag);
          const variable = `_b_${affix}_${_tag.startIndex.toString(32)}`;
          out.pushLine(`const ${variable}=async(_s)=>{`);
          await compileContent({ template, tag: _tag, context, out });
          out.pushStr(
            template.slice(
              ast.cursor.endIndex,
              (_tag.nextSibling as EndTag).startIndex,
            ),
            {
              trimStart: ast.cursor.stripAfter,
              trimEnd: ast.cursor.next?.stripBefore ?? false,
            },
          );
          ast.goto(_tag.nextSibling as EndTag);
          out.pushLine('};');
          curry = `async()=>await ${variable}(${curry})`;
        }

        loc = out.pushLine(`await (${curry})();`);
        delTags(tag as StartTag, ast);
      } else {
        ast.goto(tag.nextSibling!);
      }
      return loc;
    }

    if (tag.name === SUPER) {
      out.pushLine(`await _s?.();`);
      return;
    }

    if (tag.name === END_SUPER) {
      return;
    }

    if (tag.name === END_BLOCK) {
      return;
    }

    return false;
  },
};

const tagsMap = new WeakMap<AST, Record<string, StartTag[]>>();

function hasAst(ast: AST) {
  return tagsMap.has(ast);
}

function getAst(ast: AST) {
  return tagsMap.get(ast);
}

function setAst(ast: AST, value: Record<string, StartTag[]>) {
  return tagsMap.set(ast, value);
}

function addTag(ast: AST, tag: StartTag) {
  if (!hasAst(ast)) {
    setAst(ast, {});
  }

  const tags = getAst(ast)!;

  const { data } = tag;

  if (!tags[data!]) {
    tags[data!] = [];
  }

  tags[data!].push(tag);
}

function getTags(tag: StartTag, ast: AST) {
  return getAst(ast)![tag.data!];
}

function delTags(tag: StartTag, ast: AST) {
  return (getAst(ast)![tag.data!] = []);
}
