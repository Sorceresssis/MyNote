# Java语言的特点

1. java的非基本数据类型就是引用数据类型，传递的都是地址。自定义类在函数间传递为引用传递，传的是地址。不想C++一样new一个新对象（我猜java是new了一个新地址）。所有标准类库都是直接复制地址的浅拷贝，但是String类很特殊；
2. 因为是很多标准类库是引用类型，但是int ，double是值类型；所以他们在传入时有一个装箱(*装箱是将值类型装换成引用类型的过程*)的操作;int --> Integer,double-->double;
3. java 的普通函数就是C++的虚函数
4. java 没有C++的类选择器(::)，不支持多继承
5. 给常量起名字用下划线
6. java继承多态实现原理和C++差不多。[C++继承多态原理](./C++语法.md)

# 好文章

[java string 深拷贝_探讨java深拷贝](https://blog.csdn.net/weixin_31477659/article/details/114247840)

# 小技巧

1. %s 是原始 %S是全大写、
2. jdk自带的javap 可以反编译class文件

# Java易错和易忘点

## 注意换行符。

再使用input.nextInt()、input.nextDouble()时，后面还有换行符没有吸收
如果后面要用input.nextLine(), 则要吸收掉换行符。

# 内置函数使用注意事项

> Integer.parseInt(string, radix)

传入的字符 `不能为空`和 `不合格的字符`否则报错

## 原码 反码 补码

> 在计算机中所以数据都是用补码的形式储存的, -128只有补码。

![1663414396387](image/Java/1663414396387.png)

## Java 常量池

```java
在Java语言中，String类型变量直接赋值和使用new方式新建String对象是完全不同的两种方式，产生的结果也不一样，需要了解其中的差别。

概念：

Java常量池

类在加载完成之后，会在内存中存储类中的一些字面量(本身即是值如10，“abc”)，对于字符串常量来说，Java会保证常量池中的字面量不会有多个副本，也就是说在常量池中的字符串不可能有两个字符串是相同的，但是Java代码中可能不同的变量的值是相同的，那么在编译期间，这两个变量值所在地址是相同的。而且Java在编译期间会对字符串进行一定的处理，如果一个字符串采用拼接的方式，并且拼接的内容都是字面量的话，那么会自动将字符串先拼接完再赋值，如果常量池中已经有了拼接完成之后的字面量，那么此变量的值的地址就是常量池中的完整字符串的地址。需要注意的是，String在赋值完成之后修改，是会产生新的变量的。比如：

String str = "reeves";

str = "abc";

那么实际上在常量池中存储了"reeves"和"abc"两个字面值，在字符串变量赋予新的值的时候并不会改变原先存储的值，它会再新建一个字符串，而在栈中变量存储的值的地址是变了的。

使用：

例子1：

String str1 = "reeves";

String str2 = "reeves";

System.out.println(str1==str2); // 结果：true

例子中新建了两个变量str1和str2，值相同，在编译期间变量str1和str2值得地址都可以确定，因为两个变量的值相同，指向常量池中的地址也相同，因此使用“==”符号来判断两者值得地址是否相同时，返回的是true。

例子2：

String str1 = "reeves";

String str2 = "ree"+"ves";

System.out.println(str1==str2); // 结果：true

Java语言在编译期间，对于字符串拼接且拼接元素都是字面量的情况，会自动将拼接字符串拼接完整之后再赋值，因此 String str2 = "ree"+"ves"; 就相当于 String str2 = "reeves"; 而“reeves”字面量在常量池中存在，因此str2的引用地址和str1相同。

例子3：

String str1 = "aaa";

String str2 = new String(str1);

String str3 = new String("aaa");

String str = new String("reeves");

System.out.println(str1 == str2);	//结果为false

System.out.println(str1 == str3);	//结果为false


使用new关键字新建String对象时，会在堆中新创建一个字符串对象，值为“reeves”，同时，Java也会监测常量池中是否有“reeves”字面量，如果没有，那么在常量池中再新建一个“reeves”的字面量。

String str1 = "你好";
String you = "你";
String hi = "好";
String str2 = you + hi;
System.out.println(str1 == str2);	// 结果为false;
String str3 = you + hi;
System.out.println(Str2 == str3)	// 结果为true;
```



## 代码块

# 深拷贝与浅拷贝

> java 的自定义类在函数间是引用传递。

并不是和C++ 一样new 一个新的对象。所以java的一些类库都是浅拷贝。拷贝构造不会再函数传值时被调用。

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Course> cs = new ArrayList<Course>();
        Course a = new Course("fefe", 8, 0);
        System.out.println(a);
        test(a);
    }

    public static void test(Course c) {
        System.out.println(c);
    }
}

class Course {
    private String name;
    private int grade;
    private double points;

    public Course(String name, double points, int grade) {
        this.name = name;
        this.grade = grade;
        this.points = points;
    }

    public Course(String name, double points) {
        this.name = name;
        this.grade = -1;
        this.points = points;
    }
}
// 运行结果为
/*
Course@16b98e56
Course@16b98e56
*/
```

## 想到的一个深拷贝的思想

就是给每一个类提供一个clone()方法, 该方法返回一个new出来的对象。其new时传入的参数是也是成员变量的clone()new出来的；本质就是用clone()实现了深拷贝的 `递归`，一直递归到java的基本数据类型；

```java
class Main {
    public static void main(String[] args) {
        A textA = new A("he", 12);

        B textB1 = new B(textA);
        System.out.println(textB1.bA.aString + textB1.bA.aInt);

        B textB2 = textB1.clone();
        System.out.println(textB2.bA.aString + textB2.bA.aInt);

        textA.aInt = 21;
        textA.aString = "jun";
        System.out.println();
        System.out.println(textB1.bA.aString + textB1.bA.aInt);
        System.out.println(textB2.bA.aString + textB2.bA.aInt);
    }
}

class B {
    A bA;

    public B(A bA) {
        this.bA = bA;
    }

    public B(B b) {
        this.bA = new A(b.bA);
    }

    public B clone() {
        return new B(bA.clone());
    }
}

class A {
    String aString;
    int aInt;

    public A(String aString, int aInt) {
        this.aString = aString;
        this.aInt = aInt;
    }

    public A(A a) {
        this.aString = new String(a.aString);
        this.aInt = a.aInt;
    }

    public A clone() {
        return new A(aString, aInt);
    }
}
```

## 实现Cloneable实现深拷贝

clone()实现了深拷贝的 `递归`，一直递归到java的基本数据类型；

```java
public class AddressClone implements Cloneable{
    private String address1;
    private String address2;
    public AddressClone() {
    }
    public AddressClone(String address1, String address2) {
        this.address1 = address1;
        this.address2 = address2;
    }
    @Override
    protected AddressClone clone() throws CloneNotSupportedException {
        return (AddressClone) super.clone();
    }
}

public class UserClone implements Cloneable{
    private String userName;
    private AddressClone address;
    public UserClone() {
    }
    public UserClone(String userName, AddressClone address) {
        this.userName = userName;
        this.address = address;
    }

    @Override
    protected UserClone clone() throws CloneNotSupportedException {
        // 需要注意的是，super.clone()其实是浅拷贝，
        // 所以在重写UserClone类的clone()方法时，address对象需要调用address.clone()重新赋值
        // 调用父类的clone;
        UserClone userClone = (UserClone) super.clone();
        userClone.setAddress(this.address.clone());
        return userClone;
    }


public static void main(String[] args) throws CloneNotSupportedException {
        AddressClone address = new AddressClone("小区1", "小区2");
        UserClone user = new UserClone("小李", address);
        UserClone copyUser = user.clone();
        user.getAddress().setAddress1("小区3");
        // false
        System.out.println(user == copyUser);
        // false
        System.out.println(user.getAddress().getAddress1().equals(copyUser.getAddress().getAddress1()));
    }
}
```

> 子传父类的调用规则

```java
class Animal {
    String name = "动物";
    public void speak() {
        System.out.println("Animal speak");
    }
}
class Dog extends Animal {
    String name = "狗";
    public void speak() {
         System.out.println("Dog speak")
    }
}

Animal a = new Dog();
```

1. 调用成员变量，java调用的是父类的变量，如果没有编译失败。无法调用子类的变量

```java
System.out.println(a.name);
// 输出为：动物
/*
调用成员变量时，使用父类来调用的，变量无法被覆盖。所有没有权限调用子类的变量
*/
```

2. 调用成员函数，调用的是子类的函数，如果没有编译失败。

```java
a.speak();
// 输出为：Dog speak
/*
因为java的普通函数就是虚函数。所有函数放在一个表里，函数表是可以被覆盖的。
在创建Dog时候，Dog的speak()直接把Animal的speak()给覆盖率(重写)。
*/
```

## 变量强转

> 由于子传父类不能调用子类独有的功能。父类可以被强制传化成子类。

```java
Animal a = new Dog();
Dog d = (Dog)a;
d.speak();
((Dog)a).speak();
```

## instanceof	判断变量的type

```java
class a;
class dog extends a;
class cat extends a;
// 子类instanceof父类都是true
new dog() instanceof a; // true
new cat() instanceof a;	// true
// 子类instanceof子类是false
new dog() instanceof cat;	// false
new cat() instanceof dog;	// false

// 判断变量a是不是Dog类型
if(a instanceof Dog ){
    Dog d = (Dog)a;
    d.speak();
}
else  {
    sout("不是Dog类型，无法强转");
}

// jdk14, 直接如果是直接复制给d
if(a instanceof Dog d){
    d.speak();
}
else  {
    sout("不是Dog类型，无法强转");
}
```

## final

> final 修饰方法

final 修饰的方法相当于变回了 C++ 的普通函数，

它不会被加到虚函数表里，无法被子类重写。

> final 修饰类

final 修饰的类无法被继承，不能有子类。

> final 修饰量。

final 修饰变量 只能赋值一次

1. 修饰基本数据类型

```java
final int a;	// a 不可更改
const int a;	// 等价
```

2. 修饰引用数据类型

```java
class C{
}
final C c;	// c的指向的对象不能更改,但对象的值可以被更改；
int * const ptr;	// 等价

private final // 不设置set函数,且私有。则实现了引用类型的数据不可更改。
```

## 什么是序列化

> 详细解释 https://mp.weixin.qq.com/s/0EfIUB9E-0Oh_Clwuxswuw

假如我们要对 `Student`类对象序列化到一个名为 `student.txt`的文本文件中，然后再通过文本文件反序列化成 `Student`类对象：

![1669304771496](image/Java/1669304771496.png)

## Serializable

```java
public class Student implements Serializable {

    private String name;
    private Integer age;
    private Integer score;

    @Override
    public String toString() {
        return "Student:" + '\n' +
        "name = " + this.name + '\n' +
        "age = " + this.age + '\n' +
        "score = " + this.score + '\n'
        ;
    }
    // ... 其他省略 ...
}
// 序列化
public static void serialize(  ) throws IOException {

    Student student = new Student();
    student.setName("CodeSheep");
    student.setAge( 18 );
    student.setScore( 1000 );

    ObjectOutputStream objectOutputStream =
        new ObjectOutputStream( new FileOutputStream( new File("student.txt") ) );
    objectOutputStream.writeObject( student );
    objectOutputStream.close();

    System.out.println("序列化成功！已经生成student.txt文件");
    System.out.println("==============================================");
}

// 反序列化
public static void deserialize(  ) throws IOException, ClassNotFoundException {
    ObjectInputStream objectInputStream =
        new ObjectInputStream( new FileInputStream( new File("student.txt") ) );
    Student student = (Student) objectInputStream.readObject();
    objectInputStream.close();

    System.out.println("反序列化结果为：");
    System.out.println( student );
}
```

## Gson 序列化实现深拷贝

Gjsonb把 object --> json 序列化 json --> object 反序列化

因为反序列化，要把数据重写到内存，对象的所有元素都要重新申请一快内存，这就实现了深拷贝；
