---
title: SpringBoot整合
date: 2020-04-07 10:03:12
tags: Java
categories: springboot
description: 整合SringBoot常用的功能
---

> **来自：SimpleWu**
>
> **链接：https://www.cnblogs.com/SimpleWu/p/9798146.html**

# SpringBoot简介

Spring Boot是由Pivotal团队提供的全新框架，其设计目的是用来简化新Spring应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。通过这种方式，Boot致力于在蓬勃发展的快速应用开发领域（rapid application development）成为领导者。

Spring Boot让我们的Spring应用变的更轻量化。比如：你可以仅仅依靠一个Java类来运行一个Spring引用。你也可以打包你的应用为jar并通过使用java -jar来运行你的Spring Web应用。

Spring Boot的主要优点：

- 为所有Spring开发者更快的入门
- 开箱即用，提供各种默认配置来简化项目配置
- 内嵌式容器简化Web项目
- 没有冗余代码生成和XML配置的要求

在下面的代码中只要有一定基础会发现这写代码实例非常简单对于开发者来说几乎是“零配置”。

# SpringBoot运行

开发工具：jdk8，IDEA,STS，eclipse（需要安装STS插件）这些都支持快速启动SpringBoot工程。我这里就不快速启动了，使用maven工程。学习任何一项技术首先就要精通HelloWord，那我们来跑个初体验。

首先只用maven我们创建的maven工程直接以jar包的形式创建就行了，首先我们来引入SpringBoot的依赖

首先我们需要依赖SpringBoot父工程，这是每个项目中必须要有的。

```java
<!--引入SpringBoot父依赖-->
<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.0.5.RELEASE</version>
        <relativePath/> 
</parent>
<!--编码与JAVA版本-->
<properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>1.8</java.version>
</properties>
```

我们启动WEB模块当然必须要引入WEB模块的依赖

```java
<dependencies>
        <!--引入SpringBoot-WEB模块-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
```

我们需要编写一个SpringBoot启动类，SpringbootFirstExperienceApplication.java

```java
@SpringBootApplication
public class SpringbootFirstExperienceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootFirstExperienceApplication.class, args);
    }
}
```

到了这里我们直接把他当成SpringMVC来使用就行了，不过这里默认是不支持JSP官方推荐使用模板引擎，后面会写到整合JSP。这里我就不写Controller了。

@SpringBootApplication：之前用户使用的是3个注解注解他们的main类。分别是@Configuration,@EnableAutoConfiguration,@ComponentScan。由于这些注解一般都是一起使用，spring boot提供了一个统一的注解@SpringBootApplication。

> 注意事项：我们使用这个注解在不指定扫描路径的情况下，SpringBoot只能扫描到和SpringbootFirstExperienceApplication同包或子包的Bean

# SpringBoot目录结构

在src/main/resources中我们可以有几个文件夹：

- **templates：**用来存储模板引擎的，Thymeleaf，FreeMarker，Velocity等都是不错的选择。
- **static：**存储一些静态资源，css,js等
- **public：**在默认SpringBoot工程中是不生成这个文件夹的，但是在自动配置中我们可以有这个文件夹用来存放公共的资源（html等）
- **application.properties：**这个文件名字是固定的，SpringBoot启动会默认加载这些配置在这里面可以配置端口号，访问路径，数据库连接信息等等。这个文件非常重要，当然官方中推出了一个yml格式这是非常强大的数据格式。

# SpringBoot整合

## 整合JdbcTemplate

```java
	<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.2.RELEASE</version>
    </parent>
    <dependencies>
        <!--引入WEB模块-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
         <!--引入JDBC模块-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
         <!--引入数据库驱动-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
```

配置application.properties，虽然说是“零配置”但是这些必要的肯定要指定，否则它怎么知道连那个数据库？

```
spring.datasource.url=jdbc:mysql://localhost:3306/你的表名
spring.datasource.username=用户名
spring.datasource.password=密码
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

使用方式：

```java
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @RequestMapping("/save")
    public String insert(String name,String email,String gender){
        boolean result = employeeService.saveEmp(name, email, gender);
        if(result){
            return "success";
        }
        return "error";
    }
}
```

```java
@Service
public class EmployeeService {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean saveEmp(String name,String email,String gender){
        String sql = "insert into tal_employee values(null,?,?,?)";
        int result = jdbcTemplate.update(sql, name,email,gender);
        System.out.println("result : " + result);
        return result > 0 ? true:false;
    }
}
```

这里我们直接返回一个文本格式。

### @RestController

在上面的代码中我们使用到这个注解修改我们的Controller类而是不使用@Controller这个注解，其实中包含了@Controller，同时包含@ResponseBody既然修饰在类上面那么就是表示这个类中所有的方法都是@ResponseBody所以在这里我们返回字符串在前台我们会以文本格式展示，如果是对象那么它会自动转换成json格式返回。

## 整合JSP

在创建整合JSP的时候指定要选WAR，一定要选WAR。

引入依赖：

```java
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.2.RELEASE</version>
</parent>
<dependencies>
    <!-- SpringBoot WEB组件 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- 整合JSP依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId>
    </dependency>
    <dependency>
        <groupId>org.apache.tomcat.embed</groupId>
        <artifactId>tomcat-embed-jasper</artifactId>
    </dependency>
</dependencies>
```

然后我们只需要配置试图解析器路径就可以了：

```java
#配置试图解析器前缀
spring.mvc.view.prefix=/WEB-INF/views/
#配置试图解析器后缀
spring.mvc.view.suffix=.jsp
```

## 整合JPA

同样的整合JPA我们只需要启动我们SpringBoot已经集成好的模块即可。

添加依赖：

```
	<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.2.RELEASE</version>
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--启动JPA组件-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
    </dependencies>
```

启动JPA组件后直接配置数据库连接信息就可以使用JPA功能。

Application.properties

```java
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
```

实体类：Employee.java

```java
@Table(name="tal_employee")
@Entity
public class Employee implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Column(name="last_Name")
    private String lastName;
    private String email;
    private String gender;
    //get set 省略
}
```

EmployeeDao接口：

```java
public interface EmployeeDao extends JpaRepository<Employee, Integer>{
}
```

EmployeeController.java:

```java
@Controller
public class EmployeeController {
    @Autowired
    private EmployeeDao employeeDao;

    @ResponseBody
    @RequestMapping("/emps")
    public List<Employee> getEmployees(){
        List<Employee> employees = employeeDao.findAll();
        System.out.println(employees);
        return employees;
    }
}
```

## 整合MyBatis

引入依赖：

```java
<parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.2.RELEASE</version>
    </parent>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!--引入对JDBC的支持-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
         <!--引入对logging的支持-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </dependency>
        <!-- SpringBoot MyBatis启动器 -->
        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>1.2.2</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
    </dependencies>
```

配置application.properties

```java
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
##############datasource classpath 数据连接池地址##############
#spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
```

### 方法一

使用xml作为持久层

```java
#指定我们的mapper.xml位置
mybatis.mapper-locations=classpath:com/simple/springboot/mybatis/dao/mapper/*.xml
#entity.class 指定我们实体类所在包位置
mybatis.type-aliases-package=com.simple.springboot.mybatis.entity
```

### 方法二

使用注解作为持久层,这里体现两种方式：一个为注解里面直接写SQL，一个为独立的SQL类

```java
@Mapper
@Repository
public interface CategoryTestRunDataMapper {


    @SelectProvider(type = CategoryTestRunDataSql.class,method = "getList")
    public List<CategoryTestRunData> getList(CategoryTestRunDataParam param);

    @Select("SELECT count(id) from 表名 ")
    public int getListCount();
}

```

```java
@Slf4j
public class CategoryTestRunDataSql {

    /**
     *获取类别试跑数据列表
     */
    public String getList(CategoryTestRunDataParam param){
        log.info("传入参数："+ JSON.toJSONString(param));
        StringBuilder sb = new StringBuilder("select `id`, `typeNo`, `kind`, `totalMercs`, `triggerMercs`, `status`, `createTime`, `endTime`, `remark` ");
        sb.append(" from `表名` ");
        sb.append(" where 1=1 ");
        sb.append(" order by createTime desc limit #{beginLine},#{pageSize} ");
        log.info("sql："+sb.toString());
        return sb.toString();
    }
}
```

# 任务调度

SpringBoot已经集成好一个调度功能。

```java
@Component
public class ScheduledTasks {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    /**
     * 任务调度，每隔5秒执行一次
     */

    @Scheduled(fixedRate = 1000)
    public void reportCurrentTime() {
        System.out.println("现在时间：" + dateFormat.format(new Date()));
    }
}
```

然后启动的时候我们必须要在主函数类上加上注解：@EnableScheduling（翻译过来就是开启调度）

```java
/**
 * SpringBoot使用任务调度
 * @EnableScheduling标注程序开启任务调度
 */

@SpringBootApplication
@EnableScheduling
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

## 整合邮件发送

导入依赖：

```XML
Copy<!--启动邮箱发送依赖-->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

配置Properties文件

```properties
Copy#根据类型配置
spring.mail.host=smtp.qq.com
spring.mail.port=465
spring.mail.username=450255266@qq.com
#对于qq邮箱而言 密码指的就是发送方的授权码
spring.mail.password=看不见我-0-
spring.mail.protocol=smtp
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.default-encoding=UTF-8
#是否用启用加密传送的协议验证项
#注意：在spring.mail.password处的值是需要在邮箱设置里面生成的授权码，这个不是真实的密码。
```

spring.mail.host 需要根据不同的邮箱类型配置不同的服务器地址
发送邮箱

```JAVA
/**
 * @author SimpleWu
 * @data 2019=05-17
 * 发送邮件
 */
@Component
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendSimpleMail(){
        MimeMessage message = null;
        try {
            message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("450255266@qq.com");
            helper.setTo("450255266@qq.com");
            helper.setSubject("标题：发送Html内容");

            StringBuffer context = new StringBuffer();
            context.append("<p style='color:red'>");
            context.append("Hello SpringBoot Email Start SimpleWu!!");
            context.append("</p>");
            helper.setText(context.toString(),true);//设置true发送html邮件

            //带附件
            //FileSystemResource fileSystemResource=new FileSystemResource(new File("D:\2019-05-07.pdf"));
            //helper.addAttachment("邮箱附件",fileSystemResource);
            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}
```

**注：最好使用异步接口发送邮件，并且发送邮件的服务器为单独部署。**