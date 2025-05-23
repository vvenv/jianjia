import { expect, test } from 'vitest';
import { formatDatetime as fd } from './format-datetime';

test('number', () => {
  expect(fd({}, 1746410588992, 'y')).toMatchInlineSnapshot(`"2025"`);
  expect(fd({}, 1746410588992, 'yy')).toMatchInlineSnapshot(`"2025"`);
  expect(fd({}, 1746410588992, 'yyy')).toMatchInlineSnapshot(`"2025"`);
  expect(fd({}, 1746410588992, 'yyyy')).toMatchInlineSnapshot(`"2025"`);
  expect(fd({}, 1746410588992, 'y M d h m s D')).toMatchInlineSnapshot(
    `"2025 5 5 2 3 8 Mon"`,
  );
  expect(fd({}, 1746410588992, 'y MM dd hh mm ss DD')).toMatchInlineSnapshot(
    `"2025 05 05 02 03 08 Monday"`,
  );
});

test('string', () => {
  expect(fd({}, '2021-01-01T02:03:08.992Z', 'y')).toMatchInlineSnapshot(
    `"2021"`,
  );
  expect(fd({}, '2021-01-01T02:03:08.992Z', 'yy')).toMatchInlineSnapshot(
    `"2021"`,
  );
  expect(fd({}, '2021-01-01T02:03:08.992Z', 'yyy')).toMatchInlineSnapshot(
    `"2021"`,
  );
  expect(fd({}, '2021-01-01T02:03:08.992Z', 'yyyy')).toMatchInlineSnapshot(
    `"2021"`,
  );
  expect(fd({}, '2021-01-01T02:03:08.992Z', 'N NN')).toMatchInlineSnapshot(
    `"Jan January"`,
  );
  expect(
    fd({}, '2021-01-01T02:03:08.992Z', 'y M d h m s D'),
  ).toMatchInlineSnapshot(`"2021 1 1 2 3 8 Fri"`);
  expect(
    fd({}, '2021-01-01T02:03:08.992Z', 'y MM dd hh mm ss DD'),
  ).toMatchInlineSnapshot(`"2021 01 01 02 03 08 Friday"`);
});

test('translate', () => {
  expect(
    fd(
      { Jan: '一月', January: '一月', Mon: '一', Monday: '星期一' },
      '2021-01-01',
      'N NN D DD',
    ),
  ).toMatchInlineSnapshot(`"一月 一月 Fri Friday"`);
});
