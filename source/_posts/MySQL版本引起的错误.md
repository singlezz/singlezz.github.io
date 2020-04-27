---
title: MySQL版本引起的错误
copyright: true
date: 2020-04-24 11:22:00
tags: MySQL
categories: MySQL
description: SpringBoot项目由于MySQL版本引发的问题
---

# 前言

接上一篇帖子，博主在CentOS上安装了最新版的MySQL容器（版本为8.0.19），在使用本地springBoot项目连接，启动项目后操作登录系统时报错。

# 问题

请看代码：

```java
com.mysql.jdbc.exceptions.jdbc4.MySQLNonTransientConnectionException: Could not create connection to database server. Attempted reconnect 3 times. Giving up.
Caused by: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure
```

这是由于MySQL8.0以上版本的驱动连接与5.0版本有所不同，下面是链接配置

```
jdbc.driver=com.mysql.cj.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/sys_test?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=UTC&zeroDateTimeBehavior=CONVERT_TO_NULL
jdbc.username=root
jdbc.password=root
```

<font color=red>*注：serverTimezone=UTC必须存在否则连接不上，没有useSSL=false会在启动时会出现报红，询问是否使用SSL进行连接，但不影响使用，true或false都可以，加上这个参数后就会消失。*</font>

这里列出驱动的差别：

```json
##版本8.0.19驱动
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
##版本5.6 目前项目中用的
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

# 修正结果

## 添加maven坐标

```xml
<dependency>
	<groupId>mysql</groupId>
	<artifactId>mysql-connector-java</artifactId>
	<version>8.0.16</version>
</dependency>
```

## 使用版本驱动

```json
##版本8.0.19驱动
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

## 测试结果

成功登录