export const loader = async (path: string) =>
  fetch(path).then((res) => res.text());
