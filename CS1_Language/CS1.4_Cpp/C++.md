# C++ 基础语法

## 二进制文件输入输出

```cpp
#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int main(int argc, char* argv[]) {
    //c++版
    fstream Output("F:\\Desktop\\Output.txt", ios::out | ios :: app);
    fstream Input("F:\\Desktop\\Input.txt");

    string a;
    getline(Input, a);  //一行一读
    cout << a << endl;
    Output << "Hello World!" << endl;
    Output.close();
    //c版
        FILE* Output, Input;
        errno_t err_Out = fopen_s(&Output, "F:\\Desktop\\Output.txt", "w");
        errno_t err_In = fopen_s(&Input, "F:\\Desktop\\Input.txt", "r");
        if (err_Out == 0) {
            cout << "文件打开成功" << endl;
            for (int i = 0; i < 10; i++) {
                fprintf(Output, " %d" + !i, Array[i]);
            }
        }
        if (err_In == 0) {
            cout << "文件打开成功" << endl;
            for (int i = 0; i < 10; i++) {
                fscanf_s(Input, "%d", &Array[i], 1);
            }
        }
    return 0;
}
```

---

# const

> const 修饰指针 const 修饰右边的东西。

```cpp
const int* p = &a;  //p指向一个const修饰的常量;
p = &b; //p的指向可以更改。
*p = b; //但p指向的值不能更改。

int* const p = &a;  //const修饰的p指向一个量
p = &b; //p的指向不能更改。
*p = b; //p指向的值可以改。

const int* const p = &a;
//const修饰的p指向一个const修饰的常量;
```

> const 修饰函数。

```cpp
// const 修饰函数不可更改成员属性， 本质是修饰const this指针。
class Person{
    public:
        int a;
        mutable int b;  //mutable关键字在任意函数都可以改。
        void func0(){
            a = 10; //正确
            b = 10; //正确
            //type(this)    Person* const ptr;
        }
        void func1() const {
            a = 10; //错误。
            b = 10; //正确
            //type(this)    const Person* const ptr;
        }
}

//常对象只能调研常函数
const Person p;
P.func0();  // 错误。
p.func1();  // 正确。
// 因为 p 为const修饰对象，p的成员不可更改，但是func0可以修改 p 成员，造成矛盾。
```

---

# 局部变量

> 不要返回局部变量地址，局部变量在栈区。出栈时地址不合法。

```cpp
int* fun() {
    int a;
    return &a;
}
```

---

# new 函数

```cpp
int* a = new int(10);   //初始化为10
int* a = new int[10];   //申请10个int空间。

// new 和delete的本质是操作符，可以被重载
void* operator new(){
}
void operator delete(void* t){
}
```

---

# 引用

> 引用本质是一个常量指针。type\* const refer
> 引用必须初始化；
> 引用不可更改

> 如果函数的返回值是引用,则这个函数可以作为左值。

```cpp
int& fun(int& refer) {
    return refer;
}

int main(int argc, char* argv[]) {
    int n = 10;
    int& m = fun(n);    //用引用接住返回值
    cout << m << endl;
    fun(n) = 100;
    cout << m << endl;
    return 0;
}
```

---

# enum 枚举

```cpp
enum Color//颜色
{
    RED=1,
    GREEN=2,
    BLUE=3
};

enum Color clr = GREEN;//只能用枚举常量给枚举变量赋值，才不会出现类型的差异
clr = 4;
```

---

# union 联合

```cpp
union Un
{
    char c;
    int i;
};
union Un un;//联合变量的定义
printf("%d\n", sizeof(un));
//输出结果为4，由于char和int类型共用同一块空间
```

---

# class 类 封装

> 权限关键字

```cpp
class C {
    C(){    //构造函数

    }
    c(const C& c) { //拷贝构造

    }
    ~C(){   //析构函数

    }
public:     //外部可访问    可继承
protected:  //外部不可访问  可继承
private:    //外部不可访问  不可以继承
};
C() //类名+小括号 = 匿名对象。下一行就释放
```

> 构造函数

```cpp
class Person {
    public:
        Person(string T_name, int T_age) {  //有参构造
            name = T_name;
            age = T_age;
        }
        Person(string T_name, int T_age): name(T_Name), age(T_age){.
            //初始化列表
        }
        Person(const Person& T) {   //拷贝构造
            name = T.name;
            age = T.age;
        }
        ~Person() {
        }
    private:
        string name;
        int age;
};
Person damo0("何骏涛", 20);
Person damo1 = damo0;
Person damo2(damo0);
```

> 编译器自动给 class 提供的函数

```cpp
/*
编译器会自动给class提供无参构造函数、拷贝构造函数、析构函数。
当写了参数构造函数，编译器就不提供无参构造，但提供拷贝构造函数。
当写了拷贝构造函数，编译器就不提供其他构造函数
*/
```

> 浅拷贝与深拷贝。

```cpp
//自动生成的构造函数的执行浅拷贝。
class Person{
    public:
        person(int T_age, int T_height){
                    age = T_age;
            int* height = new int(T_height);
        }
        ~Person(){
            if(height){
                delete height;
                height = NULL;
            }
        }
    private:
        int* height;
        int age;
}

int main(){
    Person damo0(20, 160);
    Person damo1(damo0);    //编译器自动生成浅拷贝构造函数。
    return 0;
}
/*
由于编译器自动生成浅拷贝构造函数，damo1的height直接由damo0拷贝过来。内存地址相同
main函数结束时，damo0执行析构函数，释放堆内存。
damo1执行析构函数再次释放相同地址的内存。
所以浅拷贝会造成，堆区的内存重复释放,程序崩溃
*/
// 解决方法：自己写一个深拷贝函数。
Person(const Person& T){
        age = T.age;
    height  = new int(*T.height);
}

```

---

# static 静态成员

---

# this 指针

> 链式编程

```cpp
a.fun().fun().fun();    //链式编程的样式.
//原理
person& func{

    return *this;
}
```

> 空指针可以访问成员变量和函数。

```cpp
class person {
    public:
        int a;
        void func0() {
            cout << "tjis is func0" << endl;
        }
        void func1() {
            cout << a << endl;
            //cout << this->a << endl;
        }
}
Person p = NULL;
p->func0;   //可运行
p->func1;   //报错,因为this指针为空。

//如何加代码的健壮性
在用到this指针函数里加入保护。
if(this == NULL) {
    cout << "this is nullptr" << endl;
    return;
}

```

---

# 运算符重载和仿函数

> operator= 赋值运算符重载

```cpp
/*
默认构造、默认析构、拷贝构造、operator=是编译器自动生成的四个函数。
重点是深拷贝与浅拷贝 在浅拷贝后析构函数对相同地址的堆区内存重复释放
*/
class Person {
    friend ostream& operator<< (ostream& cout, const Person& T);
    friend class comp;
public:
    Person() {      //默认构造
        height = NULL;
    }
    Person(int T_height) {      //有参构造
        height = new int(T_height);
    }
    Person(const Person& T) {       //拷贝构造，深拷贝。
        height = new int(*T.height);
    }
    ~Person() {
        delete[] height;
    }
    Person& operator= (const Person& T) {   //赋值构造，深拷贝。
        if (height == NULL) {
            height = new int(*T.height);
        }
        else {
            *height = *T.height;
        }
        return *this;
    }
    Person& operator++() { //前置递增运算符， ++i;
        (*height)++;
        return *this;
    }
    Person operator++(int) { //后置递增运算符， i++;
        Person tmp(*height);
        (* height)++;
        return tmp;
    }
    bool operator==(const Person& T) {
        return *height == *T.height;
    }
    bool operator!= (const Person& T) {
        return *height != *T.height;
    }
    bool operator<(const Person& T) { //从小到大。
        return *height < *T.height;
    }
    //bool operator<(const Person& T) { //从大到小。
    // return *height > *T.height;
    bool operator>(const Person& T) {
        return *height > *T.height;
    }
private:
    int* height;
};
ostream& operator<< (ostream& cout, const Person& T) { //左移运算符
    cout << *T.height;
    return cout;
}
class comp {
public:
    bool operator()(const Person& S, const Person& T) {   //函数调用运算符，仿函数。
        return *S.height < *T.height;
    }
};

void test() {
    Person p1(10), p2;
    p2 = p1;
    p2++;
    cout << (p1 < p2) << endl;
    cout << p1 << ' ' << p2 << endl;
}
```

---

# 继承

> 语法

```cpp
class My : public Person
//class 子类(派生) : 继承方式 父类(基类)

class father{
public:
    int a;
protected:
    int b;
private:
    int c;
}
class son : public father {
public:
    int a;
}
son s;
cout << sizeof(s) << endl;
//输出为16.父类的每一个飞静态成员都会被继承。只是有些父类学员无权访问。

/*构造和析构
1.构造father
2.构造son
3.析构son
4.析构father
*/

//父子类成员同名，默认为子类。
cout << s.a << ' ' << s.father::a << endl;
/* 类结构
+---(class son)
| +--- (base class father)
| | fa_a
| | fa_b
| | fa_c
| +---
| son_a
+---
*/
```

---

### 菱形继承 虚基类

> 当没有虚继承时。

```c++
class a{
    int data;
}
class b : public a{
}
class c :  public a{
}
class d ：public b, public c {
}
/* 类结构
+---(class d)
| +---(base class b)
| | +---(base class a)
| | | a
| | +---
| +---
| +---(base class c)
| | +---(base class a)
| | | a
| | +---
| +---
+---
class a 被保存了两份
*/
```

> 用虚继承 b, c 就成为了虚基类

```cpp
class a{
    int data;
}
class b : virtual public a{
}
class c : virtual public a{
}
class d ：public a, public c {
}

/* 类结构。
+---(class d)
| +--- (base class b)
| | (vbptr: virtual base pointer 虚基指针)
| +---
| +--- (base class c)
| |(vbptr)
| +---
+---
+---(virtual base a)
| data
+---
d::vbtable b: (virtual base table 虚基表)
	记录一到base a个偏移量
d::vbtable c:
	记录一到base a个偏移量
*/
// (vbpr)是指针也占位置。在64位编译器下，一个ptr8字节，考虑字节对齐。
d damo;
sizeof(damo) == 3 * 8 = 24
```

![1668952071385](image/C++/1668952071385.png)

---

# 多态

### 虚函数

-   多态是靠指针或是引用来实现。类对象无法实现多态。

```cpp
//静态多态:在编译时绑定函数地址 早绑定
//动态多态:在运行时绑定函数地址 晚绑定
class Animal{
public:
    virtual void speak()
    {
        cout << "animal speak" << endl;
    }
}
class Cat : public Animal {
    void speak()
    {
        cout << "Cat speak" << endl;
    }
}
void speak(Animal& T) {
    T.speak();
}
void test(){
    Animal A;
    speak(A); //Animal speak
    Cat C;
    speak(C); //Cat speak
}
/*
+---(class Animal)
| (vfptr : virtual fouction ptr)
|
| +---Animal::vftable
| |void Animal::speak()
| +---
+---

+---(class Cat)
| +---(base class Animal)
| |(vfptr : virtual fouction ptr)
| +---
|
| +---Cat::vftable()
| | void Cat::speak()
| +---
+---
*/
```

---

### 纯虚函数 & 抽象类 abstractclass

1. 抽象类就是需要纯虚函数类的父类，把子的共同点抽象出来。

2. 抽象类无法实例化对象

```cpp
class Base
{
public:
    virtual void func() = 0;//纯虚函数
    /*
    1.只要有一个纯虚函数，着这个类就是抽象类
    2.抽象类无法实体化对象。
    3.抽象类的子类必须重写。
    */
}
class son : public Base
{
public:
    void func()
    // 必须存在对纯虚函数的重写,否则无法实体化对象。
    {
    }
}
void test()
{
 /*
 Base B;  无法实体化
 new Base; 无法实体化
 */
}
```

---

> virtual 关键字总结

从菱形继承，多态得出 virtual(虚)原理就是用 virtual ptr 实现不同的功能。

# Lambda 表达式/匿名函数

```cpp
int f = [捕获列表](参数列表) mutable throw() ->int
{
    return 0;
}();
cout << f << endl;

int n = 34, m = 54;
auto f = [n, m]()mutable
{
    return ++n;
};
cout << f() << endl;
cout << f() << endl;
cout << n << endl;
//输出为: 35 36 34
//匿名函数捕获不会修改外部的变量。每次调用都是赋值一个新的。
```

![lambda捕获链表总结](image/C++/lambda.png)

# 结构化绑定

```cpp
for (auto [name, age, tail] : people) {
	cout << name << ' ' << age << ' ' << tail << endl;
}
```

# 竞赛

```cpp
printf( " %d"+ (i ==0) , i);
accumulate
set_union
set_difference
set_intersection
```

# 链表的实现

```cpp
#include<iostream>
#include<stdlib.h>
using namespace std;

typedef struct Node {  //创建节点。双向链表。
	struct Node* front;
	int Data;
	struct Node* back;
} Node;
typedef struct List {  //每个链表的头和尾。
	Node* head;
	Node* tail;
} List;
void Cin_List(List* pList, int number);		//输入链表。
void Cout_List_Order(List pList);	//倒叙输出链表。
void Free_List(List* pList);		//清除链表。

int main() {
	int T,n;
	cin>>T;
	while (T--) {
		cin>>n;
		List Damo;
		Damo.head = NULL;
		Damo.tail = NULL;
		int number;
		while (n--) {
			scanf("%d", &number);
			Cin_List(&Damo, number);
		}
		Cout_List_Order(Damo);
		Free_List(&Damo);
	}
	return 0;
}
void Cin_List(List* pList, int number) {
	Node* temp;
	Node* p = (Node*)malloc(sizeof(Node));		//创建新的节点。
	p->Data = number;
	p->back = NULL; 		//以新的节点作为链表尾部。
	if (pList->head) {		//判断头部是不是空指针。
		pList->tail->back = p;		//头部不是空指针，就从指针后面链接新节点。
		temp = pList->tail;
		pList->tail = p; 			//pList->tail更新，再把新节点赋给Damo.tail,成为新的尾部。为下一个新节点做准备。
		pList->tail->front = temp;	//把上一个节点保存在新节点的front;
	} else {
		pList->head = pList->tail = p;		//头部为空指针，要给头部一个指针。
		pList->head->front = pList->tail->front = NULL;  //头节点的上一个节点不存在，即NULL;
	}
}
void Cout_List_Order(List pList) {
	int i=1;
	for (Node* p = pList.head; p; p = p->back) {
		if(i%2==0) {
			if (i!=2)cout << ' ';
			cout << p->Data;
		}
		i++;
	}
	cout << endl;
}
void Free_List(List* pList) {  //c
	Node* q, * p;
	for (Node* p = pList->head; p; p = q) {
		q = p->back;
		free(p);
	}
}
```
