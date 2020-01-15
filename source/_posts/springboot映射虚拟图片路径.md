---
title: springboot映射虚拟图片路径
date: 2020-01-15 15:38:54
tags: springboot
description: 毕业设计中springboot遇到项目路径无法访问磁盘路径的图片
---

# 前言

​		我的毕设项目中涉及到了多媒体表单提交，以我本来的想法是希望把上传的图片文件存在我的项目中，数据库中只需要存在一个独一无二的图片名字，这样就不会因为项目的移动而需要修改图片的实际路径。

​		当我完成信息修改的方法是发现我所上传的图片并没有显示出来。

![](asjdfasjdoasnlgjas.png)

​		这个问题想了很久，我的图片路径是对的，图片名字也是对的，查看源代码也是404，但是当我去复制已经在项目中存在图片到数据库确是可以在页面出来，百思不得其解。偶然间得到了灵感，突然看到我项目中的图片数量和本地磁盘中的图片数量不一致，恍然大悟，原本项目中有自己复制的图片，经过编译后是存在与class中的，后期项目启动时上传的图片上传到项目的源代码项目中，很明显时无法拿到的。

![](ikedjdcjfh.png)	![](plmjmh.png)

# 解决办法

​		1.我在项目中properties配置文件中指定了本地磁盘的项目图片路径，通过配置映射项目中图片路径。

![](sidgdikghkd.png)

​		2.通过配置类指定映射图片路径。

```java
package com.zhouli.gd.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebAppConfig extends WebMvcConfigurerAdapter {

    @Value("${spring.servlet.multipart.location}")
    private String storageRootFolder;

    @Value("${spring.servlet.asset.virtual.path}")
    String virtualPath;

    /***
     * 配置图片等资源虚拟路径
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(virtualPath).addResourceLocations("file:" + storageRootFolder);
        super.addResourceHandlers(registry);
    }

}
```

​		3.按照原来的想法数据库中只存放图片名，通过访问修改页面。。。

![](idsfengoal.png)

##### 尾言：这是第一次以Springboot+Mybatis架构做一个毕业设计，原先一直时SSM+eclipse做的项目练手，此前配置图片的映射路径只需要在tomcat中配置。

方法一：

```java
<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">

<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
           prefix="localhost_access_log." suffix=".txt"
           pattern="%h %l %u %t &quot;%r&quot; %s %b" />
<!-- 设置图片虚拟路径[访问时路径为/photo] -->  
<Context path="/photo" docBase="D:\upFiles" reloadable="true" /> 

<!-- 也可以这样设置图片虚拟路径 -->  
<Host name="10.0.0.123" appBase="webapps"  
        unpackWARs="true" autoDeploy="true" 
 xmlValidation="false" xmlNamespaceAware="false"> 
 <Context path="" docBase="F:\temp" reloadable="false" ></Context>  </Host>
```

方法二：

![](ifnasjkas.png)