import localFont from '@next/font/local'

export const Londrina = localFont({
  variable: '--font-londrina',
  src: [
    {
      path: './../../public/fonts/LondrinaSolid-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './../../public/fonts/LondrinaSolid-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './../../public/fonts/LondrinaSolid-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
})
