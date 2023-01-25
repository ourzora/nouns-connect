const onlySuccess = (res) => {
  if (res.status !== 200) {
    throw new Error("invalid");
  } else {
    return res;
  }
};

export const fetcher = (url: URL, isText = false) =>
  fetch(url)
    .then(onlySuccess)
    .then((res) => (isText ? res.text() : res.json()));

export const textFetcher = (url: URL) =>
  fetch(url)
    .then(onlySuccess)
    .then((res) => res.text());
