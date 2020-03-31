# Linux 部署

[[TOC]]

## java

1.复制压缩包到一个目录下，例如：cp jdk.tar.gz /usr/local/

2.解压缩，例如：tar xvf jdk.tar.gz

3.建立软连接，例如：ln -s jdk1.7.0_67 jdk

4.编辑系统文件，`vim /etc/profile`，添加内容如下

``` markdown
      export JAVA_HOME=/usr/local/jdk
      export CLASSPATH=$CLASSPATH:$JAVA_HOME/lib:$JAVA_HOME/jre/lib
      export PATH=$PATH:$JAVA_HOME/bin
```    
    
5.使文件生效，`source /etc/profile`

6.`java -version`

## redis
1.

redis下载地址:也可以直接下载到服务器：`wget http://download.redis.io/releases/redis-4.0.11.tar.g`

或者 `rz 选择tar包文件`

2.解压缩，例如：`tar -zxvf redis-3.2.1.tar.gz`

3.建立软连接，例如：`ln -s redis-3.2.1 redis`

4.在redis目录下执行安装命令，如下：

`cd /usr/local/redis`
      
`make PREFIX=/usr/local/redis install`

5.在/etc目录下创建redis目录，mkdir /etc/redis

6.在/etc/redis目录下创建redis配置文件，例如：6384.conf，其中有一些重要属性需要修改，如下：

``` markdown
      port 6384 端口号，最好和配置名称对应
      bind 0.0.0.0 允许访问的ip地址，0.0.0.0允许所有ip访问
      databases 1 创建数据库，目前是一块
      save "" 存储磁盘位置，不设置则不存盘
      dir /data/redis/6384/ 设置一个工作磁盘目录s
      	xxxx 设置密码，用于登陆
      maxmemory 512mb 最大占用内存单位mb，gb
```
7.在/etc/init.d/目录下创建redis启动文件，其中有一些重要属性，如下：
``` markdown
      case 中的条件，如youhuipai，这个是启动redis别名，可以自行设置任意名称
      REDISPORT=6384 占用的端口号，等于redis配置中的port值
      REDISPASS="xxxx" 登陆密码，等于redis配置文件中的requirepass值
      EXEC=/usr/local/redis/bin/redis-server 执行redis服务端命令的位置
      CLIEXEC=/usr/local/redis/bin/redis-cli 执行redis客户端命令的位置
      PIDFILE=/var/run/redis_${REDISPORT}.pid redis进程号存放位置
      CONF="/etc/redis/${REDISPORT}.conf" redis配置文件位置
```
创建完成需要更好执行权限，`chmod 777 redis`

``` shell script
#!/bin/sh
# chkconfig: 2345 80 90
#
# Simple Redis init.d script conceived to work on Linux systems
# as it does use of the /proc filesystem.


REDISPORT=6379
case "$2" in
    1)
	REDISPORT=6384
	REDISPASS="Queke123!!!"
	;;
    *)
	echo "Please use youhuipai as second argument"
	exit 1
        ;;
esac


EXEC=/usr/local/redis/bin/redis-server
CLIEXEC=/usr/local/redis/bin/redis-cli

PIDFILE=/var/run/redis_${REDISPORT}.pid
CONF="/etc/redis/${REDISPORT}.conf"

case "$1" in
    start)
        if [ -f $PIDFILE ]
        then
                echo "$PIDFILE exists, process is already running or crashed"
        else
                echo "Starting Redis server..."
                $EXEC $CONF &
        fi
        ;;
    stop)
        if [ ! -f $PIDFILE ]
        then
                echo "$PIDFILE does not exist, process is not running"
        else
                PID=$(cat $PIDFILE)
                echo "Stopping ..."
                $CLIEXEC -p $REDISPORT -a $REDISPASS shutdown
                while [ -x /proc/${PID} ]
                do
                    echo "Waiting for Redis to shutdown ..."
                    sleep 1
                done
                echo "Redis stopped"
        fi
        ;;
    *)
        echo "Please use start or stop as first argument"
        ;;
esac
```
8.启动redis命令，service redis start xxxx，其中xxxx对应redis启动文件case中的别名

9.关闭redis命令，service redis stop xxxx

- 启动&查看

`ps -ef | grep redis`

`./redis-server /etc/redis/6379.conf`

`./redis-cli -h 127.0.0.1 -p 6379`

`auth 密码`

- 卸载
``` markdown
#查看进程
ps aux |grep redis
#杀掉进程
kill -9 进程号
#查看相关文件
find / -name "redis"
#删除文件
rm -rf 文件
```
## nginx

1.安装make
`yum -y install gcc automake autoconf libtool make`

`yum install gcc gcc-c++`


2.安装pcre
`cd /usr/local/src`    //进入src目录

`wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.39.tar.gz`    //下载pcre库

`tar -zxvf pcre-8.39.tar.gz`  //解压

`cd pcre-8.39`

`./configure`

`make && make install`

3.安装zlib

`cd /usr/local/src`      //进入src目录

`wget http://zlib.net/zlib-1.2.11.tar.gz`     //下载zlib库

`tar -zxvf zlib-1.2.11.tar.gz`

`cd zlib-1.2.11`

`./configure`

`make && make install`

4.安装openssl

`cd /usr/local/src`

`wget https://www.openssl.org/source/openssl-1.0.1t.tar.gz`

`tar -zxvf openssl-1.0.1t.tar.gz`

`./config && make && make install`

5.安装nginx

cd /usr/local/src

`wget http://nginx.org/download/nginx-1.1.10.tar.gz`

`tar -zxvf nginx-1.1.10.tar.gz`

`cd nginx-1.1.10`

`./configure`

`make && make install`

nginx启动命令:

`/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf` 或 
进入 sbin目录  执行`./nginx ` 

查看 nginx 进程：

 `ps aux|grep nginx `


启动失败:

`ln -s /usr/local/lib/libpcre.so.1 /lib`<!--上一步成功这一步忽略-->

停止

`./nginx -s quit`

开放80端口`firewall-cmd --zone=public --add-port=80/tcp --permanent`

停止防火墙`systemctl stop firewalld.service`

启动防火墙`systemctl start firewalld.service`

## zookeeper

1.cd /usr/local/

2.上传压缩包

   rz  选择压缩包 

3.`tar -zxvf zookeeper-3.4.10.tar.gz`

4.`ln -s  zookeeper-3.4.10  zookeeper`

5.配置环境变量

`vim /etc/profile`

`export ZOO_HOME=/usr/local/zookeeper`

`export PATH=$PATH:$ZOO_HOME/bin`

6.使/etc/profile生效  ：`source /etc/profile`

7.`cd /usr/local/zookeeper`

`zkServer.sh start`  //启动zookeeper

`netstat -lntp | grep java`  # 检查端口是否有正常监听

`zkServer.sh status`  # 查看zookeeper服务状态

`ps aux |grep java`  # 检查服务进程

8.关闭 zookeeper

`zkServer.sh stop`

zoo.cfg配置：

    tickTime：用于计算的时间单元。比如session超时：N * tickTime
    initLimit：用于集群，允许从节点连接并同步到master节点的初始化连接时间，以tickTime的倍数来表示
    syncLimit：用于集群，master主节点与从节点之间发送消息，请求和应答时间长度（心跳包机制）
    dataDir：必须配置，数据文件所存放的目录
    dataLogDir：日志目录，如果不配置就和dataDir共用同一个目录
    clientPort：连接服务器的端口，默认为2181


调试：`./zkServer.sh start-foreground`

## mysql
1.复制压缩包到一个目录下，例如：`cp mysql-5.5.45-linux2.6-x86_64.tar.gz /usr/local/`

2.解压缩，例如：`tar xvf mysql-5.5.45-linux2.6-x86_64.tar.gz`

3.建立软连接，例如：`ln -s mysql-5.5.45-linux2.6-x86_64 mysql`

4.编辑系统文件，`vim /etc/profile`，添加内容如下

      export MYSQL_HOME=/usr/local/mysql
      export PATH=$PATH:$MYSQL_HOME/bin
      
5.使文件生效，`source /etc/profile`

6.编辑mysql配置文件，文件目录`/etc/my.cnf`，其中有些重要属性，
``` markdown
      datadir 这个是数据库存储目录
      log 这个是日志目录
      pid-file 进程号存储目录
      socket 登陆需要的信息存储位置
      server-id 用于在一台服务器启动多个mysql实例的服务号，不能重复
      binlog-ignore-db 主从同步属性，配置到主mysql属性中，binlog不需要同步的数据库名称
      binlog-do-db 主从同步属性，配置到主mysql属性9中，binlog需要同步的数据库名称
      replicate-ignore-db 主从同步属性，配置到从mysql属性中，binlog不需要同步的数据库名称   
      replicate-do-db 主从同步属性，配置到从mysql属性中，binlog需要同步的数据库名称
      log-error 启动错误日志位置
```
7.安装初始化库，在script目录下执行：`./mysql_install_db --user=root --basedir=/usr/local/mysql --datadir=/data/mysql/master`

8.启动mysql主从服务，`mysqld_multi start 1` 和 `mysqld_multi start 2`，其中1，2是配置中的server-id

9.分别登陆mysql, `mysql -h 127.0.0.1 -uroot `,`mysql -S /tmp/mysql.sock1`， -S的内容是配置中的socket

10.设置登陆权限，`grant all PRIVILEGES on *.* to root@'%'  identified by 'root123'`; //外网连接密码

11.刷新权限，`flush privileges`;

12.关闭数据库，`mysqld_multi stop 1`，在`/etc/my.cnf`中把`/etc/my.cnf`下注掉的#user和#password打开。//内网连接

13.启动数据库，`mysqld_multi start 1`，执行`mysqladmin -u root password Queke123 -S /tmp/mysql.sock1`，注意这些密码必须是一样的。

14.本地登陆mysql命令改为，`mysql -uroot -pQueke123 -S /tmp/mysql.sock1`,安装完毕。下面是主从的配置，可以不看。



15.登陆主mysql设置主从同步账号，`GRANT REPLICATION SLAVE ON *.* TO 'backup'@'localhost' IDENTIFIED BY 'backup123'`

16.在主mysql中查询binlog信息，`show master status`，其中File属性就是binlog名称，Position是需要开始同步位置，这两个属性是需要记住的

17.登陆从mysql关闭从同步，stop slave

18.在从mysql中配置从同步信息，`change master to master_host='127.0.0.1', master_user='backup', master_password='backup123'`, 
`master_log_file='mysql-bin.000005', master_log_pos=142`，其中master_log_file和master_log_pos就是主mysql查到的binlog信息

19.在从mysql开启从同步，start slave

20.关闭数据库命令，`mysqld_multi stop 1` 和 `mysqld_multi stop 2`

21.mysql备份，通过crontab -e

     输入0 0 * * * /usr/local/shell/mysql-backup.sh >> /data/mysql_backup/mylog.log 2>&1
     脚本是mysql-backup.sh 
     
给脚本执行权限：cdh

22.slave_skip_errors = 1062 同步的时候跳过主键冲突的错误




//安装完成后注意事项

1.mysql -uroot -pQueke123 -S /tmp/mysql.sock1 为本机登录  Queke123是登录密码

2./etc/my.cnf 下的password 为外网连接密码

3.修改外网密码连接方式

1.本机登录

2.mysql>use mysql;

mysql> update user set password=passworD("test") where user='root';

mysql> flush privileges;

mysql> exit;  


//数据库连接错误处理

MySql Host is blocked because of many connection errors; unblock with 'mysqladmin flush-hosts' 解决方法

mysqladmin --socket=/tmp/mysql.sock1 --port=3306 -uroot -p flush-hosts






