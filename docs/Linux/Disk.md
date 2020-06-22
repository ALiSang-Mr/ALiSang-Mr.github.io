# 磁盘管理

[[TOC]]

## df：

**常用参数：**
``` markdown
选项说明：
	-a：列出所有的文件系统，包括系统特有的/proc等文件系统
	-k：以KB的容量显示各文件系统
	-m：以MB的容量显示各文件系统
	-h：以人们较易阅读的GB,MB,KB等格式自行显示
	-H：以M=1000K替代M=1024K的进位方式
	-T：连同该分区的文件系统名称（例如ext3）也列出
	-i：不用硬盘容量，而以inode的数量来显示
```

**常用用法：**
``` markdown
 ~]# df -h 		#常见用法
Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/centos-root   17G  9.2G  7.8G  55% /
devtmpfs                 1.9G     0  1.9G   0% /dev
...

~]# df -Th		#连同该分区的文件系统名称也列出
Filesystem              Type      Size  Used Avail Use% Mounted on
/dev/mapper/centos-root xfs        17G  9.2G  7.8G  55% /
devtmpfs                devtmpfs  1.9G     0  1.9G   0% /dev
tmpfs                   tmpfs     1.9G     0  1.9G   0% /dev/shm
```

- Filesystem：代表该文件系统是在哪个分区，所以列出设备名称
- Type：文件系统类型
- Size：分区大小
- Used：使用掉的硬盘空间
- Available：剩下的磁盘空间大小
- Use%：磁盘使用率
- Mounted on：磁盘挂载的目录所在（挂载点）

## du
查看当前目录下的文件及文件夹所占大小：
``` shell script
du -h --max-depth=1 ./*
```

## iostat：
iostat主要统计磁盘或分区的整体使用情况
``` shell script
yum install sysstat -y 		#iostat需要自行安装，在sysstat包中
```

**常用参数：**
``` markdown
iostat [options]
选项说明：
	-c：统计cpu信息
	-d：统计磁盘信息
	-n：统计NFS文件系统信息
	-h：使NFS统计信息更人类可读化
	-k：指定以kb/s为单位显示
	-m：指定以mb/s为单位显示
	-p：指定要统计的设备名称
	-y：指定不显示第一次统计信息，即不显示自开机起的统计信息。
	interval：刷新时间间隔
	count：总统计次数
```
**常用用法：**
``` shell script
iostat 			#默认还会统计cpu的信息
Linux 3.10.0-957.el7.x86_64 (localhost.localdomain)     09/15/2019      _x86_64_        (4 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.03    0.00    0.09    0.01    0.00   99.87

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sda               0.27         1.50        13.17     420518    3703847
scd0              0.00         0.00         0.00       1028          0

iostat -d		#只统计磁盘情况
Linux 3.10.0-957.el7.x86_64 (localhost.localdomain)     09/15/2019      _x86_64_        (4 CPU)

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sda               0.27         1.49        13.18     420518    3710597
scd0              0.00         0.00         0.00       1028          0
```

各列的意义都很清晰，从字面即可理解
- tps：每秒transfer速率(transfers per second),一次对物理设备的IO请求为一个transfer，但多个逻辑请求可能只组成一个transfer
- Blk_read/s：每秒读取的block数量
- Blk_wrtn/s：每秒写入的block总数
- Blk_read：读取的总block数量
- Blk_wrtn：写入的总block数量

## iotop：
>iotop命令是一个用来监视磁盘I/O使用状况的top类工具。iotop具有与top相似的UI，其中包括PID、用户、I/O、进程等相关信息。
>Linux下的IO统计工具如iostat，nmon等大多数是只能统计到per设备的读写情况，如果你想知道每个进程是如何使用IO的就比较麻烦，
>使用iotop命令可以很方便的查看
```shell script
 yum install -y iotop	#可直接yum安装，依赖于base源
```
**常用参数：**
``` markdown
iotop [options]
选项说明：
	-o：只显示有io操作的进程
	-b：批量显示，无交互，主要用作记录到文件
	-n NUM：显示NUM次，主要用于非交互式模式
	-d SEC：间隔SEC秒显示一次
	-p PID：监控的进程pid
	-u USER：监控的进程用户

常用快捷键：
	左右箭头：改变排序方式，默认是按IO排序
	r：改变排序顺序
	o：只显示有IO输出的进程
	p：进程/线程的显示方式的切换
	a：显示累积使用量
	q：退出
```
**常用用法：**
``` shell script
~]# iotop			#直接使用
Total DISK READ :       0.00 B/s | Total DISK WRITE :       0.00 B/s
Actual DISK READ:       0.00 B/s | Actual DISK WRITE:       0.00 B/s
   TID  PRIO  USER     DISK READ  DISK WRITE  SWAPIN     IO>    COMMAND                                                                                                                                                                      
 60465 be/4 root        0.00 B/s    0.00 B/s  0.00 %  0.02 % [kworker/1:1]
     1 be/4 root        0.00 B/s    0.00 B/s  0.00 %  0.00 % systemd --switched-root --system --deserialize 22
     2 be/4 root        0.00 B/s    0.00 B/s  0.00 %  0.00 % [kthreadd]
     3 be/4 root        0.00 B/s    0.00 B/s  0.00 %  0.00 % [ksoftirqd/0]
	 ...

~]# iotop -o -n 5 -d 1	#只显示5次有io操作的进程，每秒刷新一次
Total DISK READ :       0.00 B/s | Total DISK WRITE :       0.00 B/s
Actual DISK READ:       0.00 B/s | Actual DISK WRITE:       0.00 B/s
   TID  PRIO  USER     DISK READ  DISK WRITE  SWAPIN     IO>    COMMAND                                                                                                                                                                      
 60465 be/4 root        0.00 B/s    0.00 B/s  0.00 %  0.02 % [kworker/1:1]
```
