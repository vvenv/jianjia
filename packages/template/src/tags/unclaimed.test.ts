import { expect, test } from 'vitest';
import { parse } from '../../test/__helper';

test('basic', async () => {
  expect(await parse('{{ > }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ > }}");return s;})();"`,
  );

  expect(await parse('{{ < }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ < }}");return s;})();"`,
  );

  expect(await parse('{{ alert("XSS") }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ alert(\\"XSS\\") }}");return s;})();"`,
  );

  expect(await parse('{{ window.alert("XSS") }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ window.alert(\\"XSS\\") }}");return s;})();"`,
  );

  expect(await parse('{{ #x }}{{ /x }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e("{{ #x }}");s+=e("{{ /x }}");return s;})();"`,
  );

  expect(await parse('{{ x }}{{ end_x }}')).toMatchInlineSnapshot(
    `""use strict";return (async ()=>{let s="";s+=e(c.x);s+=e(c.end_x);return s;})();"`,
  );

  expect(await parse('{{ layout "default" }}')).toMatchInlineSnapshot(`""use strict";return (async ()=>{let s="";s+=e("{{ layout \\"default\\" }}");return s;})();"`);
});
