---
text: 语法
bindLink: false
---

### 异常处理

```js
// try .... catch ... finally

function test() {
    try {
        console.log("try");
        return;
    } catch (error) {
        console.log("catch");
    } finally {
        console.log("finally");
    }
}

test();

// 结果为
// try
// finally
```

### 异步

```javascript
let count = 0;

async function addCount(id) {
    count = count + (await fetchCount(id));
    console.log(count);
}

addCount(1);
addCount(2);

// 结果为

// 1
// 2
```

### Promise & async/await

#### 状态吸收

### 标签语法
