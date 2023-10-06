<div align=center>
<img src=https://github.com/516396859/JavaPass/assets/43902436/dd8bd56b-523c-46b1-83dd-670d4735fbb0 width=30% />
</div> 

#### 什么是`JavaPass`？

+ `JavaPass` 目标是构建一个最简洁、纯粹的八股文论坛，它适合校招二轮之后和社招童鞋的及时巩固与复习，也适合面试前的最后冲刺。目前我们的官网正在升级当中，你可以点击 [www.javapass.cn](http://www.javapass.cn)进行体验。

+ 未来期望：我们构想的`JavaPass` 社区将是一个完全开源，大家共建的社区，在这里每一道面试题都完全由大家讨论，任何人都可以修改、补充、完善每一道题的最好的答案。而每一位贡献者我们将加入本站的贡献者名单。在未来我们将加入 `百题Pass` 功能，每一道已经掌握的面试题你都可以尽情`Pass`掉。未来还将加入AI面试功能，你可以在这里和AI进行面试，AI将会根据你的答案进行评分，你可以在这里和AI进行无限次的面试，直到你拿到`Offer`为止。我们非常欢迎大家的加入，让我们一起构建一个最纯粹的八股文论坛。

#### 有`JavaGuide`为什么还要`JavaPass`？

`JavaGuide` 是一个非常完善的八股文社区，社区的 `Java` 知识体系比较完善。`JavaPass`不是`JavaGuide`的替代品，`JavaPass`而是`JavaGuide`的补充与发展。如果你的基础比较薄弱，我们强烈推荐阅读`JavaGuide`的精品内容，我们也是`JavaGuide`的受益者，非常感谢`Snailclimb`。但是在读完了`JavaGuide`后我相信你会使用`JavaPass`构建自己的知识体系，为了大家在后续的求职过程中稍微轻松一点，我们构建了`JavaPass`社区，希望能够帮助到大家。最后总结`JavaPass`的优点：简约纯粹、关键词式记忆、快速巩固、社区讨论！

#### 我们是谁？

我们是一群正在参加秋招的即将毕业的研三学生，经历过24年的秋招，我们深知秋招的艰辛，我们希望能够帮助到大家，让大家少走一些弯路，少踩一些坑。我们是一群热爱技术的学生，我们希望在这里能够找到志同道合的朋友，一起成长，一起进步。八股文要背好，但是时间不要花费太多。研一、研二如果有时间，强烈建议找大厂去实习！！！（超级加分）。

####  如何参与项目维护？

`JavaPass`是通过`VuePress`项目构建知识库，它通过解析`Markdown`文件生成静态页面，因此它是非常便于维护的。目录结构如下所示：

![image-20231006154515869](https://github.com/516396859/JavaPass/assets/43902436/0a61cd4a-18ed-41ae-973a-aa8e5c8ab8a5)


首先你需要切换`dev`分支，然后找到需要修改的文档，例如我找`Java`基础章节的基础概念的篇章就是上图的`BasicConcepts.md`文档，你可以在线编辑它然后提交即可，如下图所示：

![image-20231006154820215](https://github.com/516396859/JavaPass/assets/43902436/05a23a96-e83c-4867-82fa-844996db8974)


点击右上角红色方框中的编辑按钮，编辑后提交我们就能看见你的提交记录，我们会及时将你的更新合并进master主线分支中，然后及时更新在官网，最后我们会将你加入到贡献者名单并在官网此题后面显示你的`github`名字。最后我需要和您讲清楚如何编辑文档，以官网第一题为例，如下我们将一个题目分为五部分，分别是：题目、标记、简答、题评、详细回答 五部分。



五部分内容你都可以修改，下面给出上述第一题`markdown`的修改格式：

```markdown
### 1. Java 语言的基本特点? :star: :one:
- 面向对象（封装，继承，多态）；
- 平台无关性（ Java 虚拟机实现平台无关性）；
- 编译与解释并存 ( .java文件编译成字节码 .class，解释器对字节码进行解释运行)；
- 支持多线程 (C++、Python 语法层面不支持多线程)；

**题评：** 此题不难，属于必知必会的知识点，中大厂基本不会问，银行和一些微小厂可能会问到。属于答出来了不加分，答不出来直接挂的题目。记忆关键词即可，然后按照自己的理解展开括号中的内容即可。可以自我发挥，但围绕这几个关键词展开即可，一定记住前面两个关键词，后两个尽量记住。

::: details 点击查看详细答案
Java 语言是一种面向对象的语言，它的三个主要特点是：封装、继承、多态。Java 语言的最具特色的地方就是它的平台无关性，也就是说，Java 语言编写的应用程序在不同的系统平台上都可以运行。Java 语言是一个编译与解释并存的语言，Java 语言编写的程序首先被编译成字节码，然后由 Java 解释器对字节码进行解释运行。Java 语言支持多线程，这对于实现高性能程序很重要。
:::
```

基本格式如下：

```markdown
### 1. 这里可以编写你的题目  :star:  :one:  
- 建议分点回答，尽量简洁
- 详细的内容可以放最后的详细答案部分
- :star: 一颗星，表示此题面试不频繁出现，最大五颗星，:star::star::star:将显示3颗星
- :one:  表示面试题的难度，:five:最大，表示最难。

**题评：**  !!!如果需要的话，在这里你可以写题评!!!

::: details 点击查看详细答案
    !!!如果需要的话，你可以在这里写详细答案!!!
:::
```

每一位贡献者的答案都会得到合理的展示，我们后期将以评论的形式展示其他贡献者的答案，这取决于您提交答案的质量。

#### 关于国内官网的一些问题

##### 为什么没有论坛讨论板块？

一开始我们是准备论坛模块的，但是国内审核非常严格，要求个人网站不得登录、评论等功能。后期我们准备合法申请获得评论功能的资格。并进一步提供更多的功能支持，我们诚挚邀请您的加入！另外，在github我们提供了评论功能的镜像网站，网址不久将会更新出来。

##### 百题Pass 功能什么时候上线？

我们的规划中是有百题Pass的功能，但是目前`JavaPass`刚刚起步，这需要我们网站审核过后获得更多合法资格之后上线，敬请期待！

##### 未来`JavaPass`是否收费？

收费是有违我们的初衷，我们承诺`JavaPass`永久免费，但考虑到学生没有收入存在运维成本我们开放自愿捐赠渠道，这完全取决您个人意愿是否资助我们的公益性网站。

##### 开源协议是什么？

`Apache License 2.0`，你可以免费使用本站任何开源的内容！

##### 未来规划是什么？

未来会增加更多的讨论功能和大厂面经功能，甚至提供给用户个人知识库定制修改的权限，敬请期待！
