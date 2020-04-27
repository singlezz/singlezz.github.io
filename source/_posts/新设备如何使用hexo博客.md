---
title: 新设备如何使用hexo博客
copyright: true
date: 2020-03-29 17:06:57
tags: hexo
categories: 博客教程
description: 如何在新的设备发布和维护我们自己的hexo博客呢？
---

# 前言

我们知道，使用 Github+hexo 搭建一个个人博客确实需要花不少时间的，我们搭好博客后使用的挺好，但是换一个电脑如何维护我们的博客呢？我们怎么使用 hexo 再发布文章到个人博客呢？

如果我们还是按照之间我们总结的教程再次搭建一个博客，然后修改代码更换 hexo 主题等，各种配置特别繁琐，那么有没有一种方便的方法，直接使用我们之前搭建好的博客的源文件呢？

# 操作步骤

## 一、安装必要软件

安装 Git 客户端

安装 node JS

## 二、在 github 官网添加新电脑产生的密钥

这个后面解释

## 三、源文件拷贝

我们将个人博客的资源文件克隆到本地

```java
$git clone source github或者gitee地址
```

我这里去克隆了我的github分支，没有创建分支和上传的可以从原先电脑中将资源文件拷贝过来。

## 四、安装 hexo

打开博客的目录，在根目录右键打开git bash命令行，在 命令行 输入下面指令安装 hexo：

```java
$npm install hexo-cli -g
$npm install
$npm install hexo-deployer-git --save//文章部署到 git 的模块
（下面为选择安装）
$npm install hexo-generator-feed --save//建立 RSS 订阅
$npm install hexo-generator-sitemap --save//建立站点地图
```

## 五、测试

这时候使用 `hexo s` 基本可以看到你新添加的文章了。

### 六、部署发布文章

```java
$hexo clean   // 清除缓存 网页正常情况下可以忽略此条命令
$hexo g       // 生成静态网页
$hexo d       // 开始部署
```

------

# 补充

### 1.在本地使用命令`hexo s`后浏览器访问127.0.0.1:4000显示`无法获取/`的问题。

#### 	原因

​	这是因为生成的静态页面没有生成index.html文件，我们查看npm安装hexo各个插件的情况：

```java
$npm ls --depth 0
```

![](ganningZHexoNPMls.png)

#### 	解决办法

​	我们需要逐一安装hexo需要的插件

```java
$npm install hexo-generator-archive --save
...
```

​	安装完重新构建即可。

### 2.本地测试完成后`hexo d`推送到远端服务器失败的问题。

#### 	原因

​	远端服务器需要识别git推送的个人信息，由`name`和`email`组成,我们需要配置本地git的信息。

#### 	解决办法

```java
$git config --global user.name "username"
$git config --global user.email “email"
```

​	生成SSH Key。

```java
$ssh-keygen -t rsa -C "email"
```

​	会在本地生成一个`.ssh`的文件夹，打开公钥并复制。然后去github在设置里面添加即可。