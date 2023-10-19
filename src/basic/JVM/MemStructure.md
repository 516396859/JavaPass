---
title: 内存结构
icon: file
order: 1
author: Ms.Cheney
date: 2023-10-19
PageView: true
lastUpdated: true
category:
    - JVM
copyright: false
footer: 赣ICP备2023007682 | 使用 <a href="https://theme-hope.vuejs.press/zh/" target="_blank">VuePress Theme Hope</a> 主题 | MIT 协议, 版权所有 © 2023-Cheney,2018-present Mr.Hope
# 版权声明：本文为JavaPass博主「javapass.cn」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
--- 

### 1. 简述`JVM`基本内存结构？:star::star::star::star::three:
堆内存（对象，串池，静态变量）、虚拟机栈（栈帧、方法的参数、返回地址、局部变量）、程序计数器（指向字节码运行的行号|位置）、本地方法栈（`native`方法的栈）、方法区（元空间、类结构、常量池、运行时常量池、`JIT`编译过的机器码）

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 2. 哪些内存结构线程共享？:star::star::star::star::three:
堆内存、方法区、直接内存

**题评：** 暂无
::: details 点击查看详细答案
待补充
:::

### 3. 哪些内存结构设计垃圾回收？:star::star::star::star::three:
 堆内存、方法区

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 4. 哪些内存内存结构发生内存溢出？:star::star::star::star::three:
除了程序计数器之外都会内存溢出；堆内存：对象太大太多；虚拟机栈：方法递归太深、局部变量太多太大；方法区：加载了太多第三方`jar`包、常量池过大；直接内存：物理内存不足；

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 5. 垃圾回收是否涉及栈内存？:star::star::star::star::three:
 不涉及、栈会自动出栈释放内存；

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 6. 栈内存分配越大越好吗？:star::star::star::star::three:
 栈内存越大，栈帧越多，能够更深递归，但是能够创建的线程数量会变少。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 7. 方法内的局部变量是否线程安全？:star::star::star::three:
一般局部变量在栈帧中，线程私有，线程安全；但是逃离了方法的作用范围非线程安全，例如通过参数传递逃离的引用变量。引用变量对象很可能存放在堆内存上，这是共享作用域，逃离了作用范围。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 8. 聊聊堆内存？:star::star::star::star::three:
堆内存分为年轻代和老年代，年轻代存放朝生暮死频繁生命周期短的对象，因此垃圾回收时大多数对象需要回收，适合复制算法进行垃圾回收。其中，年轻代分为伊甸区很幸存区；老年代空间比较大，一般占堆内存`2`/`3`，存放生命周期长的对象。一个对象创建时先存入伊甸区，当伊甸区内存不足时进行`minor` `GC`，伊甸区和`From`区的幸存对象复制到`To`区，生命加`1`，达到`15`进入老年区。当老年代空间不足时先触发`minorGC`再触发`Full` `GC`。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 9. 堆内存诊断工具知道吗？:star::star::star::star::three:
 `jmap` -`head` `12883`  查看`12883`进程堆内存占用情况。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 10. 变量存放在哪里？:star::star::star::star::three:
局部变量存放在栈中，成员变量存放在堆中，静态变量存放在方法区中，如果以上变量是引用，则对应的对象存放在堆中

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 11. 虚拟机栈和本地方法栈为什么是私有的?:star::star::star::star::three:
保证局部变量作用域只在本线程中，不被别的线程访问。

**题评：** 无
::: details 点击查看详细答案
待补充
:::
