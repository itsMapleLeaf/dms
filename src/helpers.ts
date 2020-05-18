export function fetchJson(url: string) {
  return fetch(url).then((res) => res.json())
}

export function raise(msg: string): never {
  throw new Error(msg)
}
