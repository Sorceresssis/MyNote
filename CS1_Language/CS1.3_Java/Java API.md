## 包装类/装箱

在 ArrayList、Map、vector、这些标准类库放基本变量时，要用对应的 `包装类`

因为是很多标准类库是引用类型，说以 int ，double 在传入时有一个装箱(_装箱是将值类型装换成引用类型的过程_)的操作

> 装箱

1. int Integer ArrayList `<Integer>`
2. char Character ArrayList `<Character>`
3. double Double ArrayList `<Double>`

## List

### ArrayList

### LinkedList

本质双向链表

> list.forEach(s->sout(s))

## Set

### HashSet

必须重写 equals()方法；

本质是链式哈希表

当哈希表的长度大于等于 64 时,且一个哈希值的链表长度大于 8 时，哈希值挂的链表会自动转化为红黑树；

### LinkedHashSet

本质 链式哈希表，

但是每一个元素都会添加它前面和后面元素的地址，来记录顺序；本质是一个双向链表；

### TreeSet

本质二叉排序数

## Map

### String put(K, V)

put 方法有加入数据的功能也有覆盖数据的功能，当 Key 不存在时，加入 Key 和 Value,当 Key 存在时，会覆盖掉原来的 Value，并返回被覆盖的值；

> bool containsKey(K)，bool containsValue(V)

### 键值对象 Entry<K , V>

类似与 c++的 pair

> 调用方式

```java
// 1.
import java.util.Map;
Map<String, String> map = new HashMap()
Set<Map.Entry<String, String>> entries = map.entrySet();

// 2.
import java.util.Map;
import java.util.Map.Entry;
Map<String, String> map = new HashMap()
Set<Entry<String, String>> entries = map.entrySet();
```

### map 遍历方式

```java
Map<Integer, String> stud = new HashMap<>();
stud.put(1, "a");
stud.put(2, "b");
stud.put(3, "c");
stud.put(4, "d");
stud.put(5, "e");
stud.put(6, "f");

/* 键值集合遍历 */
Set<Integer> studKey = stud.keySet();
for (int i : studKey) {
    System.out.println(stud.get(i));
}
Iterator<Integer> it = studKey.iterator();
while (it.hasNext()) {
    System.out.println(stud.get(it.next()));
}

/* 键值对象Entry */
Set<Map.Entry<Integer, String>> entrys = stud.entrySet();
for (Map.Entry<Integer, String> entry : entrys) {
    System.out.println(entry.getKey() + "=" + entry.getValue());
}

/* forEach */
// lambda
stud.forEach((k, v) -> {
            System.out.println(v);
        });

// 匿名内部类
stud.forEach(new BiConsumer<Integer, String>() {
            @Override
            public void accept(Integer integer, String s) {
                System.out.println(s);
            }
        });
```

### HashMap

和 HashSet 一样本质是链式哈希表

当哈希表的长度大于等于 64 时,且一个哈希值的链表长度大于 8 时，哈希值挂的链表会自动转化为红黑树；

## 集合工具类 Collections

## Comparable 和 Comparator

Comparable：定义对象的排序规则，让对象继承

Comparator：排序规则器，配合 Collections.sort() 使用

## Stream

就是把集合转化成可以进行链式操作的形态

## File

### 工作路径

## IO

### 字节流 Stream

#### 文件

FileInputStream

FileOutputStream

可以增加一次读取的字节个数来减少循环加快读取速度。

### 序列化流 / 反序列化流 (Stream)

ObjectInputStream

ObjectOutputStream

```java
public JavaBean implements Serializable {

}
```

#### serialVersionUID

java 对象会生成一个 serialVersionUID ，当对象改变时 serialVersionUID 也会改变，这就导致应 serialVersionUID 不一致导致反序列化失败。

我们可以自定义固定版本号。

利用 idea 的自动生成

![1740329014743](./assets/javaapi/images/1740329014743.png)

### 字符流

## 多线程
