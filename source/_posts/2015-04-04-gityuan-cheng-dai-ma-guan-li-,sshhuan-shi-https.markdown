---
layout: post
title: "git远程代码管理，SSH还是HTTPS"
date: 2015-04-04 23:38:50 +0000
comments: true
categories: [git, 配置]
---

之前学习git的过程中就遇到了这个问题，电脑并不能使用ssh连接远程仓库，例如`clone git@github.com/xx.git` 这样的工程会失败。我就必须改成使用HTTPS协议，把连接改成 https 的，或者直接配置一个环境变量

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

## 两个有用的文档
1. [git里面用命令行更改远程仓库的URL/使用的协议][2]
2. [用https的端口（443）代替被封掉的ssh端口（22）][3]

## 后续
修改完这些。。我以为一切都结束了，可视连接远程仓库还是连接不上，这时候我发现在我项目目录下的 `.git/config` 里面，远程仓库的地址写的是`git://github.com/xxx.git`,并不是ssh里面标明的 `git@github.com/xx.git` 的形式。
那么问题来了，`git://` 和 `git@`有什么区别？
进过一番查询，找到了一个[解释的比较清楚的答案][4]

> It depends on the repository.
> The native git transport uses TCP port 9418. However, git can also run
> over ssh (often used for pushing), http, https, and less often others.
>
> You can look at the repository URL to find out which port it uses.
> Notice that many public repositories have several alternate URLs; for
> instance, the kernel.org repositories have git://, http://, and
> https:// URLs.
>
> The common URL schemes for git repositories are:
>
> - ssh:// - default port 22
> - git:// - default port 9418
> - http:// - default port 80
> - https:// - default port 443
>
> If the URL does not have a scheme, it it using ssh with a slightly
> different syntax.
>
> See the git fetch manpage for more details on the available URL
> schemes.

大体意思就是`git://`使用的是 native git协议，用的是9418端口，有些防火墙会封掉，而`git@`也就是`ssh:`用的是ssh协议，端口是22，也会被一些防火墙封掉，上面那些操作只能解决ssh连不上的问题，也就是说执行了上面的配置，只能保证git@github.com这样的远程仓库能连接，而写成git://就无法解决，解决这个，只能利用git的全局配置把所有的`git://`连接转成`https://`连接，这样就避免了使用native git协议。
[这篇文章][5]对上面的问题说的挺好。


  [1]: http://stackoverflow.com/questions/7144811/git-ssh-error-connect-to-host-bad-file-number
  [2]: https://help.github.com/articles/changing-a-remote-s-url/
  [3]: https://help.github.com/articles/using-ssh-over-the-https-port/
  [4]: http://serverfault.com/questions/189070/what-firewall-ports-need-to-be-open-to-allow-access-to-external-git-repositories
  [5]: http://stackoverflow.com/questions/4891527/git-protocol-blocked-by-company-how-can-i-get-around-that
