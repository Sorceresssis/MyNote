# fish shell

Friendly Interactive Shell - 用户友好的 shell

## 安装

```shell
sudo apt-get update # 可能会用到，如果报错

sudo apt install fish
```

确认 fish 安装路径

```shell
which fish
```

通常路径是/usr/bin/fish

切换 fish 为默认 shell

```shell
chsh -s /usr/bin/fish
```

配置 fish

```shell
fish_config
```

关闭问候语

set -U fish_greeting
