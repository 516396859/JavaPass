import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "Java 基础",
      icon: "laptop-code",
      prefix: "javabase/",
      link: "javabase/",
      children: "structure",
    },
    {
      text: "MySQL 数据库",
      icon: "book",
      prefix: "mysql/",
      link: "mysql/",
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
