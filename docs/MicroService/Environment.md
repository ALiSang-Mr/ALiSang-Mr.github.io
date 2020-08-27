# 环境搭建

[[TOC]]

## 安装虚拟机

### 安装visualBox

visualBox(v肉暴克斯):VirtualBox 是一款开源虚拟机软件。VirtualBox 是由德国 Innotek 公司开发，由Sun Microsystems公司出品的软件，
使用Qt编写，在 Sun 被 Oracle 收购后正式更名成 Oracle VM VirtualBox。

[官网下载](https://www.virtualbox.org/wiki/Downloads)

首先visualBox在进行安装时需要cpu开启虚拟化，在开机启动的时候设置主板，CPU configuration，然后点击Intel Vitualization Technology。重启电脑

::: warning win10查看虚拟化
`cmd` 进入命令运行窗口

输入`systeminfo`命令

查看 “固件中已启用虚拟化” 若为是 则已开启虚拟化

另外也可在任务管理器中的cpu性能查看也有虚拟机是否开启的说明
:::

在visualBox可一步步创建虚拟机，但是太麻烦了，推荐安装vagrant
### 安装vagrant

利用vagrant可以帮助我们快速地创建一个虚拟机。主要装了vitualbox，vagrant可以帮助我们快速创建出一个虚拟机。他有一个镜像仓库。

- 安装&下载

vagrant官方镜像仓库:[https://app.vagrantup.com/boxes/search](https://app.vagrantup.com/boxes/search)

vagrant下载:[https://www.vagrantup.com/downloads](https://www.vagrantup.com/downloads)

官网下载太慢,提供一个下载链接:

百度云链接：[https://pan.baidu.com/s/1UJckRjWff0w6tdSz-iJF1g](https://pan.baidu.com/s/1UJckRjWff0w6tdSz-iJF1g)
提取码：n7ft

**验证：** cmd中输入`vagrant`有版本信息和命令提示代表成功了

- 打开windows cmd 窗口， 执行 `vagrant init centos/7` 命令，即可初始化一个centos7系统。（注意这个命令在哪个目录下执行的，
他的Vagrantfile就生成在哪里）

- `vagrant up`启动虚拟机环境。

::: tip 提示
下载镜像太慢-->[http://mirrors.ustc.edu.cn/centos-cloud/centos/7/vagrant/x86_64/images/](http://mirrors.ustc.edu.cn/centos-cloud/centos/7/vagrant/x86_64/images/)

cd 到下载好的文件目录

执行命令：`vagrant box add centos/7 CentOS-7-x86_64-Vagrant-2004_01.VirtualBox.box`

之后再重新加载镜像 `vagrant up`
:::

启动后出现default folder:/cygdrive/c/User/… =>/vagrant。然后ctrl+c退出

- 前面的页面中有ssh账号信息，用来连接虚拟机。

`vagrant ssh` 在windows cmd窗口执行命令就会连上虚拟机。可以使用exit退出

>下次使用也可以直接vagrant up直接启动，但要确保当前目录在C:/用户/ 文件夹下，他下面有一个Vagrantfile，不过我们也可以配置环境变量。
动后再次vagrant ssh连上即可

#### 虚拟机网络设置

VirtualBox虚拟机的网络方式是网络地址转换NAT（端口转发），如果其他主机要访问虚拟机，必须由windows端口如3333断发给虚拟机端口如3306。
这样每在linux里安一个软件都要进行端口映射，不方便，（也可以在virualBox里挨个设置）。

我们想要给虚拟机一个固定的ip地址，windows和虚拟机可以互相ping通。方式1是在虚拟机中配置静态ip。也可以更改Vagrantfile更改虚拟机ip，
修改其中的`config.vm.network "private_network",ip:"192.168.56.10"`，这个ip需要在windows的ipconfig中查到vitualbox的网卡ip，
然后更改下最后一个数字就行（不能是1）。配置完后重启虚拟机。在虚拟机中执行`ip addr`命令就可以查看到地址了。互相ping也能ping通。

## 安装Docker

**docker是什么？**

虚拟化容器技术，Docker基于镜像，可以秒级启动各种容器。每一种容器都是一个完整的运行环境，容器之间互相隔离

下载docker-->[https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)

::: tip Docker安装执行
``` shell script
#卸载系统之前的docker 
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
                  
//安装依赖包                  
sudo yum install -y yum-utils

# 配置镜像
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

//安装docker 
sudo yum install docker-ce docker-ce-cli containerd.io

//启动docker服务
sudo systemctl start docker
# 设置开机自启动
sudo systemctl enable docker

//docker 版本
docker -v
//查看镜像
sudo docker images

# 配置镜像加速
```
:::

### 配置docker阿里云镜像加速

阿里云镜像加速器配置地址[https://cr.console.aliyun.com/cn-qingdao/instances/mirrors](https://cr.console.aliyun.com/cn-qingdao/instances/mirrors)

登录个人账号-->容器镜像服务-->镜像加速器

根据页面命令执行完命令
``` shell script
sudo mkdir -p /etc/docker

sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://imgrvt8l.mirror.aliyuncs.com"]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

### docker安装mysql

用docker安装上mysql，去docker仓库里搜索mysql

``` shell script
sudo docker pull mysql:5.7

# --name指定容器名字 -v目录挂载 -p指定端口映射  -e设置mysql参数 -d后台运行
sudo docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```

**设置用户切换**： `su root 密码为vagrant，这样就可以不写sudo了`

查看docker
``` shell script
[root@localhost vagrant]# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
6a685a33103f        mysql:5.7           "docker-entrypoint.s…"   32 seconds ago      Up 30 seconds       0.0.0.0:3306->3306/tcp, 33060/tcp   mysql
```
``` shell script
//进入mysql容器内部(是个小型linux)
docker exec -it mysql bin/bash
exit;

//修改mysql的配置
vi /mydata/mysql/conf/my.conf 

[client]
default-character-set=utf8
[mysql]
default-character-set=utf8
[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve

保存(注意评论区该配置不对，不是collection而是collation)

docker restart mysql
```

### docker安装redis

下载最新redis镜像：`docker pull redis` 

``` shell script
# 在虚拟机中
mkdir -p /mydata/redis/conf
touch /mydata/redis/conf/redis.conf

docker pull redis

docker run -p 6379:6379 --name redis \
-v /mydata/redis/data:/data \
-v /mydata/redis/conf/redis.conf:/etc/redis/redis.conf \
-d redis redis-server /etc/redis/redis.conf

# 直接进去redis客户端。
docker exec -it redis redis-cli
```
默认是不持久化的。在配置文件中输入appendonly yes，就可以aof持久化了。

``` shell script
vi /mydata/redis/conf/redis.conf
# 插入下面内容
appendonly yes
保存

docker restart redis
```
修改完执行`docker restart redis`，`docker exec -it redis redis-cli`

### 开发环境
#### maven配置
在settings中配置阿里云镜像，配置jdk1.8。安装插件lombok，mybatisX。
``` xml
<mirrors>   
    <mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
  　　 <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
      <mirrorOf>central</mirrorOf>        
    </mirror>    
</mirrors>  
```

#### vsCode

下载vsCode用于前端管理系统。在vsCode里安装插件。

- Auto Close Tag
- Auto Rename Tag
- Chinese
- ESlint
- HTML CSS Support
- HTML Snippets
- JavaScript ES6
- Live Server
- open in brower
- Vetur

#### 安装git
下载git客户端，右键桌面Git GUI/bash Here。点击git bash
``` markdown
# 配置用户名
git config --global user.name "username"  //(名字，随意写)

# 配置邮箱
git config --global user.email "55333@qq.com" // 注册账号时使用的邮箱

# 配置ssh免密登录
ssh-keygen -t rsa -C "55333@qq.com"
三次回车后生成了密钥
cat ~/.ssh/id_rsa.pub

也可以查看密钥
浏览器登录码云后，个人头像上点设置、然后点ssh公钥、随便填个标题，然后赋值
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6MWhGXSKdRxr1mGPZysDrcwABMTrxc8Va2IWZyIMMRHH9Qn/wy3PN2I9144UUqg65W0CDE/thxbOdn78MygFFsIG4j0wdT9sdjmSfzQikLHFsJ02yr58V6J2zwXcW9AhIlaGr+XIlGKDUy5mXb4OF+6UMXM6HKF7rY9FYh9wL6bun9f1jV4Ydlxftb/xtV8oQXXNJbI6OoqkogPKBYcNdWzMbjJdmbq2bSQugGaPVnHEqAD74Qgkw1G7SIDTXnY55gBlFPVzjLWUu74OWFCx4pFHH6LRZOCLlMaJ9haTwT2DB/sFzOG/Js+cEExx/arJ2rvvdmTMwlv/T+6xhrMS3 553736044@qq.com

# 测试
ssh -T git@gitee.com
测试成功
```