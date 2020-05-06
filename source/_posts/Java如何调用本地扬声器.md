---
title: java如何调用本地扬声器
copyright: true
date: 2020-04-20 16:05:08
tags: Java
categories: Java
description: Java如何调用本地扬声器进行发声
---

## 前言

博主的毕设系统在做一个餐厅的点餐管理系统，在记性移动端页面开发的时候突发奇想做一个呼叫服务员，扬声器发声的一个功能类似于：“<font color=red>**工作人员请注意，桌号8001顾客正在寻求帮助！**</font>”。

## 实现方式

接下来就对这个小功能进行分析和实现。先写一个Demo。

1. 首先，我们需要一个dll作为辅助。这里解释一下dll的含义（*DLL(Dynamic Link Library)文件为[动态链接库文件](https://www.baidu.com/s?wd=%E5%8A%A8%E6%80%81%E9%93%BE%E6%8E%A5%E5%BA%93%E6%96%87%E4%BB%B6&tn=SE_PcZhidaonwhc_ngpagmjz&rsv_dl=gh_pc_zhidao)，又称“应用百程序拓展”，是软件文件类型。在Windows中，许多应用程序并不是一个度完整的可执行文件，它们被分割成一些相知对独立的动态链接库，即DLL文件，放置于道系统中。当我们执行某一个程序时，相应的版DLL文件就会被调用。一个应用程序可使用权多个DLL文件，一个DLL文件也可能被不同的应用程序使用，这样的DLL文件被称为共享DLL文件*）。

   需要把`jacob-1.17-M2-x64.dll`复制到`C:\Windows\System32\`目录下。我们也能看到目录下有很多的`.dll`文件。

   这里的文件大家自己百度下，很好找的。

2. 使用maven项目导入坐标。

   ```xml
   <!-- https://mvnrepository.com/artifact/net.sf.jacob-project/jacob -->
   <dependency>
   	<groupId>net.sf.jacob-project</groupId>
   	<artifactId>jacob</artifactId>
   	<version>1.14.3</version>
   </dependency>
   ```

3. 测试类代码。

   ```java
   /**
    * 文字转语音测试 jdk bin文件中需要导入jacob-1.17-M2-x64.dll
    * 注意导包哈
    * @date: 2020年2月25日 上午10:05:21
    */
   public class Jacobtest {
   
   
       public static void main(String[] args) {
           textToSpeech("工作人员请注意，桌号8001顾客正在寻求帮助！！");
       }
   
       /**
        * 语音转文字并播放
        *
        * @param text
        */
       public static void textToSpeech(String text) {
           ActiveXComponent ax = null;
           try {
               ax = new ActiveXComponent("Sapi.SpVoice");
   
               // 运行时输出语音内容
               Dispatch spVoice = ax.getObject();
               // 音量 0-100
               ax.setProperty("Volume", new Variant(100));
               // 语音朗读速度 -10 到 +10
               ax.setProperty("Rate", new Variant(0));
               // 执行朗读
               Dispatch.call(spVoice, "Speak", new Variant(text));
   
              /* // 下面是构建文件流把生成语音文件
   
               ax = new ActiveXComponent("Sapi.SpFileStream");
               Dispatch spFileStream = ax.getObject();
   
               ax = new ActiveXComponent("Sapi.SpAudioFormat");
               Dispatch spAudioFormat = ax.getObject();
   
               // 设置音频流格式
               Dispatch.put(spAudioFormat, "Type", new Variant(22));
               // 设置文件输出流格式
               Dispatch.putRef(spFileStream, "Format", spAudioFormat);
               // 调用输出 文件流打开方法，创建一个.wav文件
               Dispatch.call(spFileStream, "Open", new Variant("./text.wav"), new Variant(3), new Variant(true));
               // 设置声音对象的音频输出流为输出文件对象
               Dispatch.putRef(spVoice, "AudioOutputStream", spFileStream);
               // 设置音量 0到100
               Dispatch.put(spVoice, "Volume", new Variant(100));
               // 设置朗读速度
               Dispatch.put(spVoice, "Rate", new Variant(-2));
               // 开始朗读
               Dispatch.call(spVoice, "Speak", new Variant(text));
   
               // 关闭输出文件
               Dispatch.call(spFileStream, "Close");
               Dispatch.putRef(spVoice, "AudioOutputStream", null);
   
               spAudioFormat.safeRelease();
               spFileStream.safeRelease();*/
               spVoice.safeRelease();
               ax.safeRelease();
   
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   }
   ```

4. 从测试类可以看出，这个方法既可以发声还能输出后缀为`.wav`的文件，这是一个标准的多媒体文件。上述代码注释很清晰，就不解释了，自己看哈。

5. 测试成功，现在集成到自己的项目中。

## 另述

这里说到了调用扬声器发声，不放还可以想一下如何调用麦克风收音。

```java
public class EngineeCore {
    String filePath = "E:\\voice\\voice_cache.wav";
    AudioFormat audioFormat;
    TargetDataLine targetDataLine;
    boolean flag = true;
    
	private void stopRecognize() {
        flag = false;
        targetDataLine.stop();
        targetDataLine.close();
    }
    private AudioFormat getAudioFormat() {
        float sampleRate = 16000;
        // 8000,11025,16000,22050,44100
        int sampleSizeInBits = 16;
        // 8,16
        int channels = 1;
        // 1,2
        boolean signed = true;
        // true,false
        boolean bigEndian = false;
        // true,false
        return new AudioFormat(sampleRate, sampleSizeInBits, channels, signed, bigEndian);
    }// end getAudioFormat


    private void startRecognize() {
        try {
            // 获得指定的音频格式
            audioFormat = getAudioFormat();
            DataLine.Info dataLineInfo = new DataLine.Info(TargetDataLine.class, audioFormat);
            targetDataLine = (TargetDataLine) AudioSystem.getLine(dataLineInfo);
            // Create a thread to capture the microphone
            // data into an audio file and start the
            // thread running. It will run until the
            // Stop button is clicked. This method
            // will return after starting the thread.
            flag = true;
            new CaptureThread().start();
        } catch (Exception e) {
            e.printStackTrace();
        } // end catch
    }// end captureAudio method

    class CaptureThread extends Thread {
        public void run() {
            AudioFileFormat.Type fileType = null;
            File audioFile = new File(filePath);

            fileType = AudioFileFormat.Type.WAVE;
            //声音录入的权值
            int weight = 2;
            //判断是否停止的计数
            int downSum = 0;

            ByteArrayInputStream bais = null;
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            AudioInputStream ais = null;
            try {
                targetDataLine.open(audioFormat);
                targetDataLine.start();
                byte[] fragment = new byte[1024];

                ais = new AudioInputStream(targetDataLine);
                while (flag) {

                    targetDataLine.read(fragment, 0, fragment.length);
                    //当数组末位大于weight时开始存储字节（有声音传入），一旦开始不再需要判断末位
                    if (Math.abs(fragment[fragment.length-1]) > weight || baos.size() > 0) {
                        baos.write(fragment);
                        System.out.println("守卫："+fragment[0]+",末尾："+fragment[fragment.length-1]+",lenght"+fragment.length);
                        //判断语音是否停止
                        if(Math.abs(fragment[fragment.length-1])<=weight){
                            downSum++;
                        }else{
                            System.out.println("重置奇数");
                            downSum=0;
                        }
　　　　　　　　　　　　　　　//计数超过20说明此段时间没有声音传入(值也可更改)
                        if(downSum>20){
                            System.out.println("停止录入");
                            break;
                        }

                    }
                }

                //取得录音输入流
                audioFormat = getAudioFormat();
                byte audioData[] = baos.toByteArray();
                bais = new ByteArrayInputStream(audioData);
                ais = new AudioInputStream(bais, audioFormat, audioData.length / audioFormat.getFrameSize());
                //定义最终保存的文件名
                System.out.println("开始生成语音文件");
                AudioSystem.write(ais, AudioFileFormat.Type.WAVE, audioFile);
                downSum = 0;
                stopRecognize();

            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                //关闭流

                try {
                    ais.close();
                    bais.close();
                    baos.reset();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }// end run
    }// end inner class CaptureThread
```

这个测试没测试，偷个懒找的“哈哈”。

还有一点是Java操作语音文件`.wav`先不要研究了 :laugh and cry:，这里涉及到了语音识别，但是有百度那么些api，有兴趣的试试吧！

好了，在这里就结束了

# 更新

博主把自己的毕设项目打包放到自己的服务器上，这个扬声器出现了新的问题。

>本来所有的基础都是在本地运行的，通过调用本地dll文件实现扬声器发声，现在部署到centOS上将会失去这个dll的支持，目前所存在的问题是如何不使用dll文件实现这个功能，中间借助了`.wav`后缀的音视频文件。
>
>- 如何在Linux上生成`.wav`的文件。
>- 如何获取这个文件并输出。(解释一下，用餐顾客点击手机网页的菜单，然后再餐厅的主机来播放这个声音)
>- 如何在输出主机不进行任何操作就能播放这个声音或者能够恢复之前的工作状态。

<font color=red>现在的临时解决办法是本地跑一个呼叫服务的接口，当需要这个功能的时候远程服务器调用本地跑的接口，进而实现餐厅主机发声。</font>

<font color=red>这个和上面描述的并无差别，不一样的是存在了两台主机的调用（当然两台主机都应该链接网络，能够互相通信）</font>

先写到这了，当有解决办法的时候再更新吧！