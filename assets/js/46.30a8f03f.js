(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{337:function(t,e,a){"use strict";a.r(e);var v=a(0),_=Object(v.a)({},(function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"日志命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#日志命令"}},[t._v("#")]),t._v(" 日志命令")]),t._v(" "),a("p",[a("strong",[t._v("常用查看日志方法：")])]),t._v(" "),a("p",[a("strong",[t._v("实时日志：")]),t._v(" "),a("code",[t._v("tail -f test.log")])]),t._v(" "),a("p",[a("strong",[t._v("根据关键字搜索：")])]),t._v(" "),a("p",[a("code",[t._v('cat -n test.log | grep "关键字"')])]),t._v(" "),a("p",[a("code",[t._v('tail -f test.log |grep "关键字"')])]),t._v(" "),a("h2",{attrs:{id:"tail命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#tail命令"}},[t._v("#")]),t._v(" tail命令")]),t._v(" "),a("p",[a("code",[t._v("tail -100f test.log")]),t._v("     -f是实时监控100行日志")]),t._v(" "),a("p",[a("code",[t._v("tail -n 10 test.log")]),t._v("   查询日志尾部最后10行的日志")]),t._v(" "),a("p",[a("code",[t._v("tail -n +10 test.log")]),t._v("     查询10行之后的所有日志")]),t._v(" "),a("h2",{attrs:{id:"head命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#head命令"}},[t._v("#")]),t._v(" head命令")]),t._v(" "),a("blockquote",[a("p",[t._v("和tail命令相反，tail是看后多少行，而head是查看日志文件的头多少行")])]),t._v(" "),a("p",[a("code",[t._v("head -n 10 test.log")]),t._v("    查询日志文件中的头10行日志")]),t._v(" "),a("p",[a("code",[t._v("head -n -10 test.log")]),t._v("    查询日志文件除了最后10行的其他所有日志")]),t._v(" "),a("h2",{attrs:{id:"cat命令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cat命令"}},[t._v("#")]),t._v(" cat命令")]),t._v(" "),a("p",[a("code",[t._v('cat -n test.log | grep "关键字"')]),t._v(" 常用")]),t._v(" "),a("p",[a("code",[t._v("tac test.log")]),t._v("    倒序查看。")]),t._v(" "),a("h2",{attrs:{id:"查询日志场景"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查询日志场景"}},[t._v("#")]),t._v(" 查询日志场景")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("按行号查看 过滤关键字附近的日志")]),t._v(" "),a("pre",[a("code",[t._v('   cat -n test.log |grep "关键字"   获得关键字日志行号\n  \n   cat -n test.log |tail -n +50|head -n 30  选择关键字所在的中间一行. 然后查看这个关键字前10行和后10行的日志\n  \n   tail -n +92表示查询92行之后的日志\n  \n   head -n 20 则表示在前面的查询结果里再查前20条记录\n')])])]),t._v(" "),a("li",[a("p",[t._v("根据日期查询")]),t._v(" "),a("pre",[a("code",[t._v("   sed -n '/2014-12-17 16:17:20/,/2014-12-17 16:17:36/p'  test.log\n   \n   上面的两个日期必须是日志中打印出来的日志,否则无效\n   \n   先 grep '2014-12-17 16:17:20' test.log 来确定日志中是否有该时间点\n")])])]),t._v(" "),a("li",[a("p",[t._v("日志内容特别多")]),t._v(" "),a("p",[t._v("使用more和less命令 "),a("code",[t._v('cat -n test.log |grep "关键字" |more')]),t._v("  空格翻页")]),t._v(" "),a("p",[a("code",[t._v(">test.txt")]),t._v("将其保存到文件中： "),a("code",[t._v('cat -n test.log |grep "debug" >debug.txt')])])])])])}),[],!1,null,null,null);e.default=_.exports}}]);