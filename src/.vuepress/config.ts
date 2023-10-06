import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Java Pass",
  description: "Java Pass",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
