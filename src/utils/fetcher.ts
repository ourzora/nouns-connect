export const fetcher = (url: URL, isText = false) =>
  fetch(url).then((res) => (isText ? res.text() : res.json()));

export const textFetcher = (url: URL) =>
  fetch(url).then((res) => res.text());
