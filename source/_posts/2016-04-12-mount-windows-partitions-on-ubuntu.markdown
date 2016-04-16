---
layout: post
title: "Mount Windows partitions on Ubuntu"
date: 2016-04-12 21:42:03 +0800
comments: true
categories: [linux, file system]
---

这篇文章可谓来之不易, 因为太长时间没写了, 中间换了系统, 之前配好的环境都没了, 就费了很大力气又装了一边... 这里就不详细说明了

这里主要记录一下 ubuntu 下挂载 Windows 分区的问题

## mount
既然是挂载, 就先说一下这个命令, 一般来说, 格式是这样的

>mount _dir_

_dir_ 就是要挂载的分区所在的地方, 一般是类似 `/dev/sda1` 这样的地址

但是记住每个 windows 分区对应那个sda 后面的数字太麻烦了, [直接根据分区挂载][1]:

>mount -L  label_name_here  /path/to/mount/point


或者, 查一下 LABEL 和 NAME 的对应关系, 

[使用 list block][2]

```
$ sudo lsblk -o NAME,LABEL
NAME                    LABEL
sda                     
├─sda1                  System Reserved
├─sda2                  windows
├─sda3                  ubuntu
├─sda4                  
├─sda5                  arch
├─sda6                  
│ └─lvmg-homelvm (dm-0) homelb
└─sda7                  
sdb                     
└─sdb1                  
  └─lvmg-homelvm (dm-0) homelb
```
[使用 block id][3]

```
sudo blkid -o list


device          fs_type  label     mount point         UUID
----------------------------------------------------------------------------------
/dev/sda1       ntfs     WINRE_DRV (not mounted)       604C3A6A4C3A3B5C
/dev/sda2       vfat     SYSTEM_DRV (not mounted)      6C3C-72E3
/dev/sda3       vfat     LRS_ESP   (not mounted)       5240-1BEE
/dev/sda5       ntfs     Windows8_OS /media/Win8       A47A42FF7A42CDAC
/dev/sda6       ntfs     Daten     /media/Daten        72860971860936DF

```

##自动挂载

windows 的分区是不会在开机的时候自动被挂载的, 想自动挂载的话需要[修改系统文件][4] `/etc/fstab`

其中针对每个分区可以进行挂载的参数配置, 如下:

>UUID=AA8C58748C583CCF /media/harry/code ntfs umask=0033,gid=1000,uid=1000 0 1

UUID是磁盘的id, 后面是挂载地址, 分区格式, 参数, 等等..

这里说一下参数

###umask 

user mask

是打开文件之后文件**去掉**的读写权限

0 代表什么权限都不去掉, 也就是读写执行都有

1 代表去掉执行 2 代表去掉写 4 代表去掉读

它们互相组合就得到了总共需要去掉的权限

033 就代表了文件所有者有所有权限, 同组或者其他组的其他人只能读

那么, 从**哪里**减去呢?

是从默认权限里面减去, 文件的默认权限是 666, 文件夹的默认权限是 777

 - 创建文件时：(-rw-rw-rw-) - (-----w--w-) ==> -rw-r--r--
 - 创建目录时：(drwxrwxrwx) - (d----w--w-) ==> drwxr-xr-x

[source](http://vbird.dic.ksu.edu.tw/linux_basic/0220filemanager_4.php#umask)

---
比较 tricky 的一点, 挂载一个windows硬盘的时候, 默认是给所有文件所有权限的

如果只想把文件的 执行 权限去掉的话, 就不能使用 umask 来控制permission了(那样会把文件夹的执行权限也去掉..从而访问不了任何文件)

这里就要引进 fmask 和 dmask 了

###fmask dmask

很简单 file mask , 和 directory mask, 分别控制文件和文件夹需要去掉的权限

###gid uid

挂载这个分区中所有的文件的所有者, 组
1000表示默认用户

另外也可以手动给mount[加参数挂载][5]

     mount -t deviceFileFormat -o umask=filePermissons,gid=ownerGroupID,uid=ownerID /device /mountpoint

---

所以,最后的配置变成了这样

>\# mount windows partition code volumn
>UUID=AA8C58748C583CCF /media/harry/code ntfs uid=1000,gid=1000,dmask=022,fmask=133 0 1

  


  [1]: http://www.cyberciti.biz/faq/rhel-centos-debian-fedora-mount-partition-label/
  [2]: https://askubuntu.com/questions/527790/list-all-partition-labels
  [3]: https://askubuntu.com/questions/527790/list-all-partition-labels
  [4]: https://askubuntu.com/questions/182446/how-do-i-view-all-available-hdds-partitions
  [5]: https://superuser.com/questions/320415/linux-mount-device-with-specific-user-rights
