---
text: 废弃
bindLink: false
---

<title> Git </title>

# Git

## 快速开始

### 本地初始化仓库

`git init`

### 远程下载仓库代码

```powershell
git clone https://[克隆账号]:[克隆密码]@<仓库地址> [克隆到的地址]
```

## 提交 commit

### 普通提交

`git add <filename>`

### 合并上一次提交

`--amend` : 把最新的修改合并到最新的提交。本质是通过创建新提交来替换当前分支的尖端。

。

`--no-edit` : 修改提交而不更改其提交消息。

```powershell
git commit --amend
git commit --amend --no-edit
```

## 提交历史 Log

## 分支 Branch

### 分支操作

**选项 Options**

`-m` : 重命名

`-d` : 删除

----orphan 创建一个干净的分支， 默认的是基于当前分支来传教，作为 基础(base), 后面会有 rebase 操作。

### 切换分支 checkout

`git checkout -b new-branch-name`

### 合并 merge

### 合并冲突解决

### 变基 rebase

### 变基冲突解决

变基冲突，

### 合并和变基如何选择

变基适合本分支依赖模块更新。他不需要知道。

合并适合新功能的添加。

### Pull Request

## Git Stash

`git stash` 命令允许你临时保存当前工作目录的更改，以便你可以切换到其他分支或处理其他任务。

不需要提交就是可以切换到其他分支。

## 回退/重置 Reset

`git reset`

git reset --hard origin/feat/zq_cust_claim

## 远程 Remote

### 查看远程仓库

`git remote`

如果是使用 `clone` 命令克隆了一个仓库，命令会自动将其添加为远程仓库并默认以 “origin” 为简写

```bash
git remote

# 结果
origin 	# 默认远程仓库
remote2 # 其他远程仓库
```

**选项**

`-v` : 会显示需要读写远程仓库使用的 Git 保存的简写与其对应的 URL。

```powershell
git remote -v
origin	https://github.com/username/repo (fetch)
origin	https://github.com/username/repo (push)
```

### 添加远程仓库

`git remote add <shortname> <url>`

```powershell
git remote add pb https://github.com/paulboone/ticgit

git remote -v
origin	https://github.com/schacon/ticgit (fetch)
origin	https://github.com/schacon/ticgit (push)
pb	https://github.com/paulboone/ticgit (fetch)
pb	https://github.com/paulboone/ticgit (push)
```

### 修改远程仓库的地址

`git remote set-url <shortname> <url>`

```
git remote set-url origin https://github.com/
```

### 从远程仓库中获得数据

`git fetch <remote> [remote_branch]:[local_branch]`

### 根据远程分支创建本地分支

`git checkout -b <local_branch> <remote>/<remote_branch>`

### 拉取

`git pull <remote> <remote_branch>:<local_branch>`

### 推送

`git push [-options] <remote> <remote_branch>` 本地和远程同名

`git push [-options] <remote> <local_branch>:<remote_branch>` 本地和远程不同名

```powershell
git push -u origin my-dev:dev
```

**选项 Options**

`-f` : 强制推送，有时推送的提交树和远程分支冲突，可以强制推送，但是很危险的操作。

`-u` : 把当前分支与要推送的远程分支关联起来，下一次直接使用 `git push` 就可以推送到关联的远程分支

### 根据远程回退 Remote Reset

git fetch --all
git reset --hard origin/master (这里 master 要修改为对应的分支名)

## 标签 Tag

`git tag`

## 配置 Config

```powershell
git config [--参数] <key> <value>
```

**参数**

```powershell
--global # 全局
```

### 文件名大小写敏感

windows 系统 的文件名是大小写不敏感的，这就导致，代码在不同的操作系统编译运行会出错。所以建议设置 git 文件名大小写敏感。

```powershell
git config --global core.ignorecase false
```

### 代理

**添加代理**

```powershell
git config [-Options] http.proxy '<协议>://<host>:<port>'

git config --global http.proxy 'socks5://127.0.0.1:1080'
git config --global https.proxy 'http://127.0.0.1:7890'
```

## 案例

### 多人合作流程案例 1

1. 在 dev 分支基础上创建自己的分支 `feat/my-branch`
2. rebase dev 分支更的新代码。解决 rebase 冲突
3. 提交 pr 。

## 其他

### git 命令历史保存位置

```powershell
C:/user/%User%/.bash_history
```

### 提交签名验证 Commit Signature Verification

Github 提交会有都有 `Verfied`标签

`Verified`标签表示，这个 commit 确实是 commiter 本人所为
