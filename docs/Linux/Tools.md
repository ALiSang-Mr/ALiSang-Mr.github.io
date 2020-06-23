# Linux 常用命令

## rz、sz 上传下载

>yum安装

`yum install -y lrzsz`

Complete! 安装完成！

``` shell script
cat statistics.log   |grep PunchcardController |grep fun |grep beat
```
``` markdown
查看控制台：tail -100f log/stdout.log
详细查看接口日志：tail -f info.log |grep '某接口'
查看日志：tail -f info.log
查看端口：netstat -tunlp|grep 端口号
```
``` shell script
cat /data/logs/xiuqiang-backend/statistics.log.2019-02-18 |grep '保存刷新' |grep add
```

某一个文件在另外一个位置建立一个同步的链接  ln -s 源文件 目标文件

`ps -ef  |grep  redis`  查看redis端口。

`ls -la`    `ls -lA`  查看隐藏目录

vim编辑器  :`set nu`   显示行号

``` markdown
free  看内存 
df -h 看磁盘空间
du -s -h ./*
du -h
```
``` markdown
1.jps 获取Java进程的PID。
2.jstack pid >> java.txt 导出CPU占用高进程的线程栈。
3.top -H -p PID 查看对应进程的哪个线程占用CPU过高。
4.printf %x pid.  转换16进制
5.在第二步导出的Java.txt中查找转换成为16进制的线程PID。找到对应的线程栈。
6.分析负载高的线程栈都是什么业务操作。优化程序并处理问题。
```

``` markdown
关闭防火墙：
1.即时生效，重启后复原：
开启：service iptables start
关闭：service iptables stop
2.永久性生效，重启后不会复原：
开启：chkconfig iptables on
关闭：chkconfig iptables off

centos7 防火墙：
yum install firewalld firewalld-config
配置文件：/etc/firewalld/
查看版本：firewall-cmd --version
查看帮助：firewall-cmd --help
查看区域信息：firewall-cmd --get-active-zones
查看指定接口所属区域信息：firewall-cmd --get-zone-of-interface=eth0
拒绝所有包：firewall-cmd --panic-on
取消拒绝状态：firewall-cmd --panic-off
查看是否拒绝：firewall-cmd --query-panic

查看防火墙状态：firewall-cmd --state
开启防火墙：systemctl start firewalld 
关闭防火墙：systemctl stop firewalld
设置开机启动：systemctl enable firewalld
停止并禁用开机启动：sytemctl disable firewalld
重启防火墙：firewall-cmd --reload

查看指定区域所有开启的端口号
firewall-cmd --zone=public --list-ports

在指定区域开启端口(如80端口号，命令方式)
firewall-cmd --zone=public --add-port=80/tcp --permanent
重新启动防火墙
firewall-cmd --reload

参数说明：
–zone 作用域
–add-port=8080/tcp 添加端口，格式为：端口/通讯协议
–permanent #永久生效，没有此参数重启后失效

在指定区域开启某个范围的端口号(如18881~65534，命令方式)
firewall-cmd --zone=public --add-port=18881:65534/tcp --permanent
重新启动防火墙
firewall-cmd --reload
```
检查openJDK是否安装命令：`rpm -qa|grep jdk`

卸载命令：`yum -y remove  xxxx` 

``` shell script
[root@test support-files]# echo 'export PATH=/app/mysql/bin:$PATH' >>/etc/profile   直接赋值给etc下的profile文件
[root@test support-files]# source /etc/profile    执行文件
```

修改添加redis启动脚本权限为可执行    `chmod +x redis`

``` markdown
安装字体管理工具： yum install -y fontconfig mkfontscale
访问 c:\windows\fonts，把需要的字体copy出来。然后上传到服务器上的 /usr/share/fonts下
执行 mkfontscale    mkfontdir  fc-cache -fv三个命令，然后重启服务器（reboot）即可。
https://blog.csdn.net/xiongshengwu/article/details/53696654
```




