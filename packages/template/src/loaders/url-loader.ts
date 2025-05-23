export async function loader(path: string) {
  return fetch(path).then(res => res.text())
}
