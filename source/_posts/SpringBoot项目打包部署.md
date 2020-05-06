---
title: SpringBoot项目打包部署
copyright: true
date: 2020-04-29 13:34:11
tags: Java
categories: SpringBoot
description: 自己的SpringBoot项目如何打包部署到自己的服务器上
---

# 前言

博主最近一直在做自己的毕设系统，这个说了好多次了哦。

到了后期完善阶段，恰巧自己在阿里云领取了半年的服务器，配置还算不错。那么有想法把自己的系统上传到服务器上去。

# 工具

- CentOS7
- Xshell
- Xftp

# SpringBoot打包方式

SpringBoot打包方式有很多种。

- war包
- jar包
- 提交github，通t过jekins打包部署

*<font color=red>注：</font>不推荐SpringBoot项目打war包，因为SpringBoot适合前后端分离，适合打jar包。*

# 打包前进行的操作

## application.properties

相关的工具，类似于数据库，Redis缓存等都需要更换数据源。这里博主贴一下自己的配置文件。

![](image-20200429135038819.png)

一般情况下会在要部署的服务器上安装相应的环境并测试连接成功。

## maven配置文件

![](image-20200429135551050.png)

1. 打包的版本只能打1.4.2.RELEASE版本
2. 没有启动类路径打包后启动报错“找不到主类”

## Application.java

在启动类加上`extends SpringBootServletInitializer`并重写`configure`方法。

```java
@SpringBootApplication
public class GdApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(GdApplication.class, args);
	}

	@Override//为了打包springboot项目
	protected SpringApplicationBuilder configure(
			SpringApplicationBuilder builder) {
		return builder.sources(this.getClass());
	}
}
```

# 开始打包

## jar

1. 按照顺序运行运行mvn clean再mvn install，这里使用IDEA侧边栏maven工具。

   ![](image-20200429140240276.png)

2. 最后成功后只需在项目下的target下找自己的包啦。

   ![](5548226-d91c19cfebeee328.png)

3. 用XFtp工具将jar包上传至服务器。

4. 使用Java命令`java -jar smallsystem-0.0.1-SNAPSHOT.jar`运行项目。

   ![](image-20200429141452819.png)

5. 然后去安全组去开放系统需要的端口号。

### 出现的问题

我们根据IP地址和端口向往常一样访问，发现报<font color=red>404</font>错误。仔细检查打的jar包里面没有包含JSP文件（SpringBoot对JSP打包一般会忽略，建议替换成模板引擎）。还需要在`<plugins>`的同级目录添加配置。

```xml
<resources>
	<resource>
		<directory>${basedir}/src/main/webapp</directory>
		<targetPath>METE-INF/resources</targetPath>
		<includes>
			<include>**/**</include>
		</includes>
	</resource>
	<resource>
		<directory>${basedir}/src/main/resources</directory>
		<includes>
			<include>**/**</include>
		</includes>
	</resource>
	<resource>
		<directory>${basedir}/src/main/java</directory>
			<includes>
				<include>**/*.xml</include>
			</includes>
		<filtering>false</filtering>
	</resource>
</resources>
```

这个配置是为了让打包的时候把webapp文件一起打包进去。

重新打包就OK了。

>如果出现404的问题,根本原因一定是访问控制层能够进入方法，也能打印日志，是页面没找到。
>这里我大概看了一下,大概的原因如下:
>
>1.在SpringBoot项目中,resource并不是根资源目录
>
>2.就是跳转的地址有问题 也就是说controller中的跳转地址不对!
>注意注解的是否正确使用。这就是SpringBoot使用JSP的弊端。

## war

### pom文件

1. 加入配置

   ![](image-20200429143531052.png)

   加个`<packaging>war</packaging>`,就OK啦！就这么点区别。

2. war包的打包操作和jar包是一样的参考上边咯。

3. 后面的流程操作一致，启动命令一致。

   ![](image-20200429141452819.png)

4. 启动成功。浏览器访问

   ![](image-20200429144326150.png)

   后台打印日志

   ![](image-20200429144422158.png)

# 完成

这样SpringBoot项目就部署成功了。

# 另述

在进行系统操作的时候看Xshell一直有日志打印，这里让他后台运行，日志打印在文件中。

1. 使用命令`touch start.sh`，创建文件。

2. 使用命令`vim start.sh`，编辑文件。

3. ```shell
   nohup java -Dfile.encoding=UTF-8 -jar patentmanager-web-1.0.0-SNAPSHOT.jar --server.port=8888 &   #server.port为自己项目的端口号
   ```

4. 保存并退出，修改文件权限`chmod 777 start.sh`。

5. 运行`./start.sh`,会生成一个日志文件`nohup.out`。

6. 可以使用cat，tail，less等命令查看日志文件。

7. 如果想要中止系统运行就要根据端口号去杀掉进程了。

   ![](image-20200429150213092.png)

好啦，这篇结束啦