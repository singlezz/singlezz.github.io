---
title: Java实现浏览器下载功能
copyright: true
date: 2020-04-10 09:57:33
tags: Java
categories: IO流
description: Java项目中控制层实现浏览器下载功能
---

### 前言：

最近有给分配一个任务，实现一个下载功能，前提是当在指定的目录下去查找固定名字的文件，如果存在则直接读取文件流在返回给浏览器，如果没有才去执行数据库去查，然后备份并输出到浏览器进行下载.

就这其中一个简单的功能，下面对这个部分进行实现。

### JSP页面：

#### JSP代码:

```jsp
<c:if test="${page.list != null && fn:length(page.list) > 0}">
	<c:forEach var="run" items="${page.list}" varStatus="st">
		<tr>
			<td style="text-align: center">${run.between}</td>
			<td style="text-align: center">${run.typeNo}</td>
			<td style="text-align: center">${run.status}</td>
			<td style="text-align: center">${run.recall}</td>
			<td style="text-align: center">${run.precision}</td>
			<td style="text-align: center">${run.kind}</td>
			<td class="td-manage" style="text-align: center">
				<a title="下载" href="/CategoryTestRunData/downLoad?id=${run.id}">
					<i class="layui-icon layui-icon-download-circle"></i>
				</a>
            </td>
		</tr>
	</c:forEach>
</c:if>
```

#### *说明：*<font color=red>在测试的时候发现下载这里如果写Ajax异步请求下载话这个是无法请求的，所以这里写直链。</font>

### 控制器：

#### 控制层代码：

```java
	/**
     * Excel表下载导出
     * @return
     */
    @ResponseBody
    @RequestMapping("/downLoad")
    public void downLoad(String id, HttpServletResponse response, HttpServletRequest request) throws IOException {
        log.info("Excel表下载导出，传入参数："+id);
        //目标路径
        String dist = "/data/download/";
        //String dist = "F:/operate/download/";
        File fileList = new File(dist);
        if (!fileList.exists()){
            fileList.mkdirs();
        }
        //判断是否存在ID为名的文件
        String[] list = fileList.list();
        boolean isExist = true;  //默认该文件存在标志
        for (String name_id : list) {
            String sub_name = StringUtils.substring(name_id,0,name_id.lastIndexOf("."));
            if (StringUtils.equals(sub_name,id)){
                //存在预下载文件
                //获取输入流输出到浏览器
                FileInputStream fileInputStream = new FileInputStream(dist+name_id);
                OutputStream outputStream = response.getOutputStream();
                //设置Http响应头告诉浏览器下载这个附件,下载的文件名也是在这里设置的
                //获得浏览器代理信息
                final String userAgent = request.getHeader("USER-AGENT");
                //判断浏览器代理并分别设置响应给浏览器的编码格式
                String finalFileName = null;
                if(StringUtils.contains(userAgent, "MSIE")||StringUtils.contains(userAgent,"Trident")){//IE浏览器
                    finalFileName = URLEncoder.encode(name_id,"UTF8");
                    System.out.println("IE浏览器");
                }else if(StringUtils.contains(userAgent, "Mozilla")){//google,火狐浏览器
                    finalFileName = new String(name_id.getBytes(), "ISO8859-1");
                }else{
                    finalFileName = URLEncoder.encode(name_id,"UTF8");//其他浏览器
                }
                //设置HTTP响应头
                response.reset();//重置 响应头
                response.setContentType("application/x-download");//告知浏览器下载文件，而不是直接打开，浏览器默认为打开
                response.addHeader("Content-Disposition" ,"attachment;filename=" +finalFileName+ "");//下载文件的名称
                byte[] bytes = new byte[2048];
                int len = 0;
                while ((len = fileInputStream.read(bytes))>0){
                    outputStream.write(bytes,0,len);
                }
                fileInputStream.close();
                outputStream.close();
                return ;
            }
        }
        isExist = false;
        if (!isExist){
            try{
                //输出写入到服务器备份
                ExcelWriter writer = ExcelUtil.getWriter(dist+id+".xlsx");

                List<RecordDown> recordList = categoryTestRunDataService.getDownLoadList(Long.parseLong(id));
                log.info("返回数据："+JSON.toJSONString(recordList));
                if (recordList.size() == 0){
                }
                writer.addHeaderAlias("mercNum","商户编号");
                writer.addHeaderAlias("triggerTime","风险类别触发时间");
                writer.addHeaderAlias("isRisk","是否风险商户");
                writer.addHeaderAlias("kind","对应风险种类");
                writer.addHeaderAlias("createHisTime","商户入网时间");
                writer.addHeaderAlias("region","商户所属地区");
                for (int i = 0; i < 6; i++) {
                    writer.setColumnWidth(i,35);
                }
                // 一次性写出内容，使用默认样式，强制输出标题
                writer.write(recordList, true);
                // 关闭writer，释放内存
                writer.close();

                //写入到浏览器
                ExcelWriter writerToBrowser = ExcelUtil.getWriter(true);
                writerToBrowser.write(recordList, true);
                OutputStream outputStream = response.getOutputStream();


                //获得浏览器代理信息
                final String userAgent = request.getHeader("USER-AGENT");
                //判断浏览器代理并分别设置响应给浏览器的编码格式
                String finalFileName = null;
                if(StringUtils.contains(userAgent, "MSIE")||StringUtils.contains(userAgent,"Trident")){//IE浏览器
                    finalFileName = URLEncoder.encode(id+".xlsx","UTF8");
                    System.out.println("IE浏览器");
                }else if(StringUtils.contains(userAgent, "Mozilla")){//google,火狐浏览器
                    String fileName= id+".xlsx";
                    finalFileName = new String(fileName.getBytes(), "ISO8859-1");
                }else{
                    finalFileName = URLEncoder.encode(id+".xlsx","UTF8");//其他浏览器
                }
                //设置HTTP响应头
                response.reset();//重置 响应头
                response.setContentType("application/x-download");//告知浏览器下载文件，而不是直接打开，浏览器默认为打开
                response.addHeader("Content-Disposition" ,"attachment;filename=" +finalFileName+ "");//下载文件的名称
                writerToBrowser.flush(outputStream, true);
                writerToBrowser.close();
                IoUtil.close(outputStream);
            }catch (Exception e){
                e.printStackTrace();
                log.info("错误信息:"+e);
            }
        }

    }
```

#### *说明：*<font color=green>项目实现逻辑</font>

1. 先去指定路径查找，是否有指定目录，是否有以ID为名的文件。

   ```java
   //目标路径
           String dist = "/data/download/";
           //String dist = "F:/operate/download/";
           File fileList = new File(dist);
           if (!fileList.exists()){
               fileList.mkdirs();
           }
           //判断是否存在ID为名的文件
           String[] list = fileList.list();
           boolean isExist = true;  //默认该文件存在标志
           for (String name_id : list) {
               String sub_name = StringUtils.substring(name_id,0,name_id.lastIndexOf("."));
               //这里对循环拿到的文件名和目标文件名匹配
               if (StringUtils.equals(sub_name,id)){
                   //这里对匹配到的文件读取并输出到浏览器
               }
           }
   ```

2. 如果存在以ID为名的文件。

   ```java
   				//存在预下载文件
                   //获取输入流输出到浏览器
                   FileInputStream fileInputStream = new FileInputStream(dist+name_id);
                   OutputStream outputStream = response.getOutputStream();
                   //设置Http响应头告诉浏览器下载这个附件,下载的文件名也是在这里设置的
                   //获得浏览器代理信息
                   final String userAgent = request.getHeader("USER-AGENT");
                   //判断浏览器代理并分别设置响应给浏览器的编码格式,部分浏览器编码格式不同，这里的操作防止下载是防止文件名乱码
                   String finalFileName = null;
                   if(StringUtils.contains(userAgent, "MSIE")||StringUtils.contains(userAgent,"Trident")){//IE浏览器
                       finalFileName = URLEncoder.encode(name_id,"UTF8");
                       System.out.println("IE浏览器");
                   }else if(StringUtils.contains(userAgent, "Mozilla")){//google,火狐浏览器
                       finalFileName = new String(name_id.getBytes(), "ISO8859-1");
                   }else{
                       finalFileName = URLEncoder.encode(name_id,"UTF8");//其他浏览器
                   }
                   //设置HTTP响应头
                   response.reset();//重置 响应头
                   response.setContentType("application/x-download");//告知浏览器下载文件，而不是直接打开，浏览器默认为打开
                   response.addHeader("Content-Disposition" ,"attachment;filename=" +finalFileName);//下载文件的名称
                   byte[] bytes = new byte[2048];
                   int len = 0;
                   while ((len = fileInputStream.read(bytes))>0){
                       //写入到输出流
                       outputStream.write(bytes,0,len);
                   }
                   fileInputStream.close();
                   outputStream.close();
                   return ;
   ```

3. 当指定文件目录没有目标文件名时去查询相关数据，进行指定路径备份。

   ```java
   //输出写入到服务器备份
   ExcelWriter writer = ExcelUtil.getWriter(dist+id+".xlsx");
   //数据库查询结果
   List<RecordDown> recordList = categoryTestRunDataService.getDownLoadList(Long.parseLong(id));
   log.info("返回数据："+JSON.toJSONString(recordList));
   if (recordList.size() == 0){
       //id下没有数据集合
   }
   //第一个参数是实体类属性，第二个参数是Excel对应的属性注释
   writer.addHeaderAlias("me**Num","商**号");
   writer.addHeaderAlias("tr**rTime","风险****时间");
   writer.addHeaderAlias("is**sk","是否**商户");
   writer.addHeaderAlias("k**d","对应**种类");
   writer.addHeaderAlias("cre****sTime","商户**时间");
   writer.addHeaderAlias("re**on","商户**地区");
   //设置列的宽度
   for (int i = 0; i < 6; i++) {
   	writer.setColumnWidth(i,35);
   }
   // 一次性写出内容，使用默认样式，强制输出标题
   writer.write(recordList, true);
   // 关闭writer，释放内存
   writer.close();
   ```

4. 备份完成后再将输出到浏览器，具体代码和上方（2.如果存在以ID为名的文件。）的逻辑相同。这里不再赘述。

5. 下载结果。

   | 商**号 | 风险\****时间 | 是否**商户 | 对应**种类 | 商户**时间 | 商户**地区 |
   | ——: | ————————-: | ————: | ————: | ————————-: | ————: |
   | 123 | 2020-04-10 11:31:32 | 是 | ** | 2020-04-10 11:31:32 | 商户 |

#### *补充：*一般情况下，我们在进行下载功能的时候需要告诉浏览器他的类型。

`response.setContentType("application/x-download")`

是文件而不是页面，设置浏览器自带下载功能添加文件名。

`response.addHeader("Content-Disposition" ,"attachment;filename=" +finalFileName+ "")`

### 实现方式：

实现浏览器下载可以有两种方式：

##### 方法一：

```xml
<action name="toauctionExcelAction"class="theauctionaction"method="Excel Theauctioninfo">
	<result name="success"type="stream">
		<param name="contentType">application/vnd.ms-excel；charset=UTF-8</param>
		<param name="contentoisposition">attachment；filename="${auctionName}"</param>
		<param name="inputName">excelTheauctioninfo</param>
	</result>
</action>
```

​	从这个配置可以看出来这个是Struts2里面的写法，Struts2每一个方法都会有一个action作为配置信息，这样子使得配置文件更为方法和繁琐。

##### 方法二：

```java
//设置HTTP响应头
response.reset();//重置 响应头
response.setContentType("application/x-download");//告知浏览器下载文件，而不是直接打开，浏览器默认为打开
response.addHeader("Content-Disposition" ,"attachment;filename=" +finalFileName);//下载文件的名称
```

​	直接在控制层中传入参数`HttpServletResponse response`利用`response`设置头信息和文件类型下载，这样做的好处是只对这一个方法有效，不会对其他请求造成影响。