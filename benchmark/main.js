import fs from 'node:fs';

let templateDirs = fs.readdirSync('./templates');
let engineDirs = fs.readdirSync('./engines');

let enabledGroups = [];
let enabledEngines = [];

if (enabledGroups && enabledGroups.length > 0) {
  templateDirs = templateDirs.filter((dir) => enabledGroups.includes(dir));
}

if (enabledEngines && enabledEngines.length > 0) {
  engineDirs = engineDirs.filter((engine) =>
    enabledEngines.includes(engine.split('.').slice(0, -1).toString()),
  );
}

const bench = async (engine, template, data, n) => {
  const start = Date.now();
  for (let i = 0; i < n; i++) {
    await engine.render(template, data);
  }
  const end = Date.now();
  return (end - start) / n;
};

let results = `## Benchmark\n\n`;

const allEngines = [
  ...new Set(engineDirs.map((e) => e.split('.').slice(0, -1).toString())),
];
const allTemplates = templateDirs;

const matrixData = {};

for (let dir of allTemplates) {
  const dataPathJs = './templates/' + dir + '/data.js';
  const dataPathJson = './templates/' + dir + '/data.json';
  let data;

  if (fs.existsSync(dataPathJs)) {
    data = await import(dataPathJs).then((m) => m.default);
  } else if (fs.existsSync(dataPathJson)) {
    data = await import(dataPathJson, {
      with: {
        type: 'json',
      },
    }).then((m) => m.default);
  } else {
    data = {};
  }

  const n = 1000;

  for (let engine of allEngines) {
    const engineFile = engineDirs.find((e) => e.startsWith(engine));
    if (!engineFile) continue;

    const enginePath = await import('./engines/' + engineFile).then(
      (m) => m.default,
    );
    const templatePath = './templates/' + dir + '/template.' + enginePath.ext;

    if (fs.existsSync(templatePath)) {
      console.log(`${engine} working on ${dir}...`);
      const benchmark = await bench(enginePath, templatePath, data, n);
      console.log(`${engine} has finished to work !\n`);

      if (!matrixData[dir]) matrixData[dir] = {};
      matrixData[dir][engine] = benchmark.toFixed(2);
    }
  }
}

results += `| Template \\ Engine | ${allEngines.join(' | ')} |\n`;
results += `|-------------------|${allEngines.map(() => ':--------:').join('|')}|\n`;

allTemplates.forEach((template) => {
  const row = [`**${template}**`];
  const times = [];

  allEngines.forEach((engine) => {
    const time = matrixData[template]?.[engine];
    times.push(time ? parseFloat(time) : null);
  });

  const validTimes = times.filter((t) => t !== null);
  const minTime = validTimes.length ? Math.min(...validTimes) : 0;
  const maxTime = validTimes.length ? Math.max(...validTimes) : 0;
  const range = maxTime - minTime;

  allEngines.forEach((_, i) => {
    const time = times[i];

    if (time === null) {
      row.push('-');
    } else {
      const ratio = range > 0 ? (time - minTime) / range : 0;

      let emoji;
      if (time === minTime) {
        emoji = '🟢';
      } else if (ratio <= 0.3) {
        emoji = '🟡';
      } else if (ratio <= 0.6) {
        emoji = '🟠';
      } else if (ratio <= 0.9) {
        emoji = '🔴';
      } else {
        emoji = '⚫';
      }

      row.push(`${emoji} ${time.toFixed(2)}`);
    }
  });

  results += `| ${row.join(' | ')} |\n`;
});

fs.writeFileSync('readme.md', results);
