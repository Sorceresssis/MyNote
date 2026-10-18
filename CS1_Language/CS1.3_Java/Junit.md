# Junit

## 写法

```java
public class MainTest {
    @Test
    public  void  testPrint(){
        Main.print();
    }
}

```

## 注解 Junit 5.0

### @Test

修饰方法

标记为测试方法

### @BeforeEach

修饰方法

每个测试方法执行前都会执行

### @AfterEach

修饰方法

每个测试方法执行后都会 执行

### @BeforeAll

修饰方法

所有此时方法执行前执行

### @AfterAll

修饰方法

所有此时方法执行后执行

### @BeforeClass

## 断言

```java
Assert.assertEquals(expected, actual);
Assert.assertTrue(condition);
Assert.assertFalse(condition);
Assert.assertNull(object);
Assert.assertNotNull(object);
Assert.assertSame(expected, actual);
Assert.assertNotSame(expected, actual);
Assert.assertArrayEquals(expected, actual);
Assert.assertArrayEquals(expected, actual, "message");
```

## 假设

```java
Assume.assumeTrue(condition);
Assume.assumeFalse(condition);
```
