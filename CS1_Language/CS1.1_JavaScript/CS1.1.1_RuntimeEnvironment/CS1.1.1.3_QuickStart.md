---
text: 快速开始
---

# 快速开始

## Node

目前主流的教程都是让你去直接下载 Node 安装，实际上使用版本管理器会更方便。你可以轻松切换 Node 版本来适应不同的项目需求。

Node 主流的版本管理工具有 `nvm` 、`Volta`。我个人比较喜欢 `Volta` 。

### Volta

[官网](https://volta.sh/)

Volta 支持 Node.js、npm 和 Yarn 的版本管理。与 nvm 不同，Volta 可以自动为每个项目选择正确的 Node.js 版本，并在你进入项目目录时自动切换。

**Windows 上安装 Volta**

`--location` 参数可以指定 Volta 的安装位置。因为 Volta 默认安装在用户的 %LOCALAPPDATA% 目录下。如果你希望在使用其他账户时也能使用 Volta，建议将其安装在一个公共目录下，比如 `C:\Development\Volta`。

```powershell
winget install Volta.Volta --location C:\Development\Volta
```

**volta 安装 node**

```powershell
volta install node  # 安装最新的 LTS(长期支持) 版本的 Node

volta install node@18  # 安装 18 这个大版本的最新版本

volta install node@18.16.0  # 安装 18.16.0 这个具体版本

node -v # 查看已安装的 Node 版本, 检查是否安装成功
```

**volta 安装包管理器**

这里的安装是独立与 Node 的。

```powershell
volta install npm

volta install yarn

volta install pnpm
```

**查看已安装的 Tools**

```powershell
volta list node  # 查看所有已安装的 Node

volta list npm # 查看所有已安装的 npm

volta list yarn # 查看所有已安装的 yarn
```

**给项目指定 Node 和包管理器 版本**

```powershell
volta pin node@22.17.0
volta pin npm@10.9.3
```

volta 会在项目的 `package.json` 文件中添加 `volta` 字段，记录当前项目使用的 Node 和包管理器版本。如下:

```json
{
    // ...
    "volta": {
        "node": "22.17.0",
        "npm": "10.9.3"
    }
    // ...
}
```
