const loadImageAsset = (url: string): string => {
  // return new URL(`../assets/`+url,import.meta.url).href
  if (import.meta.env.VITE_IS_GITHUB_PAGES) {
    return `/neco/` + url
  }
  return `/` + url
}

export default loadImageAsset

// TODO: change all assets to public
