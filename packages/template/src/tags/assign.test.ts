import { expect, test } from 'vitest';
import { parse } from '../../test/__helper';

test('basic', async () => {
  expect(await parse('{{ assign x = y }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";Object.assign(c,{x:c.y});return s;})();"`,
  );

  expect(await parse('{{ assign x = "a" }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";Object.assign(c,{x:"a"});return s;})();"`,
  );
});

test('invalid', async () => {
  expect(
    await parse('{{ assign x = y = 1 }}', { debug: true }),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ assign x = y = 1 }}");return s;})();"`,
  );

  expect(
    await parse('{{ assign 1 = "a" }}', { debug: true }),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ assign 1 = \\"a\\" }}");return s;})();"`,
  );
});

test('w/ expression', async () => {
  expect(await parse('{{ assign x = y and z }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";Object.assign(c,{x:c.y&&c.z});return s;})();"`,
  );
});

test('w/ filter', async () => {
  expect(await parse('{{ assign x = y | f a }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";Object.assign(c,{x:await f.f.call(c,c.y,c.a)});return s;})();"`,
  );
});

test('destructure', async () => {
  expect(await parse(`{{ assign x, y, z = a }}`)).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";Object.assign(c,{x:c.a.x,y:c.a.y,z:c.a.z});return s;})();"`,
  );
});

test('override', async () => {
  expect(
    await parse(`{{ assign x = 'y' }}{{ assign x = "y" }}`),
  ).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";Object.assign(c,{x:'y'});Object.assign(c,{x:"y"});return s;})();"`,
  );
});
