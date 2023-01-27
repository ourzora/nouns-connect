import localFont from "@next/font/local";

export const ptRootUi = localFont({
  variable: "--font-pt",
  src: [
    {
      path: "./../../public/fonts/PT-Root-UI_Regular.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./../../public/fonts/PT-Root-UI_Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./../../public/fonts/PT-Root-UI_Light.woff",
      weight: "300",
      style: "normal",
    },
  ],
});
