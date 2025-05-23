import { translate } from './translate';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const formatDatetime = (
  translations: Record<string, string> = {},
  value: string | number = 0,
  format: string,
) => {
  const d = new Date(value);

  const o: Record<string, (len: number) => string> = {
    y: () => `${d.getUTCFullYear()}`,
    M: (len) => `${d.getUTCMonth() + 1}`.padStart(len, '0'),
    N: (len) =>
      translate(
        translations,
        (len > 1 ? monthNames : shortMonthNames)[d.getUTCMonth()],
      ),
    d: (len) => `${d.getUTCDate()}`.padStart(len, '0'),
    h: (len) => `${d.getUTCHours()}`.padStart(len, '0'),
    m: (len) => `${d.getUTCMinutes()}`.padStart(len, '0'),
    s: (len) => `${d.getUTCSeconds()}`.padStart(len, '0'),
    D: (len) =>
      translate(
        translations,
        (len > 1 ? dayNames : shortDayNames)[d.getUTCDay()],
      ),
  };

  return format.replace(/y+|M+|N+|d+|h+|m+|s+|D+/g, (str) => {
    return o[str[0]](str.length);
  });
};
