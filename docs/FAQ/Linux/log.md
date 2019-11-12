# 日志命令
**常用查看日志方法：**

**实时日志：** `tail -f test.log`

**根据关键字搜索：**

`cat -n test.log | grep "关键字" `

`tail -f test.log |grep "关键字"`

## tail命令

`tail -100f test.log`     -f是实时监控100行日志

`tail  -n  10  test.log`   查询日志尾部最后10行的日志

`tail -n +10 test.log`     查询10行之后的所有日志

## head命令

> 和tail命令相反，tail是看后多少行，而head是查看日志文件的头多少行

`head -n 10  test.log`    查询日志文件中的头10行日志

`head -n -10 test.log`    查询日志文件除了最后10行的其他所有日志

## cat命令

`cat -n test.log | grep "关键字" ` 常用

`tac test.log`    倒序查看。


## 查询日志场景

- 按行号查看 过滤关键字附近的日志

         cat -n test.log |grep "关键字"   获得关键字日志行号
        
         cat -n test.log |tail -n +50|head -n 30  选择关键字所在的中间一行. 然后查看这个关键字前10行和后10行的日志
        
         tail -n +92表示查询92行之后的日志
        
         head -n 20 则表示在前面的查询结果里再查前20条记录
        
- 根据日期查询

         sed -n '/2014-12-17 16:17:20/,/2014-12-17 16:17:36/p'  test.log
         
         上面的两个日期必须是日志中打印出来的日志,否则无效
         
         先 grep '2014-12-17 16:17:20' test.log 来确定日志中是否有该时间点
         
- 日志内容特别多

  使用more和less命令 `cat -n test.log |grep "关键字" |more`  空格翻页
  
  `>test.txt`将其保存到文件中： `cat -n test.log |grep "debug" >debug.txt`




    


              











