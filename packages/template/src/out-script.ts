import { CONTEXT, ESCAPE, FILTERS } from './config';
import { Location } from './source-map';
import { EngineOptions, ParsedFunction } from './types';
import { compileExpression } from './utils/compile-expression';
import { Statement } from './utils/parse-statement';

export class OutScript {
  private content = '';
  private start0 = '';
  private end0 = '';
  private strOffset = `s+="`.length;
  private varOffset = `s+=${ESCAPE}(`.length;

  constructor(public options: Required<EngineOptions>) {
    this.start0 = this.options.start.charAt(0);
    this.end0 = this.options.end.charAt(0);
  }

  get value() {
    return this.content;
  }

  get script() {
    return new Function(CONTEXT, FILTERS, ESCAPE, this.value) as ParsedFunction;
  }

  start() {
    if (this.options.strictMode) {
      this.pushLine(`"use strict";`);
    }

    this.pushLine('return (async ()=>{');
    this.pushLine('let s="";');
  }

  end() {
    this.pushLine('return s;');
    this.pushLine('})();');
  }

  pushLine(...lines: string[]): Location {
    const startIndex = this.content.length;
    for (const line of lines) {
      this.content += line;
    }
    return {
      startIndex,
      endIndex: this.content.length,
    };
  }

  pushStr(
    s: string,
    o?: { trimStart: boolean; trimEnd: boolean },
  ): Location | void {
    if (s) {
      if (o?.trimStart) {
        s = s.trimStart();
      }
      if (o?.trimEnd) {
        s = s.trimEnd();
      }
    }
    if (s) {
      const startIndex = this.content.length + this.strOffset;
      s = this.unescapeTag(s)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/[\n\r]/g, '\\n');
      this.pushLine(`s+="${s}";`);
      return {
        startIndex,
        endIndex: this.content.length - 2,
      };
    }
  }

  pushVar(v: string): Location {
    const startIndex = this.content.length + this.varOffset;
    this.pushLine(`s+=${ESCAPE}(${v});`);
    return {
      startIndex,
      endIndex: startIndex + v.length,
    };
  }

  unescapeTag(v: string) {
    const { start0, end0 } = this;
    return v.replace(new RegExp(`\\\\(${start0}|${end0})`, 'g'), '$1');
  }

  compileStatement(statements: Statement[] = [], context: string) {
    return statements
      .map(({ type, value, filters }) =>
        type === 'expression'
          ? compileExpression(value, context, filters)
          : value === 'in'
            ? ' in '
            : value,
      )
      .join('');
  }
}
