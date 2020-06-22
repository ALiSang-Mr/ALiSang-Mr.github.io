# 系统服务管理
>基于CenterOS7.6。

[[TOC]]

## systemctl

- 输出系统中各个服务的状态：
``` shell script
systemctl list-units --type=service
```
- 查看服务的运行状态：
``` shell script
systemctl status firewalld
```
- 关闭服务：
``` shell script
systemctl stop firewalld
```
- 启动服务：
``` shell script
systemctl start firewalld
```
- 重新启动服务（不管当前服务是启动还是关闭）：
``` shell script
systemctl restart firewalld
```
- 重新载入配置信息而不中断服务：
``` shell script
systemctl reload firewalld
```
- 禁止服务开机自启动：
``` shell script
systemctl disable firewalld
```
- 设置服务开机自启动：
``` shell script
systemctl enable firewalld
```

## uptime

系统负载信息
``` shell script
~]# uptime 
 03:22:03 up 3 days,  6:17,  2 users,  load average: 0.00, 0.01, 0.05
```
load的理想值是正好等于CPU的核数，小于核数的时候表示cpu有空闲，超出核数的时候表示有进程在等待cpu，即系统资源不足

- 03:22:03：系统当前时间
- up：系统正在运行
- 3 days, 6:17：系统自上次开机运行的时间
- 2 users：当前登录的用户
- load average：系统负载。1分钟系统的平均负载、5分钟系统的平均负载、15分钟系统的平均负载

## 监控硬件信息
查看硬件的温度/风扇转速，电脑有鲁大师，服务器就有ipmitool。
``` shell script
~]# yum install -y OpenIPMI ipmitool	# IPMI只有在物理机可以使用，虚拟机不行

~]# ipmitool sdr type Temperature
Temp             | 01h | ns  |  3.1 | Disabled
Temp             | 02h | ns  |  3.2 | Disabled
Temp             | 05h | ns  | 10.1 | Disabled
Temp             | 06h | ns  | 10.2 | Disabled
Ambient Temp     | 0Eh | ok  |  7.1 | 22 degrees C
Planar Temp      | 0Fh | ns  |  7.1 | Disabled
IOH THERMTRIP    | 5Dh | ns  |  7.1 | Disabled
CPU Temp Interf  | 76h | ns  |  7.1 | Disabled
Temp             | 0Ah | ns  |  8.1 | Disabled
Temp             | 0Bh | ns  |  8.1 | Disabled
Temp             | 0Ch | ns  |  8.1 | Disabled
```
## 查看CPU相关信息

### lscpu：
``` shell script
	~]# lscpu 
	Architecture:          x86_64
	CPU op-mode(s):        32-bit, 64-bit
	Byte Order:            Little Endian
	CPU(s):                1
	On-line CPU(s) list:   0
	Thread(s) per core:    1
	Core(s) per socket:    1
	Socket(s):             1
	NUMA node(s):          1
	Vendor ID:             GenuineIntel
	CPU family:            6
	Model:                 60
	Model name:            Intel(R) Core(TM) i5-4570 CPU @ 3.20GHz
	Stepping:              3
	CPU MHz:               3192.669
	BogoMIPS:              6385.33
	Virtualization:        VT-x
	Hypervisor vendor:     VMware
	Virtualization type:   full
	L1d cache:             32K
	L1i cache:             32K
	L2 cache:              256K
	L3 cache:              6144K
	NUMA node0 CPU(s):     0
	Flags:                 ...
```
- Socket(s)： 1 #表示一个物理CPU
- Core(s) per socket： 1 #一个物理CPU上有一个核心
- Thread(s) per core： 1 #每个核心上有一个线程（超线程）

**总核数 = 物理CPU个数 X 每颗物理CPU的核数**

**总逻辑CPU数 = 物理CPU个数 X 每颗物理CPU的核数 X 超线程数**

### /proc/cpuinfo：
``` shell script
~]# cat /proc/cpuinfo 
		processor       : 0
		vendor_id       : GenuineIntel
		cpu family      : 6
		model           : 60
		model name      : Intel(R) Core(TM) i5-4570 CPU @ 3.20GHz
		stepping        : 3
		microcode       : 0x19
		cpu MHz         : 3192.669
		cache size      : 6144 KB
		physical id     : 0
		siblings        : 1
		core id         : 0
		cpu cores       : 1
		apicid          : 0
		initial apicid  : 0
		fpu             : yes
		fpu_exception   : yes
		cpuid level     : 13
		wp              : yes
		flags           : ...
		bogomips        : 6385.33
		clflush size    : 64
		cache_alignment : 64
		address sizes   : 43 bits physical, 48 bits virtual
		power management:
```
- 同一个socket的physical id相同
- cpu cores表示此socket上的core数量
- 如果cpu cores = siblings，表明没有开启超线程
- 如果cpu cores = 2 * siblings，表明开启了超线程
- 相同的physical id，相同的core id，但是不同的processor，表明是同一个core上的逻辑CPU（超线程）

## 查看内存信息
### free：
**常用参数：**
``` markdown
free [options]
选项说明：
	-h：人类可读方式显式单位
	-m：以MB为显示单位
	-w：将buffers和cache分开单独显示。只对CentOS 7上有效
	-s：动态查看内存信息时的刷新时间间隔
	-c：一共要刷新多少次退出free
```

**常用用法：**
``` shell script
~]# free -h
              total        used        free      shared  buff/cache   available
Mem:           3.7G        409M        2.1G         11M        1.2G        3.0G
Swap:          2.0G          0B        2.0G

~]# free -w -h				#将cache/buffer分开显示
              total        used        free      shared     buffers       cache   available
Mem:           3.7G        409M        2.1G         11M        2.1M        1.2G        3.0G
Swap:          2.0G          0B        2.0G

~]# free -h -s 1 -c 2		#动态显示两次，每秒刷新一次
              total        used        free      shared  buff/cache   available
Mem:           3.7G        408M        2.1G         11M        1.2G        3.0G
Swap:          2.0G          0B        2.0G

              total        used        free      shared  buff/cache   available
Mem:           3.7G        409M        2.1G         11M        1.2G        3.0G
Swap:          2.0G          0B        2.0G
```
Mem和Swap分别表示物理内存和交换分区的使用情况。

- total：总内存空间
- used：已使用的内存空间。该值是total-free-buffers-cache的结果
- free：未使用的内存空间
- shared：/tmpfs总用的内存空间。对内核版本有要求，若版本不够，则显示为0。
- buff/cache：buffers和cache的总占用空间
- available：可用的内存空间。即程序启动时，将认为可用空间有这么多。可用的内存空间为free+buffers+cache。

所以available才是真正需要关注的可使用内存空间量。

## 网络流量监控
>iftop、nethogs、…

iftop是一款实时流量监控工具,监控TCP/IP连接等,缺点就是无报表功能。必须以root身份才能运行

### iftop：
``` shell script
~]# rpm -ivh https://mirrors.aliyun.com/epel/epel-release-latest-7.noarch.rpm	#安装epel源
~]# yum install iftop -y	#依赖于epel源
```

**常用参数：**
``` markdown
选项说明：
	-i：设定监测的网卡，如果只执行iftop默认检测第一块网卡使用情况
	-B：以bytes为单位显示流量(默认是bits)
	-n：使host信息默认直接都显示IP
	-N：使端口信息默认直接都显示端口号
	-F：显示特定网段的进出流量
	
常用快捷键：
	n：切换显示本机的IP或主机名
	s：切换是否显示源IP
	d：切换是否显示目的IP
	t：显示格式为2行/1行/只显示发送流量/只显示接收流量，默认为两行
	N：显示端口号或端口服务名称
	S：是否显示本机的端口信息
	D：是否显示目标主机的端口信息
	p：是否显示端口信息
	P：切换暂停/继续显示
	b：是否显示平均流量图形条
	B：切换计算2s/10s/40s秒内的平均流量
	T：是否显示每个连接的总流量
	l：打开屏幕过滤功能，输入要过滤的字符，比如ip，按回车后，屏幕就只显示这个IP相关的流量信息
```
- 左侧：源IP
- 中间：目的IP
- 右侧：2s/10s/40s平均流量
- =>：代表发送数据 源IP->目的IP
- <=：代表接收流量 目的->到源Ip
- TX：发送流量
- RX：接收流量
- TOTAL：总流量
- Cumm：运行iftop到目前时间的总流量
- peak：流量峰值
- rates：分别表示过去 2s 10s 40s 的平均流量

## 查看进程信息
>pstree、ps、…

### pstree：
``` shell script
yum install psmisc -y		#可直接yum安装
```
**常用参数：**
``` shell script
选项说明：
	-a：显示进程的命令行
	-c：展开分支
	-h：高亮当前正在运行的进程及其父进程
	-p：显示进程pid，此选项也将展开分支
	-l：允许显示长格式进程。默认在显示结果中超过132个字符时将截断后面的字符
```
**常用用法：**
``` shell script
~]# pstree -h
systemd─┬─NetworkManager─┬─dhclient
        │                └─2*[{NetworkManager}]
        ├─VGAuthService
        ├─agetty
        ├─auditd───{auditd}
        ├─chronyd
        ├─crond
        ├─dbus-daemon
        ├─gssproxy───5*[{gssproxy}]
        ├─httpd───5*[httpd]
        ├─keepalived───2*[keepalived]
        ├─ksmtuned───sleep
        ├─libvirtd───16*[{libvirtd}]
        ├─lvmetad
        ├─master─┬─pickup
        │        └─qmgr
        ├─mysqld_safe───mysqld───30*[{mysqld}]
        ├─php-fpm───2*[php-fpm]
        ├─polkitd───6*[{polkitd}]
        ├─rpcbind
        ├─rsyslogd───2*[{rsyslogd}]
        ├─sshd───sshd─┬─bash───pstree
        │             └─sftp-server
        ├─systemd-journal
        ├─systemd-logind
        ├─systemd-udevd
        ├─tuned───4*[{tuned}]
        ├─vmtoolsd───{vmtoolsd}
        ├─zabbix_agentd───5*[zabbix_agentd]
        └─zabbix_server───33*[zabbix_server]
```
### ps：
ps其实只需掌握少数几个选项即可，关键的是要了解ps显示出的进程信息中每一列代表什么属性
**常用用法：**
``` markdown
~]# ps aux           
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.2 125316  3816 ?        Ss   Sep15   0:01 /usr/lib/systemd/systemd --switched-root --system --deserialize 22
root          2  0.0  0.0      0     0 ?        S    Sep15   0:00 [kthreadd]
root          3  0.0  0.0      0     0 ?        S    Sep15   0:01 [ksoftirqd/0]
root          5  0.0  0.0      0     0 ?        S<   Sep15   0:00 [kworker/0:0H]
root          7  0.0  0.0      0     0 ?        S    Sep15   0:00 [migration/0]
root          8  0.0  0.0      0     0 ?        S    Sep15   0:00 [rcu_bh]
root          9  0.0  0.0      0     0 ?        R    Sep15   0:02 [rcu_sched]
root         10  0.0  0.0      0     0 ?        S<   Sep15   0:00 [lru-add-drain]
root         11  0.0  0.0      0     0 ?        S    Sep15   0:00 [watchdog/0]
root         13  0.0  0.0      0     0 ?        S    Sep15   0:00 [kdevtmpfs]
root         14  0.0  0.0      0     0 ?        S<   Sep15   0:00 [netns]
root         15  0.0  0.0      0     0 ?        S    Sep15   0:00 [khungtaskd]
root         16  0.0  0.0      0     0 ?        S<   Sep15   0:00 [writeback]
root         17  0.0  0.0      0     0 ?        S<   Sep15   0:00 [kintegrityd]
```
- USER：启动进程的用户
- PID：进程的进程号
- %CPU：表示CPU占用百分比，注意，CPU的衡量方式是占用时间，所以百分比的计算方式是"进程占用cpu时间/cpu总时间"，而不是cpu工作强度的状态
- %MEM：表示各进程所占物理内存百分比
- VSZ：表示各进程占用的虚拟内存，也就是其在线性地址空间中实际占用的内存，单位为kb
- RSS：表示各进程占用的实际物理内存，单位为Kb
- TTY：表示属于哪个终端的进程，"?"表示不依赖于终端的进程
- STAT：进程所处的状态
      D：不可中断睡眠
      R：运行中或等待队列中的进程(running/runnable)
      S：可中断睡眠
      T：进程处于stopped状态
      Z：僵尸进程
      <：高优先级进程
      N：低优先级进程
      L：该进程在内存中有被锁定的页
      s：表示该进程是session leader，即进程组的首进程。例如管道左边的进程，shell脚本中的shell进程
      l：表示该进程是一个线程
      +：表示是前端进程。前端进程一般来说都是依赖于终端的
- START：表示进程是何时被创建的
- TIME：表示各进程占用的CPU时间
- COMMAND：表示进程的命令行。如果是内核线程，则使用方括号"[]"包围
``` shell script
]# ps -elf
F S UID         PID   PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S root          1      0  0  80   0 - 31329 ep_pol Sep15 ?        00:00:01 /usr/lib/systemd/systemd --switched-root --system --deserialize 22
1 S root          2      0  0  80   0 -     0 kthrea Sep15 ?        00:00:00 [kthreadd]
1 S root          3      2  0  80   0 -     0 smpboo Sep15 ?        00:00:01 [ksoftirqd/0]
1 S root          5      2  0  60 -20 -     0 worker Sep15 ?        00:00:00 [kworker/0:0H]
1 S root          7      2  0 -40   - -     0 smpboo Sep15 ?        00:00:00 [migration/0]
1 S root          8      2  0  80   0 -     0 rcu_gp Sep15 ?        00:00:00 [rcu_bh]
1 R root          9      2  0  80   0 -     0 -      Sep15 ?        00:00:02 [rcu_sched]
1 S root         10      2  0  60 -20 -     0 rescue Sep15 ?        00:00:00 [lru-add-drain]
5 S root         11      2  0 -40   - -     0 smpboo Sep15 ?        00:00:00 [watchdog/0]
0 R root       9880   8006  0  80   0 - 38840 -      02:24 pts/0    00:00:00 ps -elf
```
- F：程序的标志位。0表示该程序只有普通权限，4表示具有root超级管理员权限，1表示该进程被创建的时候只进行了fork，没有进行exec
- S：进程的状态位，注意ps选项加了"-“的是非BSD风格选项，不会有"s”"<"“N”"+"等的状态标识位
- C：CPU的百分比，注意衡量方式是时间
- PRI：进程的优先级，值越小，优先级越高，越早被调度类选中运行
- NI：进程的NICE值，值为-20到19，影响优先级的方式是PRI(new)=PRI(old)+NI，所以NI为负数的时候，越小将导致进程优先级越
- ADDR：进程在物理内存中哪个地方
- SZ：进程占用的实际物理内存
- WCHAN：若进程处于睡眠状态，将显示其对应内核线程的名称，若进程为R状态，则显示"-"

## 常用分析命令 top、htop

### top：
top命令查看动态进程状态，默认每3秒刷新一次
**常用参数：**
``` markdown
选项说明：
	-d：指定top刷新的时间间隔，默认是3秒
	-b：批处理模式，每次刷新分批显示
	-n：指定top刷新几次就退出，可以配合-b使用
	-p：指定监控的pid，指定方式为-pN1 -pN2 ...或-pN1, N2 [,...]
	-u：指定要监控的用户的进程，可以是uid也可以是user_name

常用快捷键：
	1：(数字1)表示是否要在top的头部显示出多个cpu信息
	H：表示是否要显示线程，默认不显示
	c,S：c表示是否要展开进程的命令行，S表示显示的cpu时间是否是累积模式，cpu累积模式下已死去的子进程cpu时间会累积到父进程中
	x,y：x高亮排序的列，y表示高亮running进程
	u：指定需要显示的用户
	n or #：设置要显示最大的进程数量（需要显示几个进程）
	k：杀进程
	q：退出top
	P：以CPU 的使用资源排序显示
	M：以Memory 的使用资源排序显示
	N：以PID 来排序
```
**常用用法：**
``` markdown
~]# top
top - 03:14:30 up  4:05,  1 user,  load average: 0.02, 0.04, 0.05
Tasks: 130 total,   1 running, 129 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.3 sy,  0.0 ni, 99.3 id,  0.3 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1863224 total,  1278012 free,   248180 used,   337032 buff/cache
KiB Swap:  2097148 total,  2097148 free,        0 used.  1430572 avail Mem 

   PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
   7068 mysql     20   0 1175068 107732   8392 S  0.3  5.8   1:16.92 mysqld
  10193 root      20   0  162020   2384   1616 R  0.3  0.1   0:03.50 top
 	 1 root      20   0  125316   3816   2596 S  0.0  0.2   0:09.84 systemd
     2 root      20   0       0      0      0 S  0.0  0.0   0:00.00 kthreadd
     3 root      20   0       0      0      0 S  0.0  0.0   0:01.85 ksoftirqd/0
     5 root       0 -20       0      0      0 S  0.0  0.0   0:00.00 kworker/0:0H
```
第一行：当前时间、已开机时长、当前在线用户、前1/5/15分钟平均负载（同w、uptime命令）
第二行：分别表示总进程数、running状态的进程数、睡眠状态的进程数、停止状态进程数、僵尸进程数
第三行：
- us：用户空间占用CPU百分比
- sy：内核空间占用CPU百分比
- ni：用户进程空间内改变过优先级的进程占用CPU百分比
- id：空闲CPU百分比
- wa：等待输入输出的CPU时间百分比
- hi：硬件CPU中断占用百分比
- si：软中断占用百分比
- st：虚拟机占用百分比
第四行：物理内存总量、空闲内存总量、已使用的物理内存总量、用作内核缓存的内存总量
第五行：交换分区总量、空闲交换分区总量、已使用的交换分区总量、缓冲的交换分区总量
第六行：
- PID：进程ID
- USER：进行所有者的用户名
- PR：优先级
- NI：nice值，负值表示高优先级
- VIRT：进程使用的虚拟内存总量，VIRT=SWAP+RES，单位kb
- RES：进程使用的，未被换出的大小，单位kb
- SHR：共享内存大小
- S：进程状态(D=不可中断的睡眠状态,R=运行,S=睡眠,T=跟踪/停止,Z=僵尸进程)
- %CPU：上次更新到现在的CPU时间占用百分比
- %MEM：进程使用的物理内存百分比
- COMMAND：命令名/命令行
top命令可以通过 M 快捷键来查看进程使用内存的排序，但是若我们想要查看进程占用内存的具体情况，可使用如下方法
``` markdown
~]# yum install bc -y
~]# echo 0 $(awk '/TYPE/ {print "+", $2}' /proc/PID/smaps) | bc
	
TYPE：
	Rss	   ：内存占用，进程占用的所有内存，包括跟其他进程共享的内存(直接把共享的整个内存数值加上来)。但是这个值没有包含swap
    Shared ：该进程跟其他进程分享的内存
    Private：该进程占用的私有内存，通过这个数据你可以查看到内存泄露问题
    Swap   ：该进程用的swap内存
    Pss    ：按比例计算的内存数量，这是一个很好的看总体内存占用量的参数，这是根据共享进程的数量来调整共享内存数量的内存占用。 如果一个进程占用的私有内存是1MB，使用的共享内存有20MB，但是这个共享内存同时有10个进程（包括它自己在内）在使用，那么PSS就是 1 + 20/10 = 3MB
    
PID：进程号
```
top命令虽然非常强大，但是太老了。所以有了新生代的top命令htop。htop默认没有安装，需要手动安装。
### htop：
htop界面比top更加美观，并且htop可以直接使用鼠标来点击进行操作
``` markdown
~]# rpm -ivh https://mirrors.aliyun.com/epel/epel-release-latest-7.noarch.rpm	#安装epel源
~]# yum install htop -y	#依赖于epel源
```
**常用用法：**
``` shell script
 htop  
```

