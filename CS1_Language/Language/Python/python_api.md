## 装饰器

### @property

允许为属性提供 getter 和 setter 方法，可以在访问或设置属性时添加额外的逻辑。

如果直接使用变量，就无法在访问或设置时添加这些逻辑。

**实例属性**

```python
class Foo:
    _bar = "bar"

    @property
    def bar(self):
        return Foo._bar

    @bar.setter
    def bar(self, value):
        Foo._bar = value

    @property
    def baz(self):
        return self._baz

    @baz.setter
    def baz(self, value):
        self._baz = value


obj1 = Foo()
obj2 = Foo()

# 类属性
print(obj1.bar)
obj1.bar = "bar1"
print(obj2.bar)

# 实例属性
obj1.baz = "baz1"
obj2.baz = "baz2"
print(obj1.baz)
print(obj2.baz)

# Output:
# bar
# bar1
# baz1
# baz2

```
