import type { ASTNode, EngineOptions, StartTag, Tag } from './types'
import { AST } from './ast'
import { CONTEXT } from './config'
import { OutScript } from './out-script'
import { SourceMap } from './source-map'
import { tags } from './tags'

export class Parser {
  public namedTags: Record<string, Tag[]> = tags

  constructor(public options: Required<EngineOptions>) {}

  registerTags(tags: Tag[]) {
    tags.forEach((tag) => {
      tag.names.forEach((name) => {
        this.namedTags[name] = [...(this.namedTags[name] || []), tag]
      })
    })
  }

  async parse(template: string) {
    const ast = new AST(this.options)
    const out = new OutScript(this.options)
    const sourcemap = new SourceMap(this.options)

    await ast.parse(template, this.namedTags)

    if (ast.valid) {
      out.start()

      const { children } = ast
      if (children.length) {
        for (const child of children) {
          await this.compile(template, child, CONTEXT, ast, out, sourcemap)
        }

        out.pushStr(template.slice(ast.cursor.endIndex), {
          trimStart: ast.cursor.stripAfter,
          trimEnd: false,
        })
      }
      else {
        out.pushStr(template)
      }

      out.end()
    }

    return { value: out.value, script: out.script, sourcemap }
  }

  private async compile(
    template: string,
    { tags: _tags }: ASTNode,
    context = CONTEXT,
    ast: AST,
    out: OutScript,
    sourcemap: SourceMap,
  ) {
    const compileContent = (arg: {
      template: string
      tag: StartTag
      context: string
      out: OutScript
    }) => this.compileContent({ ...arg, ast, sourcemap })
    for (const _tag of _tags) {
      out.pushStr(template.slice(ast.cursor.endIndex, _tag.startIndex), {
        trimStart: ast.cursor.stripAfter,
        trimEnd: _tag.stripBefore,
      })
      ast.goto(_tag)

      const tags = (this.namedTags[_tag.identifier] ?? [])
      for (const tag of tags) {
        const r = await tag.compile(
          {
            parser: this,
            template,
            tag: _tag,
            context,
            ast,
            out,
          },
          compileContent,
        )
        if (r !== false) {
          if (r) {
            sourcemap.addMapping(_tag, r)
          }
          break
        }
      }
    }
  }

  private async compileContent({
    template,
    tag,
    context,
    ast,
    out,
    sourcemap,
  }: {
    template: string
    tag: StartTag
    context: string
    ast: AST
    out: OutScript
    sourcemap: SourceMap
  }) {
    if (tag.children.length) {
      for (const child of tag.children) {
        await this.compile(template, child, context, ast, out, sourcemap)
      }
    }
    else {
      out.pushStr(template.slice(tag.endIndex, tag.nextSibling!.startIndex), {
        trimStart: tag.stripAfter,
        trimEnd: tag.nextSibling!.stripBefore,
      })
      ast.goto(tag.nextSibling!)
    }
  }
}
