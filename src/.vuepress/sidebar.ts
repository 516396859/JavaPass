import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: " 面试基础专项",
      icon: "workingDirectory",
      prefix: "basic/",
      link: "basic/README",
      children: "structure", 
    },
    {
      text: "面试进阶专项",
      icon: "book",
      prefix: "mysql/",
      link: "basic/mysql/README",
      children: "structure",
    },
    {
      text: "文档",
      icon: "book",
      prefix: "guide/",
      children: "structure",
    },
    "slides",
  ],
});
