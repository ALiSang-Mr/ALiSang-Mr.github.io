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



