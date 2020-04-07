---
title: SQL基础语句大全
date: 2020-04-07 16:23:34
tags: MySQL
categories: MySQL
description: SQL基础语句大全，所有的SQL都在这里
---

## <font color=red>一、基础</font>

#### **说明：创建数据库**

`CREATE DATABASE database-name`

#### **说明：删除数据库**

`drop database dbname`

#### **如何修改数据库的名称**

`sp_renamedb 'old_name', 'new_name'`

#### **说明：创建新表**

`create table tabname(col1 type1 [not null][primary key],col2 type2 [not null],..)`

根据已有的表创建新表：

##### A：`create table tab_new like tab_old` *(使用旧表创建新表)*

##### B：`create table tab_new as select col1,col2… from tab_old definition only`

#### **说明：删除新表**

`drop table tabname`

#### **说明：增加一个列**

`Alter table tabname add column col type`

*注：列增加后将不能删除。DB2中列加上后数据类型也不能改变，唯一能改变的是增加varchar类型的长度。*

#### **说明：添加主键**

`Alter table tabname add primary key(col)`

说明：删除主键

 `Alter table tabname drop primary key(col)`

#### **说明：创建索引**

`create [unique] index idxname on tabname(col….)`

**删除索引**：`drop index idxname`

*注：索引是不可更改的，想更改必须删除重新建。*

#### **说明：创建视图**

`create view viewname as select statement` 

**删除视图**：`drop view viewname`

#### **说明：几个简单的基本的SQL语句选择**

`select * from table1 where 范围`

- 插入：`insert into table1(field1,field2) values(value1,value2)`

- 删除：`delete from table1 where 范围`

- 更新：`update table1 set field1=value1 where 范围`

- 查找：`select * from table1 where field1 like ’%value1%’` *---like的语法很精妙，查资料!*

- 排序：`select * from table1 order by field1,field2 [desc]`

- 总数：`select count as totalcount from table1`

- 求和：`select sum(field1) as sumvalue from table1`

- 平均：`select avg(field1) as avgvalue from table1`

- 最大：`select max(field1) as maxvalue from table1`

- 最小：`select min(field1) as minvalue from table1`

#### **说明：几个高级查询运算词A： UNION 运算符** 

UNION 运算符通过组合其他两个结果表（例如 TABLE1 和 TABLE2）并消去表中任何重复行而派生出一个结果表。当 ALL 随 UNION 一起使用时（即 UNION ALL），不消除重复行。两种情况下，派生表的每一行不是来自 TABLE1 就是来自 TABLE2。 

##### **B：EXCEPT 运算符 EXCEPT**

运算符通过包括所有在 TABLE1 中但不在 TABLE2 中的行并消除所有重复行而派生出一个结果表。当 ALL 随 EXCEPT 一起使用时 (EXCEPT ALL)，不消除重复行。

##### **C：INTERSECT 运算符INTERSECT**

运算符通过只包括 TABLE1 和 TABLE2 中都有的行并消除所有重复行而派生出一个结果表。当 **ALL**随 INTERSECT 一起使用时 (INTERSECT ALL)，不消除重复行。 

*注：使用运算词的几个查询结果行必须是一致的。*

#### **说明：使用外连接**

##### **A、left（outer）join：**

左外连接（左连接）：结果集几包括连接表的匹配行，也包括左连接表的所有行。 
SQL: select a.a, a.b, a.c, b.c, b.d, b.f from a LEFT OUT JOIN b ON a.a = b.c

##### **B：right（outer）join:** 

右外连接(右连接)：结果集既包括连接表的匹配连接行，也包括右连接表的所有行。 

##### **C：full/cross（outer）join**： 

全外连接：不仅包括符号连接表的匹配行，还包括两个连接表中的所有记录。

#### **分组**

`Group by`：一张表，一旦分组 完成后，查询后只能得到组相关的信息。
组相关的信息：（统计信息） count,sum,max,min,avg  分组的标准)   在分组时：不能以text,image等类型的字段作为分组依据   在select统计函数中的字段，不能和普通的字段放在一起。

#### **对数据库进行操作**

分离数据库：`sp_detach_db`

附加数据库：`sp_attach_db`*后接表明，附加需要完整的路径名*