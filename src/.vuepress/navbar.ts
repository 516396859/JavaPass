import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "八股速通",
    icon: "lightbulb",
    prefix: "/guide/",
    children: [
      {
        text: "Bar",
        icon: "lightbulb",
        prefix: "bar/",
        children: ["baz", { text: "Java后端", icon: "ellipsis", link: "" }],
      },
      {
        text: "Foo",
        icon: "lightbulb",
        prefix: "foo/",
        children: ["ray", { text: "前端", icon: "ellipsis", link: "" }],
      },
    ],
  },
  {
    text: "大厂面经",
    icon: "book",
    link: "https://chenjie.blog.csdn.net/",
  },
]);
