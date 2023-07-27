export const replaceRange = (
  original: string,
  start: number,
  end: number,
  replacement: string
) => {
  const startPortion = original.substring(0, start);
  const endPortion = original.substring(end);
  return `${startPortion}${replacement}${endPortion}`;
};
