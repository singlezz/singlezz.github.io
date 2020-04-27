---
title: jQuery表单校验
copyright: true
date: 2020-04-27 17:24:07
tags: jQuery
categories: jQuery
description: 本贴总结一个表单表单校验方法
---

# 前言

博主最近在做毕业设计，遇到添加时候表单校验的功能，原本数据库设计的时候除了主键外，其余字段都是可以为空的，但是本着数据信息的完整性，在对页面上添加的数据表单进行校验。

这里来说一点，如果使用前端框架比如说Bootstrap等，做表单校验可能会简单，但是这次使用的前端界面使用纯JSP写的。

# 正文

那么如何引入jQuery和校验表单数据呢？这里博主自己写了一个认为简单且通用的一个js方法。

首先选择jquery.js文件引入。

```jsp
<script type="text/javascript" src="/js/jquery-3.3.1.js"></script>
```

这里举个例子。

## HTML代码

```html
<form class="loginForm" method="post" onsubmit="return false;">
	<div class="inputbox">
		<label for="user">用户名：</label>
        <input id="user" type="text" name="name" placeholder="请输入用户名" required />
	</div>
	<div class="inputbox">
		<label for="mima">密码：</label>
        <input id="mima" type="password" name="pwd" placeholder="请输入密码" />
	</div>
	<div class="subBtn">
		<input type="submit" id="form_submit" value="登录" />
		<input type="reset" value="重置" />
	</div>
</form>
```

## jQuery代码

```javascript
$("#form_submit").click(function () {
	var isFull = true;
	var serialize = $("#loginForm").serializeArray();
	$.each(serialize, function(i, field){
		if (field.value=="") {
			isFull = false;
		}
    });
    if (!isFull){
        alert("请确保表单的完整性");
    } else {
        //这里就是异步向后台发送数据了
    }
})
```

这里解释一下`$("#formAboutAdd").serializeArray()`能够获取到表单中的所有表单标签`<input/>`，然后进行循环取参`field.name`、取值`field.value`。我这里直接提示让填写完整，大家也可以进行修改，类似于：

```javascript
$.each(serialize, function(i, field){
		if (field.value=="") {
			isFull = false;
            alert(field.name+"不能为空");  //这里提示的就是具体的那个地段为为空啦
		}
    });
```

# 结尾

好啦,这个相信解释的很清楚啦，一般情况都是可以适用的，还可以和Bootstrap非模块组合使用。

最后再看一下Bootstrap的表单校验。

## Bootstrap代码

```javascript
    $(function () {
        $('form').bootstrapValidator({

　　　　　　　　message: 'This value is not valid',
            　feedbackIcons: {
                　　　　　　　　valid: 'glyphicon glyphicon-ok',
                　　　　　　　　invalid: 'glyphicon glyphicon-remove',
                　　　　　　　　validating: 'glyphicon glyphicon-refresh'
            　　　　　　　　   },
            fields: {
                username: {
                    message: '用户名验证失败',
                    validators: {
                        notEmpty: {
                            message: '用户名不能为空'
                        }
                    }
                },
                email: {
                    validators: {
                        notEmpty: {
                            message: '邮箱地址不能为空'
                        }
                    }
                }
            }
        });
    });

```

