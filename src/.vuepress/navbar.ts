import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "八股速通",
    icon: "lightbulb",
    prefix: "/basic/",
    children: [
      {
        text: "Java面试专项",
        icon: "/java.svg",
        prefix: "javabase/",
        children: [{ text: "Java面试专项", icon: "java", link: "" }],
      },
      {
        text: "MySQL面试专项",
        icon: "book",
        prefix: "mysql/",
        children: [{ text: "MySQL面试专项", icon: "mysql", link: "" }],
      },
    ],
  },
  {
    text: "大厂面经",
    icon: "book",
    link: "https://chenjie.blog.csdn.net/",
  },
]);