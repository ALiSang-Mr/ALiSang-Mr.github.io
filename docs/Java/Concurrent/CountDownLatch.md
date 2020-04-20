JUC工具类: CountDownLatch详解

>CountDownLatch底层也是由AQS，用来同步一个或多个任务的常用并发工具类，强制它们等待由其他任务执行的一组操作完成。

[[TOC]]

::: warning 带着问题理解
- 什么是CountDownLatch? 
- CountDownLatch底层实现原理? 
- CountDownLatch一次可以唤醒几个任务? 
- 多个 CountDownLatch有哪些主要方法? await(),countDown() 
- CountDownLatch适用于什么场景? 
- 写道题：实现一个容器，提供两个方法，add，size 写两个线程，线程1添加10个元素到容器中，线程2实现监控元素的个数，
当个数到5个时，线程2给出提示并结束? 使用CountDownLatch 代替wait notify 好处。
:::

## CountDownLatch介绍

CountDownLatch 允许一个或多个线程等待其他线程完成操作。

CountDownLatch主要有两个方法：当一个或多个线程调用await()方法时，调用线程会被阻塞。其他线程调用countDownLatch方法会将计数器减1（调用countDown方法的线程不会阻塞），
当计数器的值变为0时，因调用await()方法被阻塞的线程会被唤醒，继续执行。

## CountDownLatch示例

### 示例一

``` java
public class CountDownLatchMain {

    public static void main(String[] args) throws InterruptedException {
        CountDownLatch latch = new CountDownLatch(5);
        StringBuffer sb = new StringBuffer(255);
        Thread waitThread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    sb.append("waitThread1 等待任务就绪;\n");
                    latch.await();
                    sb.append("waitThread1 等待结束;\n");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        Thread waitThread2 = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    sb.append("waitThread2 等待任务就绪;\n");
                    latch.await();
                    sb.append("waitThread2 等待结束;\n");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        waitThread1.start();
        waitThread2.start();
        for (int i = 0; i < 5; i++) {
            final int tmp = i;
            Thread task = new Thread(new Runnable() {
                @Override
                public void run() {
                    sb.append(String.format("task[%s] 准备就绪；\n", tmp));
                    latch.countDown();
                    sb.append(String.format("task[%s] 结束；\n", tmp));
                }
            });
            task.start();
        }
        waitThread1.join();
        waitThread2.join();
        sb.append("test 结束;\n");
        System.out.println(sb.toString());
    }
}
```
执行结果
``` java
waitThread1 等待任务就绪;
waitThread2 等待任务就绪;
task[0] 准备就绪；
task[2] 准备就绪；
task[4] 准备就绪；
task[3] 准备就绪；
task[1] 准备就绪；
task[2] 结束；
task[4] 结束；
task[0] 结束；
waitThread1 等待结束;
task[1] 结束；
task[3] 结束；
waitThread2 等待结束;
test 结束;
```

### 示例二

``` java
public class CountDownLactchDemo {

    public static void main(String[] args) {
        CountDownLatch countDownLatch = new CountDownLatch(6);
        for (int i = 1; i <= 6; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + "\t国，被灭。");
                countDownLatch.countDown();
            }, CountryEnum.forEach_CountryEnum(i).getRetMsg()).start();
        }
        try {
            countDownLatch.await();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + "\t秦帝国，一统华夏！");
    }
}
```
枚举类
``` java
public enum CountryEnum {
    ONE(1, "齐"),
    TWO(2, "楚"),
    THREE(3, "燕"),
    FOUR(4, "赵"),
    FIVE(5, "魏"),
    SIX(6, "韩");

    private Integer retCode;
    private String retMsg;

    public Integer getRetCode() {
        return retCode;
    }

    public void setRetCode(Integer retCode) {
        this.retCode = retCode;
    }

    public String getRetMsg() {
        return retMsg;
    }

    public void setRetMsg(String retMsg) {
        this.retMsg = retMsg;
    }

    CountryEnum(Integer retCode, String retMsg) {
        this.retCode = retCode;
        this.retMsg = retMsg;
    }

    public static CountryEnum forEach_CountryEnum(int index) {
        CountryEnum[] values = CountryEnum.values();
        for (CountryEnum value : values) {
            if (value.getRetCode() == index) {
                return value;
            }
        }
        return null;
    }
}
```
::: tips 示例讲解
CountryEnum是一个枚举类，是六国的枚举，包含一个构造方法，一个迭代方法，通过国家编号获取国家名称。CountDownLactchDemo类，先创建一个CountDownLatch类，
参数为计数次数。然后通过for循环，创建6个线程，每个线程都模拟循环数对应到枚举类中的国家被秦灭的过程，并对计数器减1（countDownLatch.countDown()）。
for循环启动线程后，调用countDownLatch.await()方法，阻塞main线程，直到之前6个线程全部执行完毕，代表六国已全部被灭。最后打印“main    秦帝国，一统华夏！”。
:::

### 示例三 
``` java
if (userList != null && userList.size() > 0) {
            List<List<User>> lis = Lists.partition(userList,900);
            final CountDownLatch cdl = new CountDownLatch(lis.size());
            for (final List<User> oneList : lis) {
                final SystemMsg finalSystemMsg = systemMsg;
                Constant.sync_executor.execute(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            List<Long> uidList = Lists.newArrayList();
                            for(User user : oneList){
                                if(backendSystemMsg.getPushStatus() != BackendSystemMsg.backend_push_status_yes){
                                    UserSystemMsgPool userSystemMsgPool = new UserSystemMsgPool();
                                    userSystemMsgPool.setSystemMsgId(finalSystemMsg.getId());
                                    userSystemMsgPool.setType(SystemMsg.type_system);
                                    userSystemMsgPool.setUid(user.getId());
                                    userSystemMsgPool.setStatus(SystemMsg.system_msg_status_create);
                                    userSystemMsgPoolDao.insert(userSystemMsgPool);
                                }
                                if(user.getPush() == User.push_nomore){
                                    uidList.add(user.getId());
                                }
                            }
                            //如果需要推送，直接推送消息
                            if(backendSystemMsg.getPushStatus() != BackendSystemMsg.backend_push_status_no ){
                                Map<String, String> extra = Maps.newHashMap();
                                extra.put("nid",String.valueOf(finalSystemMsg.getId()));
                                if(StringUtils.isNotBlank(finalSystemMsg.getUrl())){
                                    extra.put("url",String.valueOf(finalSystemMsg.getUrl()));
                                }
                                businessPushService.batchPush(uidList,finalSystemMsg.getTitle(),finalSystemMsg.getInfo(),extra, Platform.all);
                            }
                        } catch (Exception e) {
                            e.printStackTrace();
                        } finally {
                            cdl.countDown();
                        }
                    }
                });
            }
            cdl.await();
        }
        //等到前面的消息发送任务全部执行完成之后再执行下面的操作
        backendSystemMsg.setStime(System.currentTimeMillis());
        backendSystemMsg.setStatus(BackendSystemMsg.backend_system_msg_handle_success);
        return  backendSystemMsgDao.update(backendSystemMsg);
```
::: tips 实际使用
对需要接收消息的用户进行消息的发送 和 推送
:::

## CountDownLatch场景

如果你要执行一个任务，但是必须先等其他几个任务做到某个程度这个任务才能够启动，这个时候就比较适合用CountDownLatch。
但是一般会使用超时等待的方式来处理，不然如果其中某个任务异常没有完成，或者超时了，那么任务会一直等待在那里。

## 深入理解




