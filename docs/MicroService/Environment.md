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

## 开发环境
### maven配置
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

### vsCode

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

### 安装git
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

### 码云 初始化项目
在码云新建仓库，仓库名gulimall，选择语言java，在.gitignore选中maven，许可证选Apache-2.0，开发模型选生成/开发模型，
开发时在dev分支，发布时在master分支，创建。

在IDEA中New–Project from version control–git–复制刚才项目的地址，如https://gitee.com/hanferm/gulimall.git

然后New Module–Spring Initializer–com.atguigu.gulimall,Artifact填 gulimall-product。Next—选择web，springCloud routing里选中openFeign。

依次创建出以下服务 
- 商品服务product
- 存储服务ware
- 订单服务order
- 优惠券服务coupon
- 用户服务member

**共同点**：
1. 导入web和openFeign
2. group：com.atguigu.gulimall
3. Artifact：gulimall-XXX
4. 每一个服务，包名com.atguigu.gulimall.XXX{product/order/ware/coupon/member}
5. 模块名：gulimall-XXX

项目的root聚合服务
``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<groupId>com.atguigu.gulimall</groupId>
	<artifactId>gulimall</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>gulimall</name>
	<description>聚合服务</description>

	<packaging>pom</packaging>

	<modules>
		<module>gulimall-coupon</module>
		<module>gulimall-member</module>
		<module>gulimall-order</module>
		<module>gulimall-product</module>
		<module>gulimall-ware</module>

	</modules>
</project>
```
在maven窗口刷新，并点击+号，找到刚才的pom.xml添加进来，发现多了个root。这样比如运行root的clean命令，其他项目也一起clean了。

修改总项目的.gitignore，把小项目里的垃圾文件在提交的时候忽略掉，比如HTLP.md。。。

在version control/local Changes，点击刷新看Unversioned Files，可以看到变化。

全选最后剩下21个文件，选择右键、Add to VCS。

在IDEA中安装插件：gitee，重启IDEA。

在DefaultChangelist右键点击commit，去掉右面的勾选Perform code analysis、CHECK TODO，然后点击COMMIT，有个下拉列表，
点击commit and push才会提交到云端。此时就可以在浏览器中看到了。

### 数据库
>注意重启虚拟机和docker后里面的容器就关了。

``` markdown
sudo docker ps
sudo docker ps -a
# 这两个命令的差别就是后者会显示  【已创建但没有启动的容器】

# 我们接下来设置我们要用的容器每次都是自动启动
sudo docker update redis --restart=always
sudo docker update mysql --restart=always
# 如果不配置上面的内容的话，我们也可以选择手动启动
sudo docker start mysql
sudo docker start redis
# 如果要进入已启动的容器
sudo docker exec -it mysql /bin/bash
```

建立数据库：字符集选utf8mb4，他能兼容utf8且能解决一些乱码的问题。分别建立了下面数据库
``` markdown
gulimall-oms
gulimall-pms
gulimall-sms
gulimall-ums
gulimall-wms
```
然后打开对应的sql在对应的数据库中执行。依次执行。(注意sql文件里没有建库语句)

### 后台管理系统
在码云上搜索[人人开源](https://gitee.com/renrenio)，我们使用renren-fast，renren-fast-vue项目。

``` shell script
git clone https://gitee.com/renrenio/renren-fast.git

git clone https://gitee.com/renrenio/renren-fast-vue.git
```
#### 人人后台
将renren-fast 项目放到gulimall项目中

在项目里的pom.xml添加一个
``` xml
<modules>
    <module>gulimall-coupon</module>
    <module>gulimall-member</module>
    <module>gulimall-order</module>
    <module>gulimall-product</module>
    <module>gulimall-ware</module>

    <module>renren-fast</module>
</modules>
```
然后打开renren-fast/db/mysql.sql，复制全部，在数据库中创建库gulimall-admin，粘贴刚才的内容执行。

然后修改项目里renren-fast中的application.yml，修改application-dev.yml中的数库库的url，通常把localhost修改为192.168.56.10即可。

``` yaml
url: jdbc:mysql://192.168.56.10:3306/gulimall-admin?useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
username: root
password: root
```
然后执行java下的RenrenApplication

浏览器输入http://localhost:8080/renren-fast/ 得到{“msg”:“invalid token”,“code”:401}就代表无误

#### 人人vue
用VSCode打开renren-fast-vue

安装node：http://nodejs.cn/download/ 选择windows下载。下载完安装。

NPM是随同NodeJS一起安装的包管理工具，如JavaScript-NPM，java-Maven。

命令行输入node -v 检查配置好了，配置npm的镜像仓库地址，再执行
``` shell script
node -v
npm config set registry http://registry.npm.taobao.org/
```
VScode的终端中输入 npm install，会报错，然后进行如下操作：
``` markdown
先把node_modules全部删除，然后再npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver，最后npm install。
```
在VScode的终端中输入 `npm install` 下载前端依赖组件 启动运行`npm run dev`

浏览器输入localhost:8001 就可以看到内容了，登录admin admin

### IDEA项目准备
逆向工程搭建
``` shell script
git clone https://gitee.com/renrenio/renren-generator.git
```
导入到项目当中，同样配置好pom.xml
``` xml
<modules>
		<module>gulimall-coupon</module>
		<module>gulimall-member</module>
		<module>gulimall-order</module>
		<module>gulimall-product</module>
		<module>gulimall-ware</module>
		<module>renren-fast</module>
		<module>renren-generator</module>
</modules>
```
修改application.yml
``` yaml
url: jdbc:mysql://192.168.56.10:3306/gulimall-pms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
username: root
password: root
```
然后修改generator.properties（这里乱码的百度IDEA设置properties编码）
``` properties
# 主目录
mainPath=com.atguigu
#包名
package=com.atguigu.gulimall
#模块名
moduleName=product
#作者
author=hh
#email
email=55333@qq.com
#表前缀(类名不会包含表前缀) # 我们的pms数据库中的表的前缀都pms
# 如果写了表前缀，每一张表对于的javaBean就不会添加前缀了
tablePrefix=pms_
```
注释掉product项目下类中的`//import org.apache.shiro.authz.annotation.RequiresPermissions`;

启动generator服务，代码生成器访问路径 `http://localhost`, 点击生成代码, 将代码放到相应的服务目录下

然后在项目上右击（在项目上右击很重要）new modules— maven—然后在name上输入gulimall-common。

在pom.xml中也自动添加了<module>gulimall-common</module>

在common项目的pom.xml中添加
``` xml
<!-- mybatisPLUS-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.3.2</version>
</dependency>
<!--简化实体类，用@Data代替getset方法-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.8</version>
</dependency>
<!-- httpcomponent包https://mvnrepository.com/artifact/org.apache.httpcomponents/httpcore -->
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpcore</artifactId>
    <version>4.4.13</version>
</dependency>
<dependency>
    <groupId>commons-lang</groupId>
    <artifactId>commons-lang</artifactId>
    <version>2.6</version>
</dependency>
```
在product项目中的pom.xml中加入下面内容
``` xml
<dependency>
    <groupId>com.atguigu.gulimall</groupId>
    <artifactId>gulimall-common</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```
解决报错问题。

### 整合与测试

#### **product**
在common的pom.xml中导入
``` xml
<!-- 数据库驱动 https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.17</version>
</dependency>
<!--tomcat里一般都带-->
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>servlet-api</artifactId>
    <version>2.5</version>
    <scope>provided</scope>
</dependency>
```
在product项目的resources目录下新建application.yml
``` yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://192.168.56.10:3306/gulimall-pms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.jdbc.Driver

# MapperScan
# sql映射文件位置
mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto
```
>classpath 和 classpath* 区别：
>
>classpath：只会到你的class路径中查找找文件;
>
>classpath*：不仅包含class路径，还包括jar文件中(class路径)进行查找
>
>classpath*的使用：当项目中有多个classpath路径，并同时加载多个classpath路径下（此种情况多数不会遇到）的文件，
>`*`就发挥了作用，如果不加`*`，则表示仅仅加载第一个classpath路径。

然后在主启动类上加上注解@MapperScan()

``` java
@MapperScan("com.mwj.gulimall.product.dao")
@SpringBootApplication
public class gulimallProductApplication {
    public static void main(String[] args) {
        SpringApplication.run(gulimallProductApplication.class, args);
    }
}
```
然后去测试，先通过下面方法给数据库添加内容
``` java
@SpringBootTest
class gulimallProductApplicationTests {
    @Autowired
    BrandService brandService;

    @Test
    void contextLoads() {
        BrandEntity brandEntity = new BrandEntity();
        brandEntity.setDescript("哈哈1哈");
        brandEntity.setName("华为");
        brandService.save(brandEntity);
        System.out.println("保存成功");
    }
}
```

#### **coupon**

重新打开generator逆向工程，修改generator.properties
``` yaml
# 主目录
mainPath=com.atguigu
#包名
package=com.atguigu.gulimall
#模块名
moduleName=coupon
#作者
autho=hh
#email
email=55333@qq.com
#表前缀(类名不会包含表前缀) # 我们的pms数据库中的表的前缀都pms
# 如果写了表前缀，每一张表对于的javaBean就不会添加前缀了
tablePrefix=sms_
```
修改yml数据库信息
``` yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://192.168.56.10:3306/gulimall-sms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver


mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto
      logic-delete-value: 1
      logic-not-delete-value: 0

server:
  port: 7000
```

让coupon也依赖于common，修改pom.xml
``` xml
<dependency>
    <groupId>com.atguigu.gulimall</groupId>
    <artifactId>gulimall-common</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```
resources下src包先删除

添加application.yml
``` yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://192.168.56.10:3306/gulimall-sms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver


mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto
      logic-delete-value: 1
      logic-not-delete-value: 0

```
**测试url**:`http://localhost:8080/coupon/coupon/list`
``` markdown
{"msg":"success","code":0,"page":{"totalCount":0,"pageSize":10,"totalPage":0,"currPage":1,"list":[]}}
```

#### **member**
重新使用代码生成器生成ums

模仿上面修改下面两个配置

代码生成器里：
``` yaml
    url: jdbc:mysql://192.168.56.10:3306/gulimall-ums?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
```
``` yaml
# 主目录
mainPath=com.atguigu
#包名
package=com.atguigu.gulimall
#模块名
moduleName=member
#作者
author=hh
#email
email=55333@qq.com
#表前缀(类名不会包含表前缀) # 我们的pms数据库中的表的前缀都pms
# 如果写了表前缀，每一张表对于的javaBean就不会添加前缀了
tablePrefix=ums_
```
重启RenrenApplication.java，然后同样去浏览器获取压缩包解压到对应member项目目录

member也导入依赖
``` xml
<dependency>
    <groupId>com.atguigu.gulimall</groupId>
    <artifactId>gulimall-common</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```
同样新建application.yml
``` yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://192.168.56.10:3306/gulimall-ums?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver


mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto
      logic-delete-value: 1
      logic-not-delete-value: 0

server:
  port: 8000
```
**测试url**: `http://localhost:8000/member/growthchangehistory/list`
``` markdown
{"msg":"success","code":0,"page":{"totalCount":0,"pageSize":10,"totalPage":0,"currPage":1,"list":[]}}
```
#### **order**

修改代码生成器
``` yaml
 url: jdbc:mysql://192.168.56.10:3306/gulimall-oms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
```
``` yaml
#代码生成器，配置信息

# 主目录
mainPath=com.atguigu
#包名
package=com.atguigu.gulimall
#模块名
moduleName=order
#作者
author=hh
#email
email=55333@qq.com
#表前缀(类名不会包含表前缀) # 我们的pms数据库中的表的前缀都pms
# 如果写了表前缀，每一张表对于的javaBean就不会添加前缀了
tablePrefix=oms_
```
运行RenrenApplication.java重新生成后去下载解压放置。

application.yml
``` yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://192.168.56.10:3306/gulimall-oms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver


mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto
      logic-delete-value: 1
      logic-not-delete-value: 0
      
server:
  port: 9000
```
导入common依赖
``` xml
<dependency>
    <groupId>com.atguigu.gulimall</groupId>
    <artifactId>gulimall-common</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```
**测试url**: `http://localhost:9000/order/order/list`
``` markdown
{"msg":"success","code":0,"page":{"totalCount":0,"pageSize":10,"totalPage":0,"currPage":1,"list":[]}}
```

#### ware
修改代码生成器
``` yaml
url: jdbc:mysql://192.168.56.10:3306/gulimall-wms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
```
``` yaml
#代码生成器，配置信息

# 主目录
mainPath=com.atguigu
#包名
package=com.atguigu.gulimall
#模块名
moduleName=ware
#作者
author=hh
#email
email=55333@qq.com
#表前缀(类名不会包含表前缀) # 我们的pms数据库中的表的前缀都pms
# 如果写了表前缀，每一张表对于的javaBean就不会添加前缀了
tablePrefix=wms_
```
运行RenrenApplication.java重新生成后去下载解压放置。

application.yml
``` yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://192.168.56.10:3306/gulimall-wms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver


mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto
      logic-delete-value: 1
      logic-not-delete-value: 0
      
server:
  port: 11000
```
导入依赖包
``` xml
<dependency>
    <groupId>com.atguigu.gulimall</groupId>
    <artifactId>gulimall-common</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```
**测试url** : `http://localhost:11000/ware/wareinfo/list`
``` markdown
{"msg":"success","code":0,"page":{"totalCount":0,"pageSize":10,"totalPage":0,"currPage":1,"list":[]}}
```