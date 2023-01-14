import localFont from "@next/font/local";

export const ptRootUi = localFont({
  variable: '--font-pt',
  src: [
    {
      path: "../../node_modules/pt-root-ui-font/regular.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/pt-root-ui-font/bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../node_modules/pt-root-ui-font/light.woff2",
      weight: "300",
      style: "normal",
    },
  ],
});
