# Android AVD

常常用令

adb kill-server
adb start-server

```powershell
# 虚拟机镜像列表
emulator -list-avds

# 启动 Medium_Phone_API_36.0 镜像的虚拟机
emulator -avd Medium_Phone_API_36.0 -writable-system -no-snapshot

```

## Root

root 要选择 Google APIs 不能选择 Google Play APIs 因为它没有 root 权限。

使用 [rootAVD 工具](https://gitlab.com/newbit/rootAVD) 实现 root.
