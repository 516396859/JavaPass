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
- 保证线程可见：在JMM模型中，内存分为主内存和3级缓存，每个线程访问共享变量时都会从主存中读取变量值然后暂存在L1缓存中，每次修改都是先在缓存上修改，在一定时间后刷新到主存，这样就存在数据不一致的情况。通过volatile修饰的变量，强制线程每次都从主存中读取最新的值然后修改后都立即刷回到主存。保证其他线程能够在修改的第一时间获取变量最新值。
- 保证指令重排：指令重排是为了避免CPU切换跨度太大导致效率低下；但是在多线程并发情况下，指令重排会导致线程安全性问题。因此volatile通过四个指令屏蔽LL、LS、SL，SS来保证被Volatile修饰的变量前后是否可以普通读、普通写、volatile读、volatile写。例如，在单例模式下创建单例对象的时候需要volatile修饰单例对象，因为创建对象时会指令重排，先是申请内存，然后引用指向内存，然后创建对象。使用volatile就能保证只有三条原子语句都执行完了之后才能读到对象判断是否为null。
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
- 相同点：阻塞式同步锁、可重入锁（'state++'）
不同点：
- 这两种方式最大区别就是对于'Synchronized'来说，它是'java'语言的关键字，是原生语法层面的互斥，需要'jvm'实现。而'ReentrantLock'它是JDK 1.5之后提供的API层面的互斥锁，需要'lock()'和'unlock()'方法配合'try/finally'语句块来完成。  由于'ReentrantLock'是'java.util.concurrent'包下提供的一套互斥锁，相比'Synchronized'， 'ReentrantLock'类提供了一些高级功能，主要有以下3项： 
  a. 等待可中断，持有锁的线程长期不释放的时候，正在等待的线程可以选择放弃等待，这相当于'Synchronized'来说可以避免出现死锁的情况。 
  b. 公平锁，多个线程等待同一个锁时，必须按照申请锁的时间顺序获得锁，'Synchronized'锁非公平锁，ReentrantLock默认的构造函数是创建的非公平锁，可以通过参数'true'设为公平锁，但公平锁表现的性能不是很好。 
  c. 可实现选择性通知 (锁绑定多个条件), 一个'ReentrantLock'对象可以同时绑定对个对象。'Condition' 实例的 'signalAll()' 方法 只会唤醒注册在该 'Condition' 实例中的所有等待线程。 从而可用选择性通知唤醒而不是全部通知。'synchronized' 依赖于 JVM 而 'ReentrantLock' 依赖于 API
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
- 'SynchronizedMap' 通过对'HashMap'加'Synchronized'锁的机制每次都只能一个线程访问'HashMap'。
- 'ConcurrentHashMap'的实现却更加精细，采用分段锁原理，它对'map'中的所有16个桶加了锁。也就意味着最好的情况下同时可以16个线程操作'HashMap'，线程仍然可以对map其他桶执行某些操作。 所以，'ConcurrentHashMap'在性能以及安全性方面，明显比'Collections.synchronizedMap()'更加有优势。同步操作精确控制到桶，这样，即使在遍历'map'时，如果其他线程试图对'map'进行数据修改，也不会抛出'ConcurrentModificationException' 也就是'fail-fast'机制 。
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

### 30. 为什么`wait`和`notify`方法要在同步块中调用？:star::star::star::three:
当一个线程需要调用对象的`wait()`方法的时候，这个线程必须拥有该对象的锁，接着它就会释放这个对象锁并进入等待状态直到其他线程调用这个对象上的`notify()`方法。而使用`notify`唤醒某个对象，此时它并不会释放这个对象锁，而仅仅是通知某个对象唤醒进入同步队列去竞争锁。`Synchronized`的语义底层是通过一个`monitor`的对象来完成，其实`wait`/`notify`等方法也依赖于`monitor`对象，这就是为什么只有在同步的块或者方法中才能调用`wait`/`notify`等方法。

**题评：** 暂无
::: details 点击查看详细答案
待补充
:::

### 31. 为什么在循环中检查等待条件？:star::star::star::star::three:
因为操作系统的调度可能唤醒多个线程，即使没有显示使用`notify`。这个时候如果是`if`判断等待条件，那么第二次唤醒，就算不满足条件也会直接执行任务代码。而使用`while`循环，无论多少次唤醒都需要判断等待条件才能执行任务代码；

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 32. `Synchronized`的作用主要有哪些？:star::star::star::two:
- 原子性：保证线程互斥访问同步块。
- 可见性：保证共享变量的修改能够及时可见。
- 有序性：避免指令重排。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 33. `Java`对象头与锁和监视器的关系？:star::star::star::three:
对象头中有个字段是`MarkWord`，而监视器对象是`MarkWord`中的一个对象，每个对象都有一把隐式锁指定，这个锁就是监视器。但是`Synchronized`中只有重量级锁才涉及到监视器。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 34. `Synchronized` 锁优化了解吗？:star::star::star::three:
锁升级（锁优化）：无锁—>偏向锁—>轻量级锁—>重量级锁；
其他的补充优化：自旋锁—>适应性自旋锁；锁消除，锁膨胀；

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 35. 导致并发修改的原因？:star::star::star::four:
一个操作不是原子性的，`CPU`上下文切换导致指令交错执行。例如 `a`++，底层包括三个操作，从内存中读取值，+`1`操作，将运算后的结果写入内存。并发情况下，将导致读的是同一个值进行修改，最后后提交的将覆盖前面的值。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 36. 聊聊`synchronized`关键字？:star::star::star::star::star::three:
每个对象的对象头中都有一个锁标识字段，因此一个对象可以表示一把锁，`synchronized`就是使用的就是`Java`的内置锁。使用`synchronized`修饰的代码块同一时间只能有一个线程进入，其他线程排队等待。普通方法上使用的是`this`对象锁，静态方法上使用的是`Class`对象锁，同步块中的监视锁可以自己设置。`synchronized`不必担心锁释放问题，当同步块执行完毕或者出现异常时自动释放。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 37. 如何判断变量是否线程安全？:star::star::star::star::three:
- 没有共享—线程安全 （局部变量）
    `a`. 局部变量引用的对象有逃离方法作用域暴露出去—非线程安全
- 有共享 （成员变量|静态变量）
    `a`. 只读操作—线程安全
    `b`. 有写操作—非线程安全 

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 38. 有哪些线程安全的类?:star::star::star::star::three:
不可变类：`String`，基本数据类型包装类
`StringBuffer`、`Random`、`Vecotr`、`Hashtable`、`JUC`

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 39. 对象头结构与锁了解吗？:star::star::four:
对象头中的`MarkWord`用于存储对象的`HashCode`和内置锁信息，不同的锁占用的位数不一样，偏向锁存储的是持有锁的线程`ID`，轻量级锁存储的是栈中锁记录指针，重量级锁存储指向监视器指针。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 40. 四种内置锁了解吗？:star::star::star::star::three:
- 无锁，未加锁状态
- 偏向锁，当一个对象锁第一次被获取时会在对象头的`MarkWord`表示字段中记录此`A`线程`ID`表示偏向了`A`，当它下次获取锁时直接获取；而此时如果锁未被占用，线程`B`来获取会导致偏向锁的重偏向，最终线程`B`通过`CAS`来获得锁。如果是`A`持有锁，`B`也来竞争则导致偏向锁的锁升级。
- 轻量级锁，对象头中存储的是栈中的锁记录，竞争锁的方式为`CAS`自旋适合占用锁很短时间的情况，避免上下文切换。通过引入自适应自旋来优化。当大量线程竞争是，自旋超过指定时间还没有获取锁时会失败，此时锁膨胀为重量级锁。
- 重量级锁会让其他申请的线程之间进入阻塞，性能降低。重量级锁也就叫同步锁，这个锁对象`Mark` `Word`再次发生变化，会指向一个监视器对象，该监视器对象用集合的形式来登记和管理排队的线程，同步队列

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 41. 聊一聊偏向锁？:star::star::star::two:
如果是同一个线程多次获得锁，如果不是偏向锁将会导致无限制的获取锁、释放锁操作，这将导致无竞争情况下的系统底层的同步操作，性能很低。如果使用偏向锁，之前获得锁的线程再次获得锁时会判断偏向锁的线程`ID`是否指向自己。如果指向自己，拿锁成功。如果未指向当前线程，则判断是否该线程占用是否已经结束了。如果结束了当前线程会采用`CAS`操作将`Mark` `Word`中线程`ID`设置为当前线程`ID`，如果`CAS`操作成功，那么获取偏向锁成功，去执行同步代码块，如果当前线程没有结束，那么表示有竞争，抢锁线程被挂起，撤销占锁线程的偏向锁，然后将偏向锁膨胀为轻量级锁。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 42. 偏向锁的撤销？:star::star::star::four:
- 多线程竞争偏向锁，偏向锁膨胀为轻量级锁
- 调用偏向锁对象的`hashCode`方法，因为`MarkWork`线程`ID`占了`54`为撤销存放哈希值。
- 调用`wati`/`notify`，需要申请监视器，进入等待队列

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 43. 轻量级锁原理:star::star::star::three:
通过`CAS`修改对象头中的锁记录指针来竞争锁，避免用户态到内核态的频繁切换，当大量线程争夺锁时，自旋时间达到一定值会升级为重量级锁。适用于锁占用时间很短的多线程情景。整个过程没有阻塞挂起线程。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 44. `synchronized`的底层原理 | 重量级锁原理？:star::star::star::star::four:
`Monitor` 有`Owner`、`EntryList`、`WaitSet`三部分组成。`Owner`指向的是当前获取锁的线程，`EntryList`是争夺锁的线程进入排队的容器，同步队列。`WaitSet`存放调用`wait()`方法之后将被阻塞的线程，等待队列，被唤醒时进入`EntryList`重新竞争锁。总结：线程`X`执行到某个对象的临界区，获取锁的原理是：先通过此对象的`Mark` `word`的`Monitor`指针找到`Monitor`，然后检查`Owner`是否指向某个线程`ID`，如果有线程`ID`值则阻塞，将线程`X`加入到`EntryList`链表中同步等待。不同对象不同的锁（`Monitor`对象），类对象所有实例共享一个`Monitor`对象。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 45. `synchronized`执行过程？:star::star::star::star::four:
抢锁时先判断是不是偏向锁，如果是再判断是不是线程`ID`指向自己，如果是抢锁成功。如果不是那么判断此时锁是否被占用，如果没有占用进行`CAS`重偏向，否则膨胀为轻量级锁。轻量级锁是通过`CAS`自旋实现的，`MarkWord`中记录的是锁记录指针，如果`CAS`自旋超时失败则升级为重量级锁。重量级锁记录的是监视器对象，包括`Owner`、`EntryList`、`WaitSet`三个属性。

**题评：** 主要答锁升级的过程！
::: details 点击查看详细答案
待补充
:::

### 46. 锁消除了解吗？:star::star::star::three:
被检测出不可能存在竞争的共享数据的锁进行消除，这是 `JVM` 即时编译器的优化。锁消除主要是通过逃逸分析来支持，如果堆上的共享数据不可能逃逸出去被其它线程访问到，那么就可以把它们当成私有数据对待，也就可以将它们的锁进行消除。例如在单线程代码块中加锁，会进行优化，锁消除。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 47. 锁粗化了解吗？:star::star::star::three:
对相同对象多次加锁，导致线程发生多次重入，频繁的加锁操作就会导致性能损耗，可以使用锁粗化方式优化如果虚拟机探测到一串的操作都对同一个对象加锁，将会把加锁的范围扩展（粗化）到整个操作序列的外部。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 48. 了解`Semaphore`吗？:star::star::star::star::three:
`Semaphore`就是一个信号量，它的作用是限制某段代码块的并发数。`Semaphore`有一个构造函数，可以传入一个`int`型整数`n`，表示某段代码最多只有`n`个线程可以访问，如果超出了`n`，那么请等待，等到某个线程执行完毕这段代码块，下一个线程再进入。由此可以看出如果`Semaphore`构造函数中传入的`int`型整数`n`=`1`，相当于变成了一个`synchronized`了。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 49. `Future` 类有什么用？:star::star::star::star::three:
`Future` 类是异步思想的典型运用，主要用在一些需要执行耗时任务的场景，避免程序一直原地等待耗时任务执行完成，执行效率太低。具体来说是这样的：当我们执行某一耗时的任务时，可以将这个耗时任务交给一个子线程去异步执行，同时我们可以干点其他事情，不用傻傻等待耗时任务执行完成。等我们的事情干完后，我们再通过 `Future` 类获取到耗时任务的执行结果。这样一来，程序的执行效率就明显提高了。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 50. 什么是阻塞队列？:star::star::star::star::two:
阻塞队列（`BlockingQueue`）是一个支持两个附加操作的队列。这两个附加的操作是：在队列为空时，获取元素的线程会等待队列变为非空。当队列满时，存储元素的线程会等待队列可用。阻塞队列常用于生产者和消费者的场景，生产者是往队列里添加元素的线程，消费者是从队列里拿元素的线程。阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 51. 阻塞队列的实现原理是什么？:star::star::star::three:
实现原理：其实阻塞队列实现阻塞同步的方式很简单，使用的就是是`lock`锁的多条件（`condition`）阻塞控制。它用来替代传统的`Object`的`wait()`、`notify()`实现线程间的协作，相比使用`Object`的`wait()`、`notify()`，使用`Condition`的`await()`、`signal()`这种方式实现线程间协作更加安全和高效。使用`BlockingQueue`封装了根据条件阻塞线程的过程，而我们就不用关心繁琐的`await`/`signal`操作了。 

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 52. 乐观锁和悲观锁的理解及如何实现，有哪些实现方式？:star::star::star::star::three:
- 悲观锁：每次修改数据都加锁，其他线程在对象锁被持有的情况下无法访问数据，需要等待它释放锁后抢锁才能访问数据。例如`synchronized`、`ReenterLock`加锁都是悲观锁，还有数据库的行锁、表锁等。
- 乐观锁：每次访问数据都不加锁，提交数据时才判断是否期间已经被其他线程访问过，如果访问失败则重新竞争访问呢。普通乐观锁使用数据本身作为版本号会出现`ABA`问题，而版本号法式递增的过程不会出现`ABA`问题。`Java` `JUC`中有`Compare` `and` `Swap`的实现。
- 乐观锁版本号机制：一般是在数据表中加上一个数据版本号 `version` 字段，表示数据被修改的次数。当数据被修改时，`version` 值会加一。当线程 `A` 要更新数据值时，在读取数据的同时也会读取 `version` 值，在提交更新时，若刚才读取到的 `version` 值为当前数据库中的 `version` 值相等时才更新，否则重试更新操作，直到更新成功。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 53. 如何禁止指令重排序？:star::star::star::star::four:
在 `Java` 中，`volatile` 关键字除了可以保证变量的可见性，还有一个重要的作用就是防止 `JVM` 的指令重排序。 如果我们将变量声明为 `volatile` ，在对这个变量进行读写操作的时候，会通过插入特定的 内存屏障 的方式来禁止指令重排序。例如被`volatile`修饰的变量，假设它不是一个原子操作，需要三步；并发的时候，如果需要读这个值需要先等写完毕才能读，因此能保证写和读的顺序，通过 `ll` `ls` `sl` `ss` 指令进行内存屏障，禁止普通读写、`volatile`读写。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 54. 公平锁与非公平锁的区别和原理？:star::star::star::star::four:
- 公平锁 : 锁被释放之后，先申请的线程先得到锁。性能较差一些，因为公平锁为了保证时间上的绝对顺序，上下文切换更频繁。
- 非公平锁 ：锁被释放之后，后申请的线程可能会先获取到锁，是随机或者按照其他优先级排序的。性能更好，但可能会导致某些线程永远无法获取到锁。
原理：
- 公平锁，每次判断`state`为`0`时不能立即抢占，而是判断是否还有前置结点，也就是判断首节点后面是否还有结点排队等候，如果有通过`cas`入队。
- 非公平锁，新线程来了，不管有没有其他结点在`CLH`链表上排队先`cas`抢占，如果两次强锁失败，那么就进入到队列中，其实这和公平锁一样啦，需要排队。当没有新的线程抢占时，强锁也是按照队列先后顺序来抢的，类似公平锁。
非公平锁和公平锁 最大的区别就是新来的线程是不是插队抢占，如果它没抢到那后面就是老老实实排队，后面唤醒也要等前面的结点出队了才能唤醒，而且入队的结点可能存在饥饿。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 55. 构造方法可以用 `synchronized` 修饰么？:star::star::star::two:
构造方法不能使用 `synchronized` 关键字修饰。构造方法本身就属于线程安全的，不存在同步的构造方法一说。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 56. `JDK1`.`6` 之后的 `synchronized` 底层做了哪些优化？:star::star::star::star::three:
`JDK1`.`6` 对锁的实现引入了大量的优化，如偏向锁、轻量级锁、自旋锁、适应性自旋锁、锁消除、锁粗化等技术来减少锁操作的开销。锁主要存在四种状态，依次是：无锁状态、偏向锁状态、轻量级锁状态、重量级锁状态，他们会随着竞争的激烈而逐渐升级。注意锁可以升级不可降级，这种策略是为了提高获得锁和释放锁的效率。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 57. 可中断锁和不可中断锁有什么区别？:star::star::star::star::three:
- 可中断锁 ：获取锁的过程中可以被中断，不需要一直等到获取锁之后 才能进行其他逻辑处理。`ReentrantLock` 就属于是可中断锁。
- 不可中断锁 ：一旦线程申请了锁，就只能等到拿到锁以后才能进行其他的逻辑处理。 `synchronized` 就属于是不可中断锁。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 58. 线程持有读锁还能获取写锁吗？:star::star::star::four:
本线程持有读锁不能获取写锁，持有写锁可以继续获取读锁。 写锁可以降级为读锁，但是读锁却不能升级为写锁。这是因为读锁升级为写锁会引起线程的争夺，毕竟写锁属于是独占锁。但是写锁可以降级成读锁。读写锁只能锁降级：拥有写锁->获取读锁->释放写锁。  因此拥有写锁可以获取读锁。 

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 59. `Thread`类中的`yield`方法有什么作用？:star::star::star::three:
`Yield`方法可以暂停当前正在执行的线程对象，让其它有相同优先级的线程执行。它是一个静态方法而且只保证当前线程放弃`CPU`占用而不能保证使其它线程一定能占用`CPU`，执行`yield()`的线程有可能在进入到暂停状态后马上又被执行。

**题评：** 无
::: details 点击查看详细答案
待补充
:::

### 60. 线程安全需要保证几个基本特征？:star::star::star::three:
- 原子性，简单说就是相关操作不会中途被其他线程干扰，一般通过同步机制实现。
- 可见性，是一个线程修改了某个共享变量，其状态能够立即被其他线程知晓，通常被解释为将线程本地状态反映到主内存上，`volatile` 就是负责保证可见性的。
- 有序性，是保证线程内串行语义，避免指令重排等。

**题评：** 无
::: details 点击查看详细答案
待补充
:::
