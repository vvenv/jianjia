import c from 'tinyrainbow';
import { Location } from '../source-map';

export const highlightSource = (
  message: string,
  source: string,
  locations: Location[],
) => {
  const output: string[] = [];
  const caretLines = new Set<number>();

  const addCaretLine = (index: number) => {
    caretLines.add(index - 2);
    caretLines.add(index - 1);
    caretLines.add(index);
    caretLines.add(index + 1);
    caretLines.add(index + 2);
  };

  const lines = source.split('\n');
  const indentWidth = String(lines.length).length + 2;

  // Copy to avoid mutation
  locations = [...locations];

  let cursor = 0;
  let caretLinesCount = 0;

  lines.forEach((line, index) => {
    output.push(
      `${c.gray(`${`${index + 1}: `.padStart(indentWidth, ' ')}`)}${line}`,
    );

    locations.forEach((tag) => {
      if (tag.startIndex! < cursor) {
        locations.splice(locations.indexOf(tag), 1);
        return;
      }
      if (tag.startIndex! >= cursor + line.length + 1) {
        return;
      }

      const offset = tag.startIndex! - cursor + indentWidth;
      const end = Math.min(tag.endIndex!, cursor + line.length);
      const count = end - tag.startIndex!;

      output.push(`${' '.repeat(offset)}${c.red('^'.repeat(count))}`);

      if (end < tag.endIndex!) {
        tag.startIndex! += count + 1;
      }

      addCaretLine(++caretLinesCount + index);
    });

    cursor += line.length + 1;
  });

  const emptyLine = `${c.gray(`${' '.repeat(indentWidth)}...`)}`;

  return `${c.bgRed(c.bold(' JianJia '))} ${c.red(message)}

${output
  .map((line, index) => (caretLines.has(index) ? line : emptyLine))
  .reduce(
    (acc, line) =>
      line === emptyLine && acc.at(-1) === line ? acc : [...acc, line],
    [] as string[],
  )
  .join('\n')}
`;
};
