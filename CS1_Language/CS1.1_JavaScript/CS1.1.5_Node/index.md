---
text: Node
---

# Node

## 命令行工具

### npm / pnpm / yarn

包管理工具

### npx

`npx` 是 **npm 自带的一个命令行工具** （从 npm v5.2 开始内置），

它的作用是：

> 👉 **帮你临时或本地执行 npm 包里的命令，而不用全局安装。**

```bash
npx tsx main.ts
```

执行逻辑是这样的：

1. **在当前项目的 `node_modules/.bin/` 下找** `tsx`；
2. 如果找到了（比如你已安装 `tsx`），就直接执行；
3. 如果没找到，它会：
    - 临时从 npm 下载并缓存执行；
    - 执行完后自动清理（除非你指定 `--no-cleanup`）；
4. `npx` 本质上会帮你找到那个可执行文件的路径，然后用 Node 启动它。

#### 🧠 四、常见用法总结

| 用法                          | 说明                             |
| ----------------------------- | -------------------------------- |
| `npx tsc`                     | 运行本地安装的 TypeScript 编译器 |
| `npx tsx main.ts`             | 运行 tsx 执行 main.ts 代码       |
| `npx create-react-app my-app` | 临时下载并运行一个包             |
| `npx eslint .`                | 执行项目内 ESLint                |
