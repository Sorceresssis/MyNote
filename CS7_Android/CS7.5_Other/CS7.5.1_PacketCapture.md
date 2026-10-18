---
text: 代理抓包
---

# 代理抓包

## 抓包种类

Android 抓包无非就是三种情况：

1. 未做证书校验：直接放证书就能抓
2. 单向认证：通过 hook 技术，绕过 sslping
3. 双相认证：逆向分析，找证书及密钥

## 未做证书校验（应用未启用 SSL Pinning）

### **特点**

- App **没有实现任何 SSL 证书校验逻辑** 。
- 使用系统默认的 TrustManager，信任系统安装的 CA。
- 只要把抓包工具（Fidder/Charles/Proxyman）的 CA 证书 **安装为系统证书** ，HTTPS 就能被正常中间人代理。

> 抓包工具 = 中间人服务器
>
> 抓包工具签发的证书 = 受系统信任 → App 自然认为服务器证书可信

### Android 14+

Android 14（API 34）开始，系统对证书信任机制做了重大收紧： 用户安装的证书（User CA）默认不再被应用信任 ，尤其是针对 **HTTPS / TLS MITM / 抓包 / 调试流量** 的场景影响非常明显。系统预装的可信根证书继续被所有应用信任。

**解决方案**

1. root + 安装用户证书到 System CA

把证书 xxx.crt 转换为 xxx.pem，重命名为 hash 值命名的文件（如 `9a5ba575.0` ）。
然后放到 `/system/etc/security/cacerts/` , `/apex/com.android.conscrypt/cacerts/` 目录下。
设置权限 `chmod 644` 。

2. 如果是你的应用，可以在 app 的配置 `network_security_config` 中添加 user CA 信任。

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config>
        <trust-anchors>
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

### Android 16

到了 android 16 使用 `adb` + `root` + `remount/system write` 的传统方式 ，在 Android 16 上基本 不可行。`Magisk` 方案也受影响

把抓包工具的证书写入系统证书变得非常困难。

## 单向认证（SSL Pinning / 证书指纹校验）

### 特点

- App 校验服务器证书
  包含但不限于：

  - 公钥（Public Key Pinning）
  - 证书指纹（SHA256 Pinning）
  - 自定义 TrustManager
  - okhttp / WebView 手动校验证书链

- 仅导入 CA 证书不再有效
- 中间人证书会被 App 判定为伪造 → 抓不到包

### 解决方案

只能绕过其验证逻辑，包括：

1. 主流 hook 技术

   - Frida（最通用）

2. 手工逆向方式

   - 找到自定义的 TrustManager
   - Patch 掉 checkServerTrusted()
   - 直接返回 true

## 双向认证（Mutual TLS / Client Certificate Authentication）

### 特点

- 除了服务器验证客户端，还要求 客户端提供证书与私钥（Client Certificate） -证书可能存储在：
  - APK 内（assets/raw 目录）
  - so 库中
  - KeyStore/硬件安全区
  - 动态从服务器下发
- 私钥通常被保护，不容易提取
