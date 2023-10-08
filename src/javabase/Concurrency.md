---
title: JUC并发与锁
icon: file
order: 6
author: Ms.Cheney
date: 2023-10-05
category:
    - Java 基础
copyright: 版权声明：本文为JavaPass博主「javapass.cn」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
---




### 1. 请说一下`CAS`原理？:star::star::star::star::two:
比较并且设置/交换（`CompareAndSet`），乐观锁的一种实现；写操作包括三步，第一步先读，第二步运算，第三步写回去；那么乐观锁是第一步读的时候记录这个内存值，写回到共享变量的时候判断当初读的期望值是否和内存上的值一致。如果一致表示没有别的线程修改，否则中途发送了修改，需要自旋重新`CAS`写入。弊端是`ABA`问题，无效自旋带来的开销太大，且只能保证一个共享变量的原子性。如果要保证多个变量原子性则使用`AtomicReference`类，多个共享变量合并成一个对象变量操作


**题评：** 非常重要的知识点！
::: details 点击查看详细答案
待补充...
:::

### 2. `CAS`中的`ABA`问题是什么？:star::star::star::two:
`CAS`将期望值与内存原值判断的时候，如果判断相等其实不能说明内存原值没有人改过，其实很可能是别的线程将`A`改为`B`后又改回了`A`，发生了修改但是看起来好像没有。如何避免？ 使用版本号机制的乐观锁。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 3. 讲一下`JUC`中的原子类？:star::star::star::two:
- 基本原子类：`AtomicInteger`、`AtomicLong`、`AtomicBoolean`。
- 数组原子类：`AtomicIntegerArray`，`AtomicReferenceArray`。
- 引用原子类：`AtomicReference`
以上是通过`CAS`和`Volatile`结合的方式实现的，`CAS`保证原子性，`Volatile`保证线程可见与避免指令重排。大大提高了并发的效率。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 4. `LongAdder` 的原理了解吗？:star::star::three:
在争用激烈的场景下，会导致大量的`CAS`空自旋。可以使用`LongAdder`替代`AtomicInteger`。以空间换时间，`LongAdder`核心思想就是热点分离，与`ConcurrentHashMap`的设计思想类似：将`value`值分离成一个数组（`base`+`cell`...），当多线程访问时，通过`Hash`算法将线程映射到数组的一个元素进行操作；而获取最终的`value`结果时，则将数组的元素求和。相当于分段乐观锁！

**题评：** 不怎么常考，但是`JUC`了解的话这个是必须知道的！
::: details 点击查看详细答案
待补充...
:::

### 5. 为什么代码会指令重排？:star::star::star::star::four:
- 为了提高执行速度会进行指令重排，但是需要满足以下两点：存在依赖关系的不允许重排；重排不影响单线程执行结果，但是会改变多线程的执行语义。
- 例如：`new` 一个对象，一般是三步，第一步申请堆内存空间，第二步初始化内存空间，第三步引用指向堆内存空间；但是很可能第二步和第三步会交换，指令重排。而在多线程环境下，判断一个对象是否不为空时，往往第二步还没执行完，但三步就判断不为空。而加了`Volatile`并不止禁止指令重排，而是在三步写操作未完成之前不允许判断为`null`时候的读。因此，最后判断时一定是完成了三步操作。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 6. 讲解一下 `Volatile`关键字的作用？:star::star::star::star::four:
- 保证线程可见性：线程修改变量后立即从工作内存刷到主存上，当读的时候如果被`Volatile`修饰了就直接从主存读取最新值而不是工作内存。
- 防止指令重排，即保证写操作会发生在后续的读操作之前，例如`new` 对象，但是无法保证原子性。

**题评：** 禁止代码重排是通过指令屏蔽实现的：关键词：`ll`，`ls`，`ss`，`sl` 指令屏蔽，普通读写，`Volatile`读写，来保证指令的一个顺序性。这一块比较难记忆，一般不会问这么细！达到这里基本上可以了！
::: details 点击查看详细答案
待补充...
:::

### 7. `Java`中可以保证数组的可见性吗？:star::star::star::three:
可以使用`Volatile`保证引用的可见性，即引用指向了其他数组是可见的，但是数组元素不会收到保护。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 8. `volatile` 能使得一个非原子操作变成原子操作吗？  :star::star::star::three:
不能，需要保证原子性可以加锁保证；但是修饰`Long`和`Double`可以保证原子性，与数据类型的位数有关，`64`位；

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 9. 在哪里使用过`volatile`修饰符？:star::star::star::star::three:
单例模式，给`instance`的声明加上`volatile`关键字 。`volatile`阻止的不是`singleton` = `newSingleton()`这句话内部`[1` `2`  `3]`的指令重排。保证了在一个写操作（`[1`  `3`  `2]`）完成之前，不会调用读操作（`if` `(instance` == `null)`  。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 10. `synchronized` 和 `volatile` 的区别是什么？ :star::star::star::star::star::three:
两个的作用完全不一样，`synchronized` 加锁保证原子性，修饰代码块和方法；`volatile` 只能修饰变量，保证可见性与避免指令重排

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 11. 什么是不可变对象`(Immutable` `Objects)`  ？:star::star::star::three:
使用`final`修饰的对象，一旦被创建对象数据不能改变；是线程安全的；常见的不可变类：`String`，基本数据类型包装类。但是对这些基本数据对象+`1`实际上是创建了新的对象，而不是修改原对象，因此多线程环境下并不保证线程安全。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 12. `Lock`接口用过吗？与`synchronized` 有什么区别？:star::star::star::star::star::three:
自己没有实现过`Lock`，但是用过`ReenterLock`，它是`Lock`接口的实现类，那么他与`synchronized`的区别就是可以实现更加灵活地更具扩展性地定义自己的锁。例如`ReenterLock`提供了公平锁，可中断`lockInterruptibly` 、可轮询`tryLock`等功能。另外`synchronized`是`JVM`语法层的锁，而`ReenterLock`是`JDK`提供的`API`锁实现，使用`synchronized`如果出现异常会自动释放锁，而`Lock`接口需要在`finally`块中手动释放锁。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 13. 什么是可重入锁？:star::star::star::star::three:
对同一资源可以重复加锁，例如同一线程中，`A`、`B`方法都是同一把锁，`A`调用`B`方法就是可重入。`ReentrantLock`  和 `synchronized`  都是可重入锁。但是分布式锁中的`Reids`实现不是可重入，`Redission`是可重入。他们的实现是使用重入标记`state`表示，每次重入+`1`，释放-`1`，等于`0`表示释放了锁。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 14. `ReadWriteLock` 是什么，有`ReentrantLock`  为什么需要`ReadWriteLock`？:star::star::star::three:
读写锁，读读不会被锁，只有写参与了才加锁；因为多线程读数据并不会导致数据发生改变，没有必要加锁，加锁降低程序性能。`ReentrantReadWriteLock` 是 `ReadWriteLock` 接口的一个具体实现，实现了读写的分离，读锁是共享的，写锁是独占的，读和读之间不会互斥，读和写、写和读、写和写之间才会互斥，提升了读写的性能。

**题评：** 无
::: details 点击查看详细答案
待补充...
:::

### 15. 有没有了解`CLH`队列？:star::star::four:
`CLH`队列是一个单向链表实现的`FIFO`队列，目的是`CLH`锁能大大减少`CAS`自旋带来的总线风暴。每个节点`Node`是包含三个重要属性，`locked`、`pre`、`thread`，首节点获取锁的节点，后面的都是排队等待锁的节点。当一个线程加入抢锁时，创建`Node`节点，通过`CAS`自旋加入到队列尾，指向前面的节点，通过普通自旋监控前面的节点是否释放了锁。如果前面节点释放了锁，则将指针指向`null`，然后将`locked`改为`false`。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 16. `AQS`抽象同步队列是什么？:star::star::star::star::star::four:
`AQS`是抽象同步队列，一个模板类用于构建自己的锁和同步容器，是`CLH`的一个变种。不同之处是采用双向链表，引入一个同步状态`vloatile` `int` `state`，其他和`CLH`原理类似。一开始`state`是`0`，新的线程来了调用`tryAcquire()` 独占锁，`state`+`1`，当其他线程也抢锁时，发现`state`不为`0`，于是构建`Node`通过`addwaiter()` `cas`入队。进入到队列的线程不会像`CLH`一样自旋判断前面的节点是否释放锁，而是进行了改进避免开销大，找到有效前驱（不是取消状态的`Node`），然后设置状态为`signal`，建立唤醒关系之后，进行自我阻塞。当头结点释放锁后，立即通知后驱节点唤醒，进行`CAS`抢锁，成为新的头节点。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 17. `ConcurrentHashMap`原理:star::star::star::star::star::three:
- `1`.`8`之前使用`segment`继承`ReentrantLock`充当锁（也称为并发度，默认`16`），`segment`维护哈希表的若干个同，每个桶由`HashEntry`构成的链表。
- `1`.`8`之后，抛弃了`Segment`分段锁，而采用 `CAS` + `synchronized` 来保证并发安全性。 

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 18. `AQS`共享锁的原理？:star::star::star::star::star::five:
共享锁包括`Semaphore`/`CountDownLatch`/`ReadWriteLock`等，因为`AQS`已经实现了很多模板方法，如果需要定义共享锁只需要重写共享资源`state`的获取与释放和同步队列的维护。以`Semaphore`为例，当设置可同时执行`N`个线程时，那么当`state`小于`N`就可以获取锁，大于`N`需要等待阻塞。`CountDownLatch`是`state`设置为`N`，当减一时`state`-`1`，只有`state`=`0`才开启主线程。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 19. `AQS`的公平锁和非公平锁？:star::star::star::star::star::four:
公平锁和非公平锁最主要体现在新来的线程是否无视队列中排队的节点直接抢占。
- 非公平锁：新的线程来了，自旋式判断`state`是否为`0`，如果为`0`等队列中的节点还没唤醒就立即抢占了。当两次自旋还没抢占则进入队尾进行排队等候。进入了队列那么就必须按照顺序来获得锁。
- 公平锁：每次新的线程来了先判断是否有前面的节点，即头结点后是否还有节点，如果有的话表示不能抢占，于是入队进行排队，直到头结点释放锁主动唤醒才能占用锁。
区别就是抢锁前是否判断前面有节点在排队。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 20. 并发容器与同步容器:star::star::star::star::star::four:
- 同步容器：通过`synchronized` 加锁实现同步，例如 `Vector`，`Hashtable`，`Collections`.`synchronizedSet` 等，都是在需要同步的方法上加`synchronized` 实现同步。特点就是简单粗暴的加锁实现，性能非常差。
- 并发容器：采用极致的优化方法提供并发的容器，例如`ConcurrentHashMap` 采用分段锁和`CAS`实现并发同步。共同点就是都提供了线程安全的集合，并发容器的可扩展性更高，并发性更好。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 21. `SynchronizedMap` 和 `ConcurrentHashMap` 有什么区别？  :star::star::star::star::three:
`SynchronizedMap` 每次修改锁中整个`HashMap`，`ConcurrentHashMap` 只是采用分段锁锁住一个`segment`，并不会影响其他的`segment`，大大提高并发率。且能避免快速失败。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 22. `CopyOnWriteArrayList`详解 :star::star::star::star::four:
`ArrayList` 的线程安全的版本，在`CopyOnWriteArrayList` 中，写入将导致创建整个底层数组的副本，而源数组将保留在原地，使得复制的数组在被修改时，读取操作可以安全地执行。当多个迭代器同时遍历和修改这个列表时，不会抛出`ConcurrentModificationException`。 适合读多写少的场景。缺点：由于写操作的时候，需要拷贝数组，会消耗内存，如果原数组的内容比较多的情况下，可能导致`young` `gc` 或者 `full` `gc`。每次都要复制全部数据，导致效率不高。设计思想：读写分离，复制副本来修改，避免并发冲突。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 23. 知道哪些阻塞队列？:star::star::star::star::star::four:
阻塞队列是支持两个附加操作的队列：在队列为空时，获取元素的线程会等待队列变为非空。当队列满时，存储元素的线程会等待队列可用。  常见的阻塞队列如下：
- `ArrayBlockingQueue`  ：数组实现的有界阻塞队列
- `LinkedBlockingQueue`  ：链表实现的有界|无界阻塞队列
- `PriorityBlockingQueue`  ：支持优先排序的无界阻塞队列，生产者永远不会阻塞， 只有消费者才会被阻塞。
- `DelayQueue`  ：优先队列实现的延迟无界阻塞队列，生产者永远不会阻塞， ，只有消费者才会被阻塞。只有当其指定的延迟时间到了，才能够从队列中获取到该元素。
- `SynchronousQueue`  ：不存储元素的同步阻塞队列，生产者生产一个对象放入队列，只有消费者消费了生产者才不会阻塞。一手交钱一手交货无中间商的直接交易。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 24. 聊下`Semaphore(`信号量`)`  ？:star::star::star::star::three:
运行`N`个线程同时获取共享锁，使用`acquire()`阻塞式获取锁和`release()`方法来释放信号量。`tryAcquire()`方法在不阻塞线程的情况下尝试获锁。运行`N`个线程同时持有共享锁访问资源，如果此时超过了`N`线程陷入阻塞。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 25. `CountDownLatch` 和 `CyclicBarrier`的区别？:star::star::star::star::star::three:
- `CountDownLatch(`倒计时器`)`  打王者加载 :：`CountDownLatch`是一个同步工具类，用来协调多个线程之间的同步。这个工具通常用来控制线程等待，它可以让某一个线程等待直到倒计时结束，再开始执行。例如，`count`为`100`，只有`count`减为`0`了，主线程才开始执行。
- `CyclicBarrier(`循环栅栏`)`  跑马拉松：`CyclicBarrier` 和 `CountDownLatch` 非常类似，  它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 26. 聊一下你认识的`synchronized`？:star::star::star::star::star::four:
在 `Java` `6` 之后， `synchronized` 引入了大量的优化如自旋锁、适应性自旋锁、锁消除、锁粗化、偏向锁、轻量级锁等技术来减少锁操作的开销，这些优化让 `synchronized` 锁的效率提升了很多。因此， `synchronized` 还是可以在实际项目中使用的，像 `JDK` 源码、很多开源框架都大量使用了 `synchronized` 。
- `synchronized` 关键字加到 `static` 静态方法和 `synchronized(class)` 代码块上都是是给 `Class` 类上锁；加到普通方法上是对象锁级别。
- `synchronized` 关键字加到实例方法上是给对象实例上锁；
- 尽量不要使用 `synchronized(String` `a)` 因为 `JVM` 中，字符串常量池具有缓存功能。

**题评：** 无
::: details 点击查看详细答案
`synchronized` 方法若发生异常，则`JVM`会自动释放锁。`synchronized`不能加在类的静态代码块，因为静态块类加载就执行，无需竞争；同步本身是不具备继承性的：即父类的`synchronized` 方法，子类重写该方法,分情况讨论：没有`synchonized`修饰，则该子类方法不是线程同步的。如果重写有`synchonized`修饰两个锁对象其实是一把锁，而且是子类对象作为锁。  

:::

### 27. 在开发过程中，你经常使用`synchronized`方法多还是`synchronized`代码块？为什么呢?:star::star::star::star::star::two:
`synchronized`代码块更多，`synchronized`同步的范围是越小越好。因为若该方法耗时很久，那其它线程必须等到该持锁线程执行完才能运行。而`synchronized`代码块部分只有这一部分是同步的，其它的照样可以异步执行，提高运行效率。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 28. 对象锁的同步队列了解吗？:star::star::star::four:
当前线程想调用对象`A`的同步方法时，发现对象`A`的锁被别的线程占有，此时当前线程进入对象锁的同步队列。简言之，同步队列里面放的都是想争夺对象锁的线程；当一个线程`1`被另外一个线程`2`唤醒时，`1`线程进入同步队列，去争夺对象锁。同步队列是在同步的环境下才有的概念，一个对象对应一个同步队列。线程等待时间到了或被`notify`/`notifyAll`唤醒后，会从等待队列进入同步队列竞争锁，如果获得锁，进入`RUNNABLE`状态，否则进入`BLOCKED`状态等待获取锁。所以在同步队列中才是阻塞状态，在等待队列中是等待状态。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 29. 对象锁的等待队列了解吗？:star::star::two:
等待队列存放的是等待唤醒的线程（调用`wait`）；这个不是阻塞状态而是等待状态，由于工作中不太区分阻塞态还是等待态并且操作系统只有阻塞态，因此一律称为阻塞状态；

**题评：** 无
::: details 点击查看详细答案
待补充
:::

