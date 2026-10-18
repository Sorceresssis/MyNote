---
text: 介绍
---

# 介绍

## Python 的实现（Cpython, PyPy...）

python 是一种编程语言。但这种语言有多种实现，而且与其他语言不同，python 并没有一个专门的机构负责实现，而是由多个社区来实现。

其中使用 c 语言开发的叫做 python，在于别的语言开发的 python 对比时为避免歧义通常称为 CPython。

同样的，使用 java 开发的叫做 JPython，使用.net 开发的叫做 IronPython。

而 PyPy 与 CPython 的不同在于，别的一些 python 实现如 CPython 是使用解释执行的方式，这样的实现方式在性能上是很凄惨的。而 PyPy 使用了 JIT(即时编译)技术，在性能上得到了提升。
