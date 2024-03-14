export function getDayDifference(date1: Date, date2: Date): string {
  const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' });

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  const difference = Math.abs(time2 - time1);

  return rtf1.format(Math.floor(difference / millisecondsPerDay), 'day');
}
