---
layout: post
title: "git远程代码管理，SSH还是HTTPS"
date: 2015-04-04 23:38:50 +0000
comments: true
categories:
---

之前学习git的过程中就遇到了这个问题，电脑并不能使用ssh连接远程仓库，例如clone git://xx@git.com/xx.git 这样的工程会失败。我就必须改成使用HTTPS协议，把连接改成 https 的，或者直接配置一个环境变量

    git config --global url."https://".insteadOf git://

这样处理有一个弊端，我在Ubuntu上面任何时候需要连接远程仓库，必须输入我的用户名和密码，这样有点麻烦，而SSH协议是用本地存储的公钥私钥验证的，只要配置好了就不用输入用户名密码，我决定改成SSH连接。

##原因

电脑无法用SSH连接远程仓库的原因是SSH协议用的是22端口，但是有些防火墙会把这个端口[block掉][1]

##解决方案

既然不让用22号端口，换个端口就可以了，就像上面stack overflow的解决方案一样，改用443端口，在 ` ~/.ssh/`
建立一个config文件，写上

    Host github.com
    User git
    Hostname ssh.github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa
    Port 443

这里还有个坑，就是建立的这个config文件不能太公开，否则git不答应，使用

    chmod go-rw ~/.ssh/config

这句话就是把g（group当前组）和o（other其他用户）的对config这个文件的权限去掉读和写。

  [1]: http://stackoverflow.com/questions/7144811/git-ssh-error-connect-to-host-bad-file-number
