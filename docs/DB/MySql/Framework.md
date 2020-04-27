# MySQL高级

[[TOC]]

## MySQL逻辑架构

![MySQL架构](../img/framework_001.jpg "MySQL架构")


和其他数据库相比，MYSQL有点与众不同，它的架构可以在多种不同场景中应用并发挥良好作用。主要体现在存储引擎的架构上，
**插件式的存储引擎架构将查询处理和其他的系统任务以及数据的存储提取相分离**。这种架构可以根据业务的需求和实际需要选择合适的引擎。

## MySQL存储引擎
MySQL存储引擎有近十种，最常用的两种分别是MyISAM和InnoDB.

- 查看sql现在都有什么存储引擎
``` sql
show engines;
```
![MySQL现有存储引擎](../img/framework_002.jpg "MySQL现有存储引擎")
- 查看sql当前默认的存储引擎
``` sql
show varizbles like '%storage_engine%';
```
![MySQL当前默认的存储引擎](../img/framework_003.jpg "MySQL当前默认的存储引擎")

### MyISAM和InnoDB

对比项|MyISAM|InnoDB|
---|:--:|---:|
主外键|不支持|支持|
事务|不支持|支持|
行表锁|表锁，即使操作一条记录也会锁住整个表，不适合高并发的操作|行锁，操作时只锁某一行，不对其他行有影响，**适合高并发操作**|
缓存|只缓存索引，不缓存真实数据|不仅缓存索引还要缓存真实数据，对内存要求较高，而且内存大小对性能有决定性的影响。|
表空间|小|大|
关注点|性能|事务|

## 优化分析

### 性能下降SQL慢&执行时间长&等待时间长

- 查询语句写的烂
- 索引失效(单值索引、复合索引)
- 关联查询太多join(设计缺陷或不得已的需求)
- 服务器调优及各个参数设置(缓冲、线程数等)

### 常见通用的join查询

#### SQL执行顺序

**注意sql是从from开始执行的**
**手写**：
``` sql
SELECT DISTINCT <select_list> 
==> FROM <left_table> <join_type> 
==> JOIN <right_table> ON <join_condition>
==> WHERE <where_condition> 
==>GROUP BY <group_by_list> 
==>HAVING <having_condition> 
==>ORDER BY <order_by_condition> 
==>LIMIT <limit number>
```
**机读**：FROM->ON->WHERE->GROUP BY->HAVING->SELECT->DISTINCT->ORDER BY->LIMIT

![SQL执行顺序](../img/framework_004.png "SQL执行顺序")

#### 七种Join理论

- 内连接 inner join

![inner_join 内连接](../img/inner_join.jpg "inner_join 内连接")
``` sql
SELECT <select_list> FROM TableA A INNER JOIN TableB B ON A.Key = B.Key
```
- 左连接 left join

![left_join 左连接](../img/left_join.jpg "left_join 左连接")
``` sql
SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key
```
- 右连接 right join

![right 右连接](../img/right_join.jpg "right_join 右连接")
``` sql
SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key
```

- 左连接 left join is null

![左连接 left join is null](../img/left_join_isNull.jpg "左连接 left join is null")
``` sql
SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key WHERE B.Key IS NULL.
```

- 右连接 right join is null

![右连接 right join is null](../img/right_join_isNull.jpg "右连接 right join is null")
``` sql
SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key WHERE B.Key IS NULL.
```
- 全连接 full outer join 

![全连接 full outer join](../img/full_outer_join.jpg "全连接 full outer join")
``` sql
SELECT <select_list> FROM TableA A FULL OUTER JOIN TableB B ON A.Key = B.Key
```
**sql不支持，oracle支持**

所以可以使用union连接两个语句
``` sql
SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key union 
SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key
```

- 全连接 full outer join is null

![全连接 full outer join is null](../img/full_outer_join_isNull.jpg "全连接 full outer join is null")
``` sql
SELECT <select_list> FROM TableA A FULL OUTER JOIN TableB B ON A.Key = B.Key WHERE B.Key IS NULL.
```
使用union连接两个语句
``` sql
SELECT <select_list> FROM TableA A LEFT JOIN TableB B ON A.Key = B.Key WHERE B.Key IS NULL union 
SELECT <select_list> FROM TableA A RIGHT JOIN TableB B ON A.Key = B.Key WHERE B.Key IS NULL
```
## 索引

### 索引的定义

MySQL官方对索引的定义为：索引(Index)是帮助MySQL高效获取数据的数据结构。其本质是一种数据结构

**可以简单理解为排好序的快速查找的数据结构**,用于快速查找和排序。

索引的目的在于提高查询效率，可以类比字典。

索引可以影响到where语句后的查找和order by语句后的排序，这两大功能查找和排序都会有影响

若没有索引则会全扫描进行查找。

::: tip 索引详解
在数据之外，**数据库系统还维护着满足特定查找算法的数据结构**，这些数据结构以某种方式引用(指向)数据，
这样就可以在这些数据结构上实现高级查找算法。这种数据结构，就是索引。
:::

下图就是一种可能的索引方式示例：

![可能的索引方式](../img/framework_005.jpg "可能的索引方式")

为了加快Col2的查找，可以维护一个右边所示的二叉查找树，每个节点分别包含索引键值和一个指向对应数据记录
物理地址的指针，这样就可以运用二叉查找在一定的复杂度内获取到对应数据，从而快速的检索出符合条件的记录。

之所以要逻辑删除，而不进行物理删除，一是为了索引，二是为了共享数据(大数据，数据分析等)

::: tip 总结
一般来说索引本身也很大，不可能全部存储在内存中，因此索引往往以索引文件的形式存储在磁盘上。

我们平常所说的索引，如果没有特别指明，都是指B树(多路搜索树，并不一定是二叉的)结构组织的索引。

其中聚集索引，次要索引，复合索引，前缀索引，唯一索引默认都是使用B+树索引，统称索引。当然，除了B+树这种类型
的索引之外，还有哈希索引(hash index)等。
:::

### 索引优势

- 类似图书馆建书目索引，**提高数据检索的效率**，降低数据库的IO成本
- 通过索引列对数据进行排序，**降低数据排序的成本**，降低了CPU的消耗。

### 索引劣势

- 实际上索引也是一张表，该表保存了主键与索引字段，并指向实体表的记录，所以索引列也是要占用空间的。

- 虽然索引大大提高了查询速度，同时却会降低更新表的速度，如对表进行INSERT、UPDATE和DELETE。
因为更新表时，MySQL不仅要保存数据，还要保存一下索引文件每次更新添加了索引列的字段，
都会调整因为更新所带来的键值变化后的索引信息。

- 索引只是提高效率的一个因素，如果你的MySQL有大数据量的表，就需要花时间研究建立最优秀的索引，
或优化查询

### 索引分类

- 单值索引:即一个索引只包含单个列，一个表可以有多个单列索引
建议：索引最多不超过5个

- 唯一索引：索引列的值必须唯一，但允许有空值

- 复合索引:即一个索引包含多个列

::: tip 基本语法
- 创建 
``` sql
CREATE [UNIQUE] INDEX indexName ON table(columnname(length));
ALTER mytable ADD [UNIQUE] INDEX [indexName] ON (columnname(length));
```
- 删除
``` sql
DROP INDEX [indexName] ON mytable;
```
- 查看
``` sql
SHOW INDEX FROM table_name\G
```

有四种方式来添加数据表的索引:.

- `ALTER TABLE tbl_name ADD PRIMARY KEY(colum_list)`该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL.

- `ALTER TABLE tbl_name ADD UNIQUE index_name(colum_list)` 这条语句创建索引的值必须是唯一的（除了NULL外，NULL可能会出现多次）。

- `ALTER TABLE tbl_name ADD INDEX index_name(colum_list)` 添加普通索引，索引值可出现多次。

- `ALTER TABLE tbl_name ADD FULLTEXT index_name (colum_list)` 该语句指定了索引为FULLTEXT,用于全文索引。
:::

### 索引结构

- BTree索引

**检索原理**

![检索原理](../img/framework_006.jpg "检索原理")

【初始化介绍】：
一颗b+树，浅蓝色的块我们称之为一个磁盘块，可以看到每个磁盘块包含几个数据项(深蓝色所示)和指针(黄色所示)，
如磁盘块1包含数据项17和36，包含指针P1、P2、P3，
P1表示小于17的磁盘块，P2表示在17和35之间的磁盘块，P3表示大于35的磁盘块。
**真实的数据存在于叶子节点**即3、5、9、10、13、15、28、29、36、60、75、79、90、99.
**非叶子节点不存储真实的数据，只存储指引搜索方向的数据项**，如17、35并不真实存在于数据表中。

【查找过程】
如果要查找数据项29，那么首先会把磁盘块1由磁盘加载到内存，此时发生一次IO
在内存中用二分查找确定29在17和35之间，锁定磁盘块1的P2指针，内存时间因为非常短
(相比磁盘的IO)可以忽略不计，通过磁盘块1的P2指针的磁盘地址把磁盘块3由磁盘加载到内存，
发生第二次IO,29在26和30之间，锁定磁盘块3的P2指针，通过指针加载磁盘块8到内存，发生第三次IO,
同时内存中做二分查找找到29，结束查询，总计三次IO.

真实的情况是，3层的b+树可以表示上百万的数据，如果上百万的数据查找只需要三次IO,性能提高将是巨大
的，如果没有索引，每个数据项都要发生一次IO,那么总共需要百万次的IO,显然成本非常非常高。


- Hash索引

- full-text全文索引

- R-Tree索引

### 哪些情况需要创建索引
1.主键自动建立唯一索引

2.频繁作为查询条件的字段应该创建索引

3.查询中与其他表关联的字段，外键关系建立索引

4.频繁更新的字段不适合创建索引==> 因为每次更新不单单是更新了记录还会更新索引，加重了IO负担。

5.Where条件里用不到的字段不创建索引

6.单键/组合索引的选择问题，who？(在高并发下倾向创建组合索引)

7.查询中排序的字段，排序字段若通过索引去访问将大大提高排序速度

8.查询中统计或者分组字段
### 哪些情况不需要创建索引
1.表记录太少(差不多300w的数据，性能降低)

2.经常增删改的表
>Why:提高了查询速度，同时却会降低更新表的速度，如对表进行INSERT、UPDATE和DELETE。
>因为更新表时，MySQL不仅要保存数据，还要保存索引文件。

3.数据重复且分布平均的表字段，因此应该只为最经常查询和最经常排序的数据列建立索引。
注意，如果某个数据列包含许多重复的内容，为它建立索引就没有太大的实际效果。

## 性能分析

### MySql Query Optimizer (MySql查询优化器)

### MySQL常见瓶颈

- CPU:CPU在饱和的时候一般发生在数据装入内存或从磁盘上读取数据的时候

- IO:磁盘I/O发生在装入数据远大于内存容量的时候

- 服务器硬件的性能瓶颈:top,free,iostat和vmstat来查看系统的性能状态

### Explain(执行计划)

使用EXPLAIN关键字可以模拟优化器执行SQL查询语句，从而知道MySQL是如何处理你的SQL语句的。分析你的查询语句
或是表结构的性能瓶颈。

#### 使用

::: danger 能干嘛
表的读取顺序
数据读取操作的操作类型
哪些索引可以使用
哪些索引被实际使用
表之间的引用
每张表有多少行被优化器查询
:::

执行计划包含的信息：id | select_type | table | type | possible_keys | key | key_len | ref | rows | Extra | 

- **id** ：select查询的序列号，包含一组数字，表示查询中执行select子句或操作表的顺序

1.id相同，执行顺序由上至下

2.id不同，如果是子查询，id的序号会递增，**id值越大优先级越高，越先被执行**。

3.id相同不同，同时存在。id如果相同，可以认为是一组，从上往下顺序执行；在所有组中，id值越大，优先级越高，越先执行

- **select_type**:查询的类型

有哪些

id|select|detail|
---|:--:|:--:|
1|SIMPLE|简单的select查询，查询中不包含子查询或者UNION |
2|PRIMARY|查询中若包含任何复杂的子部分，最外层查询则被标记为，最外层的，最后加载|
3|SUBQUERY|在SELECT或WHERE列表中包含了子查询|
4|DERIVED|在FROM列表中包含的子查询被标记为DERIVED(衍生)MySQL会递归执行这些子查询，把结果放在临时表里|
5|UNION|若第二个SELECT出现在UNION之后，则被标记为UNION；若UNION包含在FROM子句的子查询中，外层SELECT将被标记为：DERIVED|
6|UNION RESULT|从UNION表获取结果的SELECT|

- **table**:显示这一行的数据是关于哪张表的

- **type**:访问类型排列

从最好到最差依次是：

常见：system>const>eq_ref>ref>range>index>ALL

全部：system>const>eq_ref>ref>fulltext>ref_or_null>index_merge>unique_subquery>index_subquery>range>index>ALL

一般来说，得保证查询至少达到range级别，最好能达到ref。

1.ALL

type=ALL 百万级别 性能下降 全表扫描

2.system

表只有一行记录(等于系统表)，这是

3.eq_ref 唯一性索引扫描，对于每个索引键，表中只有一条记录与之匹配。常见于主键或唯一索引扫描

4.ref

5.range 

6.index

7.all

- **possible_keys**

理论上可能会用到的索引

显示可能应用在这张表中的索引，一个或多个。


- **key**

实际最终使用的索引。
若查询中使用了覆盖索引，则该索引仅出现在key列表中

- **key_len**: 表示索引中使用的字节数

可通过该列计算查询中使用的索引的长度。在不损失精确性的情况下，**长度越短越好**

key_len显示的值为索引字段的最大可能长度，并非实际使用长度，即key_len是根据表定义计算而得，不是通过表内检索出的。

- **ref**: 显示索引的哪一列被使用了，如果可能的话，是一个常数。哪些列或常量被用于查找索引列上的值

- **rows**：根据表统计信息及索引选用情况，大致估算出找到所需的记录所需要读取的行数

- **Extra**:包含不适合在其他列中显示但十分重要的额外信息

1.Using filesort

说明mysql会对数据使用一个外部的索引排序，而不是按照表内的索引顺序进行读取。
MySQL中无法利用索引完成的排序操作称为“文件排序”

2.Using temporary

使用了临时表保存中间结果，MySQL在对查询结果排序时使用临时表。常见于排序order by 和 分组查询 group by。

临时表对性能有很大的影响

3.Using index  

表示相应的select操作中使用了**覆盖索引(Covering Index)**,避免访问了表的数据行，效率不错！

如果同时出现using where, 表明索引被用来执行索引键值的查找；

如果没有同时出现using where，表明索引用来读取数据而非执行查找动作。

::: tips 覆盖索引
一说为索引覆盖，就是select的数据列只用从索引中就能够取得，不必读取数据行，MySQL可以利用索引返回
select列表中的字段，而不必根据索引再次读取数据文件，换句话说**查询列要被所建的索引覆盖。**

注意：如果要使用覆盖索引，一定要注意select列表中只取出需要的列，不可select*，
因为如果将所有字段一起做索引会导致索引文件过大，查询性能下降。
:::

4.Using where 

使用了where过滤

5.using join buffer

使用了连接缓存，可配置。

6.impossible where 

where子句的值总是false,不用用来获取任何元组

举例：where name='张三' and name='李四'

7.select tables optimized away

8.distinct 

优化distinct操作，在找到第一匹配的元组后即停止找同样值得动作

## 索引优化

### 索引分析

单表

两表

三表

左连接 加右表索引  因为LEFT JOIN 条件用于确定如何从右表搜索行，左边一定都有。

右连接同理

::: tips 结论
Join语句的优化

尽可能减少Join语句中的NestedLoop的循环总次数：“永远用小结果集驱动大的结果集”。

优先优化NestedLoop的内层循环：

保证Join语句中被驱动表上Join条件字段已经被索引；

当无法保证被驱动表的Join条件字段被索引且内存资源充足的前提下，不要太吝惜JoinBuffer的设置
:::

### 索引失效(应该避免)

1.全值匹配我最爱

2.最佳左前缀法则

如果索引了多列，要遵守最左前缀法则。指的是查询从索引的最左前列开始并且**不跳过索引中的列。**

3.不在索引列上做任何操作(计算、函数、(自动or手动)类型转换)，会导致索引失效而转向全表扫描

4.范围查询也会使索引失效

5.尽量使用覆盖索引(只访问索引的查询(索引和查询列一致))，减少select *

6.mysql在使用不等于(!=或者<>)的时候无法使用索引会导致全表扫描

7.is null, is not null 也无法使用索引

8.like 以通配符开头(‘%abc...’)mysql索引失效会变成全表扫描的操作

百分like加右边 %写右边会避免索引失效

两边都有%  使用覆盖索引

9.字符串不加单引号索引失效

10.少用or，用它来连接时会索引失效

### 举例分析

定值、范围还是排序，一般order by是给个范围

group by 基本上都需要进行排序，会有临时表产生

### 一般性建议：

- 对于单键索引，尽量选择针对当前query过滤性更好得索引

- 在选择组合索引得时候，当前Query中过滤性最好得字段在索引字段顺序中，位置越靠前越好。

- 在选择组合索引得时候，尽量选择可以能够包含当前query中得where字句中更多字段得索引

- 尽可能通过分析统计信息和调整query的写法来达到选择合适索引的目的

::: danger 打油诗
全值匹配我最爱，最左前缀要遵守；

带头大哥不能死，中间兄弟不能断；

索引列上少计算，范围之后全失效；

Like百分写最右，覆盖索引不写星；

不等空值还有or，索引失效要少用；

VAR引号不可丢，SQL高级也不难！
:::

### EXISTS

``` sql
SELECT ...FROM table WHERE EXISTS(subquery)
```
将主查询的数据，放到子查询中做条件验证，根据验证结果(TRUE或FALSE)来决定主查询的数据结果是否得以保留。


### 使用索引OrderBy优化

ORDER BY 满足两种情况，会使用Index方式排序：

ORDER BY 语句使用索引最左前列

使用Where子句与Order By子句条件列组合满足索引最左前列

MySql两种排序方式：文件排序或扫描有序索引排序
MySql能为排序与查询使用相同的索引

order by 能使用索引最左前缀

- ORDER BY a

- ORDER BY a,b

- ORDER BY a,b,c

- ORDER BY a DESC, b DESC, c DESC

如果where使用索引的最左前缀定义为常量，则order by能使用索引

- WHERE a = const ORDER BY b,c

- WHERE a = const AND b = const ORDER BY c

- WHERE a = const ORDER BY b,c

- WHERE a = const AND b > const ORDER BY b,c

不能使用索引进行排序

-ORDER BY a AEC，b DESC，c DESC  排序不一致

- WHERE g=const ORDER BY b，c    丢失a索引

- WHERE a=const ORDER BY c       丢失b索引

- WHERE a=const ORDER BY a,d     d不是索引的一部分

### GROUP BY

group by 实质是先排序后进行分组，遵照索引建的的最佳左前缀

当无法使用索引列，增大max_length_for_sort_data参数的设置+增大sort_buffer_size参数的设置

where高于having，能写在where限定的条件就不要去having限定了

## 慢查询日志

### 概念

MySQL的慢查询日志是MySQL提供的一种日志记录，它用来记录在MySQL中响应时间超过阀值的语句，
具体指运行时间超过long_query_time值的SQL，则会被记录到慢查询日志中。

long_query_time的默认值为10，意思是运行10S以上的语句。默认情况下，Mysql数据库并不启动慢查询日志，需要我们手动来设置这个参数，当然，如果不是调优需要的话，一般不建议启动该参数，因为开启慢查询日志会或多或少带来一定的性能影响。
慢查询日志支持将日志记录写入文件，也支持将日志记录写入数据库表。

### 相关参数

**MySQL 慢查询的相关参数解释**：slow_query_log ：是否开启慢查询日志，1表示开启，0表示关闭。

``` sql
slow_query_log    ：是否开启慢查询日志，1表示开启，0表示关闭。

log-slow-queries  ：旧版（5.6以下版本）MySQL数据库慢查询日志存储路径。可以不设置该参数，系统则会默认给一个缺省的文件host_name-slow.log

slow-query-log-file：新版（5.6及以上版本）MySQL数据库慢查询日志存储路径。可以不设置该参数，系统则会默认给一个缺省的文件host_name-slow.log

long_query_time ：慢查询阈值，当查询时间多于设定的阈值时，记录日志。

log_queries_not_using_indexes：未使用索引的查询也被记录到慢查询日志中（可选项）。

log_output：日志存储方式。log_output='FILE'表示将日志存入文件，默认值是'FILE'。log_output='TABLE'表示将日志存入数据库，
这样日志信息就会被写入到mysql.slow_log表中。MySQL数据<br>库支持同时两种日志存储方式，配置的时候以逗号隔开即可，如：log_output='FILE,TABLE'。
日志记录到系统的专用日志表中，要比记录到文件耗费更多的系统资源，因此对于需要启用慢查询日志，又需要能够获得更高的系统性能，那么建议优先记录到文件。
```
### 配置

默认情况下slow_query_log的值为OFF，表示慢查询日志是禁用的，可以通过设置slow_query_log的值来开启，如下所示：

- 查看是否开启慢查询日志
``` sql
show variables like '%slow_query_log%';
```
- 设置是否开启慢查询日志
``` sql
set global slow_query_log=1;
```

使用set global slow_query_log=1开启了慢查询日志只对当前数据库生效，MySQL重启后则会失效。如果要永久生效，就必须修改配置文件my.cnf（其它系统变量也是如此）

- 设置永久开启慢查询日志

修改my.cnf文件，增加或修改参数slow_query_log 和slow_query_log_file后，然后重启MySQL服务器，如下所示:

``` properties
slow_query_log =1
slow_query_log_file=/usr/local/mysql/data/localhost-slow.log
long_query_time=3
```
慢查询的参数slow_query_log_file ，它指定慢查询日志文件的存放路径，系统默认会给一个缺省的文件host_name-slow.log

- 查询时间大于long_query_time的会被记录到慢查询日志中

从MySQL 5.1开始，long_query_time开始以微秒记录SQL语句运行时间，之前仅用秒为单位记录。如果记录到表里面，只会记录整数部分，不会记录微秒部分。

查看long_query_time的时间设置

``` sql
show variables like 'long_query_time';
```

设置long_query_time的时间

``` sql
set global long_query_time=4;
```

不用重新连接会话,查看long_query_time的时间设置

``` sql
show global variables like 'long_query_time';
```

- log_output 参数是指定日志的存储方式。

log_output='FILE'表示将日志存入文件，默认值是'FILE'。log_output='TABLE'表示将日志存入数据库，这样日志信息就会被写入到mysql.slow_log表中。
MySQL数据库支持同时两种日志存储方式，配置的时候以逗号隔开即可，如：log_output='FILE,TABLE'。日志记录到系统的专用日志表中，
要比记录到文件耗费更多的系统资源，因此对于需要启用慢查询日志，又需要能够获得更高的系统性能，那么建议优先记录到文件.

``` sql
show variables like '%log_output%';
```

- 未使用索引的查询也被记录到慢查询日志中

系统变量log-queries-not-using-indexes：未使用索引的查询也被记录到慢查询日志中（可选项）。如果调优的话，建议开启这个选项。另外，
开启了这个参数，其实使用full index scan的sql也会被记录到慢查询日志。

查看

``` sql
show variables like 'log_queries_not_using_indexes';
```

设置

``` sql
set global log_queries_not_using_indexes=1;
```

- log_slow_admin_statements

系统变量log_slow_admin_statements表示是否将慢管理语句例如ANALYZE TABLE和ALTER TABLE等记入慢查询日志

``` sql
show variables like 'log_slow_admin_statements';
```

- 查询有多少条慢查询记录

``` sql
show global status like '%slow_queries%';
```

### 日志分析工具mysqldumpslow

在实际生产环境中，如果要手工分析日志，查找、分析SQL，显然是个体力活，MySQL提供了日志分析工具mysqldumpslow

>-s, 是表示按照何种方式排序

>   c: 访问计数

>    l: 锁定时间

>    r: 返回记录

>    t: 查询时间

>    al:平均锁定时间

>    ar:平均返回记录数

>    at:平均查询时间

>-t, 是top n的意思，即为返回前面多少条的数据；

>-g, 后边可以写一个正则匹配模式，大小写不敏感的；

 

比如:

得到返回记录集最多的10个SQL。

``` text
mysqldumpslow -s r -t 10 /database/mysql/mysql06_slow.log
```

得到访问次数最多的10个SQL

``` text
mysqldumpslow -s c -t 10 /database/mysql/mysql06_slow.log
```

得到按照时间排序的前10条里面含有左连接的查询语句。

``` text
mysqldumpslow -s t -t 10 -g “left join” /database/mysql/mysql06_slow.log
```
 
另外建议在使用这些命令时结合 | 和more 使用 ，否则有可能出现刷屏的情况。

``` text
mysqldumpslow -s r -t 20 /mysqldata/mysql/mysql06-slow.log | more
```

## 批量插入数据脚本

## Show Profile



 



