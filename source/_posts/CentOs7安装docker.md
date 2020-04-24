---
title: CentOS 7安装Docker
date: 2020-04-24 10:03:16
tags: Linux_ContOS
categories: Linux
description: 如何在CentOS下安装Docker
---

用到的工具

- XShell
- CentOS 7

# Docker

Docker 是一个开源的应用容器引擎，基于 [Go 语言](https://www.runoob.com/go/go-tutorial.html) 并遵从 Apache2.0 协议开源。

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。

## Docker支持以下的64位CentOS版本：

- CentOS7
- CentOS8
- 更高版本...

# Docker的应用场景

- Web 应用的自动化打包和发布。
- 自动化测试和持续集成、发布。
- 在服务型环境中部署和调整数据库或其他的后台应用。
- 从头编译或者扩展现有的 OpenShift 或 Cloud Foundry 平台来搭建自己的 PaaS 环境。

# 开始安装

## 安装 Docker Engine-Community

### 使用 Docker 仓库进行安装

在新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。之后，您可以从仓库安装和更新 Docker。

**设置仓库**

安装所需的软件包。yum-utils 提供了 yum-config-manager ，并且 device mapper 存储驱动程序需要 device-mapper-persistent-data 和 lvm2。

```shell
sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2
```

使用以下命令来设置稳定的仓库。

```shell
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

### 安装 Docker Engine-Community

安装最新版本的 Docker Engine-Community 和 containerd，或者转到下一步安装特定版本：

```shell
sudo yum install docker-ce docker-ce-cli containerd.io
```

如果提示您接受 GPG 密钥，请选是。

Docker 安装完默认未启动。并且已经创建好 docker 用户组，但该用户组下没有用户。

*注：如果需要安装指定版本则需要执行`yum list docker-ce --showduplicates | sort -r`列出版本，默认版本号（从高到低）对结果进行排序。*

*然后执行`sudo yum install docker-ce-<版本号> docker-ce-cli-<版本号> containerd.io`，例如：`docker-ce-18.09.1`。*

### 启动 Docker服务。

```
systemctl start docker.service
```

# Docker常用命令

## Docker容器信息

```shell
##查看docker容器版本
docker version
##查看docker容器信息
docker info
##查看docker容器帮助
docker --help
```

## 镜像操作

### 镜像查看

<font color=red>提示：对于镜像的操作可使用镜像名、镜像长ID和短ID。</font>

```shell
##列出本地images
docker images
```

### 镜像搜索

```shell
##搜索仓库MySQL镜像
docker search mysql
## --filter=stars=600：只显示 starts>=600 的镜像
docker search --filter=stars=600 mysql
## --no-trunc 显示镜像完整 DESCRIPTION 描述
docker search --no-trunc mysql
## --automated ：只列出 AUTOMATED=OK 的镜像
docker search  --automated mysql
```

### 镜像下载

```shell
##下载Redis官方最新镜像，相当于：docker pull redis:latest
docker pull mysql
##下载仓库所有Redis镜像
docker pull -a mysql
```

### 镜像删除

```shell
##单个镜像删除，相当于：docker rmi mysql:latest
docker rmi mysql
##强制删除(针对基于镜像有运行的容器进程)
docker rmi -f mysql
##多个镜像删除，不同镜像间以空格间隔
docker rmi -f mysql tomcat nginx
##删除本地全部镜像
docker rmi -f $(docker images -q)
```

## 容器操作

```shell
##新建并启动容器，参数：-i  以交互模式运行容器；-t  为容器重新分配一个伪输入终端；--name  为容器指定一个名称
docker run -itd --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql
##后台启动容器，参数：-d  已守护方式启动容器
docker run -d mycentos
```

- **-p 3306:3306** ：映射容器服务的 3306 端口到宿主机的 3306 端口，外部主机可以直接通过 **宿主机ip:3306** 访问到 MySQL 的服务。
- **MYSQL_ROOT_PASSWORD=root**：设置 MySQL 服务 root 用户的密码。

```shell
##启动一个或多个已经被停止的容器
docker start redis
##重启容器
docker restart redis
```

### 进入容器和退出

```shell
##使用run方式在创建时进入
docker run -it mysql /bin/bash
##进入运行的容器内部
docker exec -it mysql bash
##关闭容器并退出
exit
```

### 查看容器

```shell
##查看正在运行的容器
docker ps
##查看正在运行的容器的ID
docker ps -q
##查看正在运行+历史运行过的容器
docker ps -a
##显示运行容器总文件大小
docker ps -s
```

# 另述

博主在这里记录了在CentOS下如何安装Docker,还记录了一般常用的Docker命令，在命令中顺带解释了如何去安装MySQL镜像等操作。其他的镜像安装也是大同小异，不同的大多就是端口号映射罢了。好了，这篇就截稿啦。