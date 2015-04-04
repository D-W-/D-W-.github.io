---
layout: post
title: Linux文件系统基础
comments: true
categories: [Linux]
---

## 鸟哥的Linux私房菜学习笔记(0)

> 这篇读书笔记本来计划用sublime写的
> > 无奈sublime对中文支持的太不好了,linux下居然不能中文输入,网上查了一下配置太麻烦,为了不浪费时间,只好下次再配吧

----
****
文件格式化:确定文件在硬盘中存储的格式,比如

 Ext2文件

   super block

   记录整体信息,inode,block的总量 使用量

   inode

   一个文件对应一个inode,里面同时记录用于了存储文件内容的block号码

   block

   用于存储文件的内容,一个文件可能对应多个block

>和FAT文件格式的对比
>FAT文件block的存储是串成一条链的,像链表一样,要找的文件的具体内容必须遍历这个链,存储分散的话复杂度比较高
>Ext2文件的block编号都存在inode里面了,像数组一样,只要有inode的地址就可以轻松找到所有的文件内容

## inode容量有限,如何存储较多的block编号##
分层,12个直接指向,1个间接指向(指向一个block,该block里面存的是其他block的编号),1个双间接指向,1个三间接指向

## Ext2用于目录##
inode记录文件夹(目录)的权限属性,以及文件夹(目录)对应的block编号
block记录*该目录下文件名和该文件名占用的inode号码数据*
	类似于这样,`map<string,string>`,前一个string是文件名,后一个是对应的_inode_编号


>可以解释文件夹(目录)的读权限
>有了目录的读权限可以看到他block里面的东西,也就可以看到他里面的文件名,但是只限于文件名
>如果进入文件夹的话还需要执行权限


