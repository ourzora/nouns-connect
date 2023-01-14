import localFont from '@next/font/local'

export const Londrina = localFont({
  variable: '--font-londrina',
  src: [
    {
      path: '../../node_modules/@fontsource/londrina-solid/files/londrina-solid-latin-400-normal.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/londrina-solid/files/londrina-solid-latin-300-normal.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../node_modules/@fontsource/londrina-solid/files/londrina-solid-latin-900-normal.woff',
      weight: '900',
      style: 'normal',
    },
  ],
})
