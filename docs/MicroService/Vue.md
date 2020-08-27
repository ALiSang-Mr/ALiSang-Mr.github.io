# Vue

[[TOC]]

## MVVM思想
- **M**：module 包括数据和一些基本操作
- **V**：view 视图，页面渲染结果
- **VM**：View-module，模型与视图间的双向操作（无需开发人员干涉）

视图和数据通过VM绑定起来，模型里有变化会自动地通过Directives填写到视图中，视图表单中添加了内容也会自动地通过DOM Listeners保存到模型中。

官网教程-->[https://cn.vuejs.org/v2/guide/](https://cn.vuejs.org/v2/guide/)

## 安装
1. 直接下载并用 `<script>` 标签引入

2. 或者在VsCode控制台使用npm install vue导入。 
- 先`npm init -y`初始化项目，生成了一个package.json文件，说明他是一个npm管理的项目
- `npm install vue`，安装后在项目node_modules里既有vue

