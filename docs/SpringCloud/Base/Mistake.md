# Mistake

[[TOC]]

## Feign PathVariable annotation was empty on param 0.

使用Feign的时候,如果参数中带有

@PathVariable形式的参数,则要用value=""标明对应的参数,否则会抛出IllegalStateException异常

如

@PutMapping("/disuseable/{sn}")

ApiResponse disUseAble(@PathVariable String sn);   // wrong

-->

@PutMapping("/disuseable/{sn}")

ApiResponse disUseAble(@PathVariable(value="sn") String sn);  // right

## RequestParam.value() was empty on parameter 0

看提示很明显是参数问题，RequestParam注解的第一个参数是不能为空

简单粗暴的把RequestParam注解去掉，启动成功。再试试加上注解的描述

修改成：

@PostMapping(value = "url")

public Envelop create(@RequestParam(value = "jsonData", required = true) String jsonData);

这样启动成功，ok解决了。

回顾下照常这个错误的原因，刚开始写接口时参数的注解是RequestBody，RequestBody不需要注解的描述。

后来入参方式改成RequestParam，就导致这个错误了。

