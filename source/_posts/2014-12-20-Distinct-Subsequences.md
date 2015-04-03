---
layout: post
title: LeetCode上面的Distinct Subsequences总结
---

最近做了挺多东西,从中也学了不少,觉得总结一下比较好,一直没有时间就一直拖着,现在终于有点空闲的时间,觉得像我这种记性不太好的人还是多做一些code review,否则做一点忘一点,最后反而学不到什么东西.

## 0.先在这里记录一下要整理的东西 ##

1.模拟登陆与抓包(以模拟登陆新浪微博为主,还包括一些编码加密方式)  
2.简易python框架的使用和编写(参照[廖雪峰的博客](http://www.liaoxuefeng.com/))  
3.cookie和session的区别  
4.支持向量机学习笔记  
5.图片分类算法(图像处理课堂作业总结)  
6.一些在LeetCode上面做过的题目的总结  

还是先回归正题,以后有空了再把那几个坑填上..
先总结一下今天做的这道题,LeetCode上面的[Distinct Subsequences](https://oj.leetcode.com/problems/distinct-subsequences/)

## 1.题目描述 ##
首先这道题题目描述不是很容易理解,我看了半天还是没明白题意,可能是英语水平有限.这里重新描述一下这道题

给两个字符串S,T 要求在S中找子串(subsequence),使S的子串等于T,在S中找到最多的这样的子串个数

## 2.解题思路 ##  
这道题很明显是一道DP,作为一个初学者,我首先想到了最长公共子串  


        if(s1[i] == s2[i])
            dp[i][j] = dp[i-1][j-1]+1;
        else
            dp[i][j] = max(dp[i-1][j],dp[i][j-1]);


可惜和这题没什么关系  
DP很重要的是观察前后元素的关系,在这道题目中,如果用M*N的space来存储计算结果,其中**dp[i][j]**代表了**T[0,i]**中包含的等于**T[0,j]**的子串的数目.  
重点就是得到**dp[i][j]**和前面的值之间的关系,我就先画了一张二维数组的表  
r a b b b i t  
0 0 0 0 0 0 0 0  
r 0 1 1 1 1 1 1 1  
a 0 0 1 1 1 1 1 1  
b 0 0 0 1 2 3 3 3  
b 0 0 0 0 1 3 3 3  
i 0 0 0 0 0 0 3 1  
t 0 0 0 0 0 0 0 3  
表中的数值都是人工计算出来的,这里的重点是**b重复了3次的那个地方**,再找个重复多次的例子看了一下,发现了规律,(对于一个初学者直接写出递推式实在太困难,这样找规律的方法更容易理解一些)


        if(s[i] == t[j])
            dp[i][j] = dp[i][j-1]+dp[i-1][j-1];
        else
            dp[i][j] = dp[i][j-1];
  

这些代码的**数学解释**就是:
当s[i]和t[j]匹配的时候
对应的值就是以s[i]结尾的子串的个数和不以s[i]结尾的子串的个数的和
例如rabb**b** 和 rab**b**匹配到最后一个b的时候,对应的值就是rabbb中以最后一个b结尾的还要和**rab**相等的子串的个数为2(123,124),不以最后一个b结尾的还要和**rabb**相等的子串的个数为1(1234),总和就是3,具体可以再用rabbbbbb和rabb匹配实验一下...
当不匹配的时候
直接等于上一个就好了..

## 3.代码实现 ##


        class Solution {
        public:
            int numDistinct(string S, string T) {
                //DP
                /*dp[i][j] stores  number of S[0,i]'s substr which equals T[0,j]*/
                int **dp = new int*[T.length()+1];
                for (int i = 0; i <= T.length(); ++i){
                    dp[i] = new int[S.length()+1];
                    memset(dp[i], 0, sizeof(int)*S.length());
                }
                for (int i = 0; i <= S.length(); ++i)
                    dp[0][i] = 1;
                bool flag = false;
                int next = 0;
                for (int i = 0; i < T.length(); ++i){
                    for (int j = next; j < S.length(); ++j){
                        if (S[j] == T[i]){
                            dp[i + 1][j + 1] = dp[i][j] + dp[i + 1][j];
                            if (!flag){
                                flag = true;
                                next = j + 1;
                            }
                        }
                        else
                            dp[i + 1][j + 1] = dp[i + 1][j];
                    }
                    flag = false;
                }
                return dp[T.length()][S.length()];
            }
        };


## 3.代码优化 ##

0.我的代码一开始有一个比较大的问题,就是没对数组初始化..后来进行了修改

1. 内层循环的开始不必是0,这点我已经在实现的时候优化,
比如rabbbit和rabbit匹配的时候匹配到了t的时候,只要从(rabbit中的)i的下一个开始匹配就可以了,因为要匹配t,必须在前面所有字符已经匹配结束的基础上匹配t

2. 比较重要的一个优化,leetcode论坛上面一个大牛的优化,将空间复杂度降到了O(n)

具体是这样的


        vector<int> path(m+1, 0);
        path[0] = 1;            // initial condition
    
        for (int j = 1; j <= n; j++) {
            // traversing backwards so we are using path[i-1] from last time step
            for (int i = m; i >= 1; i--) {
                path[i] = path[i] + (T[i-1] == S[j-1] ? path[i-1] : 0);
            }
        }

