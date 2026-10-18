# 规范

# 注意事项

## = 和 :=

= 可能是赋值也可能是相等,只有在 set 和 update 时才赋值的作用，其它都是等于的作用

:= 一定是赋值,不只在 set 和 update 时时赋值的作用，在 select 也是赋值的作用。

# SHOW CREATE

> 1. 展示库

```mysql
SHOW CREATE DATABASE db_name;
```

> 2. 展示表

```mysql
SHOW CREATE TABLE table_name;
```

# ALER DATABASE

> 1. 改校对集（排序规则）mySQL80 默认为'utf8mb4_0900_ai_ci'

```mysql
ALTER DATABASE da_name COLLATE [=] collation_name;
```

> 2. 改字符集 mySQL 默认为‘utf8mb4’

```mysql
ALTER DATABASE db_name DEFAULT CHARACTER SET [=] charset_name;
```

# DESCRIBE 展示表的结构

```mysql
describe table_name;
DESC table_name;
```

# create table

```mysql
-- 创建和表a相同结构，索引的表b
create table b like a;

-- 复制表的结构和数据
create table b as select * from a;
```

# SELECT 查询

## 语法

```mysql
SELECT [DISTINCT] [t$.Group_字段1], [t$.Group_字段2], t$.row_name1 * 2 "别名", t$.row_name2 - 1 "别名"
-- distinct 去重

FROM table_name1 t1, table_name2 t2 JOIN table_name3 ON 链接条件

WHERE (OR/AND/NOT/IN)条件
-- 过滤条件，where一定紧挨着from

Group BY t$..Group_字段1, t$..Group_字段2
-- 分级分组

HAVING 条件
-- 一定要在Group by后面，当条件有函数参与时用having不能用where，因为为要先用where删选得到原料，用函数加工后再用having删选。即，having的删选条件从where删选来，儿子不能生出父亲。

ORDER BY t$.字段1 [ASC|DESC], t$字段2 [ASC|DESC]
-- 排序ASC升序，DESC降序

LIMIT 偏移量, 每页的字段数;
-- 分页,偏移量的字段不可见。
```

> 查询的执行顺序

```mysql
FROM(建立虚拟表) --> ON(对笛卡尔积删选放入虚拟表) --> [Left | Right] JOIN (补充数据) --> where(筛选元素数据) --> Group BY(分组) --> 聚合函数 --> Having(根据分组来二次筛选) --> Select(找出要显示的字段) --> order by(排序) --> limit(分页);
```

> 别名使用

order by 可以使用别名，而 where 不能使用别名。

因为查询先走 From，再 where，然后才能取别名。

## where 下关键字

1. and/or/not/in 多条件查询

    ```mysql

    ```

2. is null /is not null 控制查询
3. BETWEEN AND 范围查询
4. like 字符串匹配查询 mysql 大小写不敏感。 (https://www.bilibili.com/video/BV1iq4y1u7vj?p=21 7:20 )详解

    ```mysql
    -- %

    -- _

    -- \ 转义字符

    -- [] 范围

    -- char$

    -- ^char
    ```

5. regexp 正则表达式

-   ISNULL / IS NOT NULL

```mysql
-- 查没有数据的字段
select * form
where row_name is not NULL;
```

-   IN / NOT IN

```mysql
in ('', '');
```

```mysql
select * form
where row_name link "%e%" --包含e
```

```mysql
-- BETWEEN AND

-- AND

-- NOT

```

> order by 多级排序

```mysql
SELECT *
FROM table_name
ORDER BY row_name1 DESC, row_name2 DESC, row_name3 DESC;
```

## Group BY

> 重要，非分组函数的字段必须声明在 group by 中

```mysql
select 字段1， 字段2， max(字段2), sum(字段3)
from table_name
group by 字段1, 字段2;
/*
字段1，字段2，没有被多行函数函数修饰的字段都有再group by里，
因为多行函数相当于对一个群体的总结，而没有被grop by分类的字段相当与个体，个体不能提炼出群体的总结。
*/
```

> 练习

```mysql
CREATE TABLE sh_goods_attr_value (
id INT PRIMARY KEY ,-- 属性值id,
goods_id INT NOT NULL DEFAULT 0 , -- 商品id
attr_id INT  NOT NULL DEFAULT 0 ,-- 属性id
attr_value VARCHAR(80) NOT NULL  -- 属性值
);

CREATE TABLE sh_goods_attr_value (
id INT PRIMARY KEY ,-- 属性值id,
goods_id INT NOT NULL DEFAULT 0 , -- 商品id
attr_id INT  NOT NULL DEFAULT 0 ,-- 属性id
attr_value VARCHAR(80) NOT NULL  -- 属性值
);
# 结合sh_goods表和sh_goods_attr_value表创建视图view_goods_2，包含拥有属性值的数量大于1个的商品对应的商品id和name。
-- 答案
CREATE VIEW view_goods_2
AS
SELECT t1.id, t1.name
FROM sh_goods t1
JOIN sh_goods_attr_value t2 ON t1.id = t2.goods_id
GROUP BY t1.id, t1.name
HAVING COUNT(t2.id) > 1;

```

> with rollup

-   他会把全都数据在算一次函数
-   但是有 order by，mysql57 会报错,mysql80 不报错

## HAVING

> 如果过滤条件有函数要用 Having

-   因为为要先用 where 删选得到原料，用函数加工后再用 having 删选。即，having 的删选条件从 where 删选来，儿子不能生出父亲。

> 建议使用 having 的前提是有 group by

-   因为没有分组，得到的是一行数据，having 就没有意义了。

> having 与 where 的效率问题

where 删选后分组 比 没有 where 筛选分组再 having 筛选快

## limit 和 mysql8.0

```mysql
SELECT * FROM table_name
LIMIT 0, 20 / 20, 20 / 40, 20; -- 第一页，第二页， 第三页。

-- mysql 8.0
SELECT * FROME table_name
LIMIT (每页字段数) OFFSET (偏移量)
```

## 链接查询

> (建议指明字段所在的表)如果给表起了别名 ，那么后面使用一定要使用别名

```mysql
select t1.col_name, t2.col_name
from table_name1 t1, table_name2 t2
where t1.col_name = t2.col_name
```

> 注意事项

-   多表查询链接条件最少为 n - 1，否则会出现迪科尔的错误。

> 链接查询

-   等值链接 vs 非等值链接 https://www.bilibili.com/video/BV1iq4y1u7vj?p=27 6:58

```mysql
-- 非等值链接
select t1.col_name, ..
from table_name t1, table_name t2,
where t1.row_name between t2.row_name1 and row_name2;


SELECT t1.empno,t1.ename, t1.sal, t2.grade
FROM emp t1
JOIN salgrade t2 ON t1.sal BETWEEN t2.losal AND t2.hisal;
```

-   自链接 vs 非自链接 缺点：字段为 null 时无法查到

```mysql
-- 自链接 在一个表里查询
select emp.employee_id, emp.last_name, mgr.emloyee_id, mgr.last_name
from employees emp, employees mgr
where emp.'manager_id' == mgr.'employee_id';
```

-   内连接 vs 外连接(左外链接|右外链接|满外连接)

```mysql
# 内连接：合并同一列的两个以上的表的行，结果不包含一个表与另一个表不匹配的行

-- SQL99语法
	select employee_id, department_name
	from employees e [INNER] JOIN departments d
	ON e.`department_id` = d.departments_id;
```

```mysql
# 外连接: 合并同一列的两个以上的表的行，结果包含一个表与另一个表不匹配的行包含左边为左外链接，包含右边为右外链接，都包含为满外链接

-- SQL92语法 实现外链接
	-- 左外 让d.departments_id的数据范围变宽即（+）,使e.department_id为null也可以被查到。
	select employee_id, department_name
	from employees e, departments d
	where e.`department_id` = d.departments_id(+)	-- left join

-- SQL99语法 实现外连接
	-- 左外
	select employee_id, department_name
	from employees e LEFT [OUTER] JOIN departments d
	ON e.`department_id` = d.departments_id;
	-- 右外
	select employee_id, department_name
	from employees e RIGHT [OUTER] JOIN departments d
	ON e.`department_id` = d.departments_id;
	-- 满外 (mysql 不支持FULL JOIN)使用union 左上并右中
	select employee_id, department_name
	from employees e LEFT JOIN departments d
	ON e.`department_id` = d.departments_id;
	union all
	select employee_id, department_name
	from employees e RIGHT JOIN departments d
	ON e.`department_id` = d.departments_id;

```

> 七种 SQL JOINS 实现

![1666524627697](image/MySQL/1666524627697.webp)

> NUION 操作符

-   union
-   union all 相同场景下建议用 union all 因为不去重效率高

> SQL99 新特性 自然链接 natural join

```mysql
-- 自动查询两张表相同的字段，进行内链接

select employee_id, department_name
from employees e Natural Join department;
```

> SQL99 新特性 JOIN... Using... 链接

```mysql
select employee_id, department_name
from employees e JOIN departments d
using(department_id);
```

> 小结

-   在链接查询时思考一下 ON 后面的连接条件是否有链接不了的情况(eg:有些的值为 null)，有就要思考外连接。
-   where 适用所有条件
-   on 只能和 join 一起用
-   禁止超过三个表的 JOIN
-   多种表 JOIN

```mysql
select employee_id, department_name
from employees e inner JOIN departments on kdjfjdf
iner JOIN djiaof;
```

> 练习

-   https://www.bilibili.com/video/BV1iq4y1u7vj?p=31 10:47 查询所以发奖金的员工，要注意的是 boss 没有部门，所以是左外查询。

## 子查询

> 多行比较操作符

-   (not) in/exists (不)等于列表中任意一个

    exists 和 in 的区别：

    1. in 是把外表和内表做 hash 连接，先查询内表；
    2. exists 是对外表做 loop 循环，循环后在对内表查询；
    3. 在外表大的时用 in 效率更快，内表大用 exists 更快。

-   any/some 和子查询某一个值比较
-   all 和子查询所有值比较

> （经常忘记）having 中的子查询

-   查询最低工资大于 110 部门最低工资的部门 id 和其最低工资

```mysql
select department_id, min(salary)
from employees
where department_id is not null
group by department_id
having min(salary) > (
    					select Min(salary)
    					from employees
    					where department_id = 110
						)
```

-   查询’A01’仓库中的职工中比’A02’任意一个职工薪水少的职工编号与姓名

```mysql
SELECT Eid, EName
FROM employee
WHERE Wno = 'A01' AND Salary < ANY (
		SELECT Salary
		FROM employee
		WHERE Wno = 'A02'
		)
```

> from 子查询

```mysql
SELECT
	*
FROM
	(SELECT s_id,score,c_id FROM score WHERE c_id='01') a
JOIN
	(SELECT s_id,score,c_id FROM score WHERE c_id='02') b
ON
	a.s_id=b.s_id
WHERE
	a.score>b.score
```

> 练习

-   查询 score2 表中课程号 3 成绩>课程号 2 成绩的学生的学号，成绩信息（student_id 学号，course_id 课程号，grade 成绩）。

```mysql
select t1.*
from (select student_id, grade from score2 where course_id = 3) t1
join (select student_id, grade from score2 where course_id = 2) t2
on t1.student_id = t2.student_id
where t1.grade > t2.grade;

```

> 注意

-   空值问题

# Delect From

## 多表关联删除

> 删除 t1 中，t2 没有的数据；

```mysql
# 删除没有销售过的产品
CREATE TABLE `product` (
  `Pid` varchar(20),   --商品编号
  `PName` varchar(50), --商品名称
  `Weight` decimal(10, 3)    --重量
);
CREATE TABLE `orders` (
  `OrdNo` int(11),   --订单编号
  `Sid` varchar(10), --供应商编号
  `Eid` varchar(10), --职工编号
  `Pid` varchar(20), --商品编号
  `Price` decimal(10,2), --价格
  `QTY` int(11),     --订购数量
  `ordDate` date    --订单日期
);

答案：
DELETE t1, t2
FROM product t1
LEFT JOIN orders t2 ON t1.Pid = t2.Pid
WHERE t2.OrdNo IS NULL;
```

# 函数

## 单行函数

> 单行函数可以嵌套
>
> 进制函数 hex（）
>
> 数学函数 mod sin

![1666524563905](image/MySQL/1666524563905.png)

> 字符串函数 `注意mysql的字符串所以从1开始.`

-   ascii()
-   char_length() 字符长
-   length() 字节长 一个汉字三个字节。
-   concat(字段 1, 字段 2，...) 链接字符串
-   concat_ws('链接字符', '字段 1', '字段 2') 用链接字符链接
-   insert (str, idex, len, replacestr);
-   replace(str, a, b) a 换成 b；
-   left/right(str, len); 取左/几个
-   Lpad/Rpad(str, len, pad) 用 pad 填充 Left/right 到 len 的长度

> 日期时间

-   时间展示

![1666525976388](image/MySQL/1666525976388.png)

-   时间计算

## 流程控制函数

> IF(value, value1, value3) 三目运算符 value? value1: value3

```mysql
select IF(字段 is NOT NULL , 字段， 0)
from table_name;
```

> IFNULL(value1, value2) 如果 value1 不是 null 返回 value1，否则返回 value2

> CASE WHEN... THEN ... WHEN... THEN... ELSE... END 类似于 if...else...

```mysql
select case when salary >= 15000 then 'A'
			when salary >= 10000 then 'B'
			[else 'c'] end '别名'
from table_name;

```

> CASE... WHEN... THEN... WHEN... THEN... ELSE... END 类似于 switch .. case;

```mysql
select department_id,
	case department_id when 10 then salary * 1.1
	when 20 then salary * 1.2
	when 30 then salary * 1.3
	else salary * 1.4 end '别名'
from table_name;
```

## 加密函数

> 平时都是在客户端中加密，防止在传输过程中被发现 ，例如网络抓包

> md5('str') md5a 加密被证明已经不安全了

## mysql 信息函数

![1666527871371](image/MySQL/1666527871371.png)

## 其他函数

> benchmark(n, expr) 把 exper 运行 n 次，用来查看执行性能。benchmark:检测

## 多行函数/聚合函数

-   avg() sum() ：只对数字有效，会自动过滤空值。数量和总和都不算，如果空值算 0，可以写成 avg(if(col_name is null, 0, col_name));
-   max() min() 字符串按照 ascii 码一次向后排序。
-   count() 计算指定字段在查询结构中出现的次数,即非 null 的行数，当 count(字段)，字段不存在时,mysql 会自己在每一行补充该字段，所以 count(不存在字段) 等于表的长度。

> 注意

-   mysql 的聚合函数不能嵌套使用，Oralce 可以

# 编辑表

```mysql
-- 改表名
alter table old_table_name rename new_table_name

-- 改字段数据类型
alter table table_name modify 字段 新数据类型

-- 改字段名
alter table table_name change old_col_name new_col_name data_type;

-- 添加字段
alter table add 字段 数据类型
alter table add col_name data_type first
alter table add col_name data_type after col_name2

-- 删除字段
alter table drop col_name

-- 改字段顺序
alter table table_name modify col_name first
lter table table_name modify col_name after col_name2

-- 改存储引擎
alter table  table_name engine=e_name
```

# 约束

## 创建约束

```mysql
create table table_name(
字段名1 数据类型 列级约束，
constraint [约束名] unique(字段1,字段2) -- 表级约束1
CONSTRAINT [约束名] FOREIGN KEY(字段) REFERENCES table_name(字段)  -- 表级约束2
);
```

> 查看数据库的索引名

```mysql
-- 表的约束名
SELECT *
FROM information_schema.TABLE_CONSTRAINTS
WHERE table_name = 'table_name';

-- CONSTRAINT_TYPE = 'FOREIGN KEY'

-- 表单索引2
SHOW INDEX FROM `table_name`;
```

## Alter table 改表的约束

```mysql
1.主键约束
添加:alter table  table_name add primary key (字段)
删除:alter table table_name drop primary key
2.非空约束
添加:alter  table table_name modify 列名 数据类型  not null
删除:alter table table_name modify 列名 数据类型 null
3.唯一约束
添加1:alter table table_name add unique [index_name](字段1,字段2)
添加2:alter table table_name add constraint 约束名 unique(字段名)
添加3:alter table table_name modify 字段名数据类型 unique
删除1:alter table table_name drop key 约束名
删除2:alter table table_name drop index 约束名
4.自动增长
添加:alter table table_name  modify 列名 int  auto_increment
删除:alter table table_name modify 列名 int
5.外键约束
添加:alter table table_name add constraint 约束名 foreign key(外键列)
references 主键表（主键列）
删除:
第一步:删除外键
alter table table_name drop foreign key 约束名
第二步:删除索引
alter  table table_name drop  index 索引名
[^1]:
约束名和索引名一样
6.默认值
添加:alter table table_name alter 列名  set default '值'
删除:alter table table_name alter 列名  drop default
```

> auto_increment

1. mysql57 的自增值是根据表的最大最大值来确定的。
2. mysql80 的自增值是保存在一个地方，不会变小。

> 默认约束

![1665920866749](image/MySQL/1665920866749.png)

## 外键三种约束模式约束

有外键约束的是子表，被 refence 的是主表

1. district 严格模式(默认的)，父表不能删除或更新一个已经被子表数据引用的记录。
2. cascade : 级联模式，父表的操作，对应子表关联的数据也跟着操作。
3. set null ： 置空模式，父表被操作之后，子表对应的外键字段被置空。

```mysql
# 语法
foreign key(外键字段) references 父表(外键字段) on delete 模式 on update 模式

# eg:
-- on delecte set null 父表记录被`删除`时，子表关联的滞空，
-- on update cascade 父表记录`跟新`时，子表跟着更新新数据
foreign key(外键字段) references 父表(外键字段) on delete set null on update cascade
```

## 关闭打开约束

关| 开

set foreign_key_checks = 0 | 1;

# 索引

## show index 查表的索引

```mysql
Show index from table_name;
```

## explain 查索引使用情况

```mysql
explain select * from table_name where row_name = value
```

## 创建、删除索引

```mysql
# 语法一：
-- 创建
alter table table_name add [unique | fulltext | spatial] index [index_name](row_name[(length)])[asc|desc];
-- 删除
alter table table_name drop index index_name(row_name);


# 语法二：
-- 创建
create [unique | fulltext | spatial] index index_name on table_name(row_name[(length)])[asc|desc];
-- 删除
drop index index_name on table_name;

```

## 约束和索引的关系

1. 概念上不同，约束是为了保证数据的完整性，索引是为了辅助查询；
2. 有的的约束是靠索引实现的，所以你会发现有些约束在创建前会创建一个索引。例如 外键约束，唯一约束。 有些约束不通过索引来实现，他们是通过向引擎中嵌入某些规则来实现的。
3. MySQL 中唯一约束是通过唯一索引实现的，为了保证没有重复值，在插入新记录时会再检索一遍，怎样检索快，当然是建索引了，所以，在创建唯一约束的时候就创建了唯一索引。
4. 应该先删除约束，然后再删除索引。

# 视图

## 创建/搜索 视图

```mysql
create [OR REPLACE]
[algorithm = {undefined | merge | temptable}]
view view_name [(row_name)]
as 查询语句
[with [cascaded | local] check option]

select *
from view_name;
```

> 注意

-   视图的列名，是查询语句的别名
-   视图的增删改会直接影响原表

## 查看视图

```mysql
-- 看视图
show table

-- 看视图结构
describe view_name
desc view_name

-- 看视图属性信息
show table status like 'view_name';
show table status like 'view_name'\G	一列一列的显示(\G用于命令窗口)

-- 看视图的详细定义信息
show create view view_name;
```

## 改、删视图数据

> 语法

```mysql
-- 改
update view_name
set 更改语句
where 筛选语句

-- 删
delete from view_name
where 筛选语句
```

## 视图中的数据有时候无法更新。

-   不是一对一

```mysql
eg:
create view vu_emp_sal
as
select department_id, avg(salary) avg_sal
from emps
where department_id is not null
group by department_id;

-- 1.其中avg_sal字段是根据其他数据计算而来无法直接更改
update vu_emp_sal
set avg_sal = 5000
where department_id = 30; -- 错误

-- 2.其中department_id字段是好多个记录分组得来，也无法更改 分组字段
delete from vu_emp_al
where department_id = 30;

-- 总结: 视图中的行和底层基本表不是一对一的关系就无法更改。
```

## 修改视图

```mysql
-- 修改1
create or replace view vu_emp1
as
select 搜索语句

-- 修改2
alter view vu_em1
as
select 搜索语句

-- 删除
drop view [if exists] view_name1, view_name2, view_name3...;
```

# 储存过程和函数

##优点

1. 简化了操作，减少了程序员压力
2. 减少了网络传输压力，不用传输整条 sql 语句，不需要重新编译
3. 减少了 sql 语句在网上暴露的风险，提高查询的安全性

## 过程 procedure

```mysql
delimiter $
create procedure procedure_name((OUT | IN | INOUT) param type, ...)
begin
	-- 传出参数
	SELECT 表达式 into out_param [from];
	set out_parem;
	select out_parem := 表达式;
END $
delimiter ;

# 调用
-- 自定义变量是 @%，系统变量是@@%
call  procedure_name(@param_name);
# 设置值
set @param_name;
# 输出值
select @param_name;
```

## 函数 function

```mysql
delimiter $
create function function_name([param type])
returns type
	deterministic
	contains sql
	reads sql data
begin
	函数体
	return
end $
delimiter ;

# 调用
select function_name(@param)
```

function 可以用 selcect 是因为函数只有一个返回值，而 procedure 可以有几个参数；

## 储存过程和函数的修改

> 查看存储过程和函数的 `创建信息`

```mysql
show create procedure procedure_name;

show create function function_name;
```

> 查看存储过程和函数 `状态信息`

```mysql
show procedure status;
show procedure status like 'procedure_name';

show function status;
show function status like 'procedure_name';
```

> 改内容

```mysql
create or replace {procedure | function} ()
begin
...
end
```

# 变量流程控制和游标

## 系统变量

```mysql
# 系统全局变量 @@
select @@global.变量名
# 系统会话变量 @@
select @@session.变量名
```

## 用户变量

> 会话用户变量 @全局的

```mysql
# 变量的声明
-- '='或':='
Set @用户变量 = 值
Set @用户变量 := 值

-- select
select @用户变量 := 表达式 [from...]
select 表达式 into @用户变量 [from...]
```

> 局部变量

```mysql
# 用再存储过程和存储函数的begin和end之间, 必须用declare声明

delimiter $
create procedure
begin
-- 申明
declare 局部变量 type default 默认值;
declare ...

-- 赋值
set 局部变量 = 值;
select  表达式 into 用户变量 [from...];

end $

delimiter ;
```

## 定义条件

错误码让人不理解，定义条件解释把错误码命名，让人更能理解

```mysql
delimiter $
create procedure
begin
declare mistake_name condition for 错误码
declare mistake_name condition for sqlstate ''

end $

delimiter ;
```

## 定义处理程序

遇到错误怎么处理

```mysql
declare 处理方法 handler for 错误类型 处理语句;
```

> 处理方法

-   continue ：不处理继续执行
-   exit ：立即退出
-   undo ：撤回之前操作，mysql 不支持；

> 错误类型

![1669820550023](image/MySQL/1669820550023.png)

> 处理语句

可以是 set 变量 = 值， 也可以是 begin... end 这样的复合语句

## 流程控制

> if ... then ...; elseif ..;. else...; end if;

```mysql
# 分号不能少
if email is null
	then 'email is null';
else
	select 'email is not null';
end if;
```

## 循环

> loop.. end loop;

```mysql
[loop_label:] loop
...;
end loop[loop_label];
```

> repeat

```mysql
[repeat_label:]repeat
	...;
UNTIL 条件语句（真,退出循环）没有分号 end repeat[repeat_label];
```

> while... do... end while;

```mysql
[while_label:] while 条件语句（真继续循环） do
...;
end while[while_label];
```

> leave 离开

-   可以再循环和 begin 和 end 包裹里使用

```mysql
[loop_label:] loop
	if 条件语句
		then leave 标签名loop_label;
end loop[loop_label];
```

> iterate

-   类似 continue; 只能再循环里使用

```mysql
[loop_label:] loop
	if 条件语句
		then iterate 循环标签名loop_label;
end loop[loop_label];
```

## 游标

```mysql
# 定义
declare cursor_name cursor for select_statement;
# 打开
open cursor_name;
# 使用游标，into 后面的字段数一定要和游标的字段一样
fetch cursor_name into row_name, row_name
# 关闭
close cursor_name;
```

# 触发器

## 建立语法

```mysql
delimiter $
create trigger trigger_name
-- before 在操作前触发，after在操作后触发
{before | after} {insert | update | delete} on table_name
for each row
begin
触发器执行语句;
end $
delimiter ;
# 字段可以有多个触发器；
```

## NEW

查询到要添加的数据的记录的 manager 字段，new.Manager

insert 和 update 后的记录， NEW.row_name;

## OLD

delete 和 update 前的记录的记录， OLD.row_name;

## 自定义发出报错

```mysql
signal SQLSTATE '状态码' SET MESSAGE_TEXT = '错误的信息'
```

## 查看、删除触发器

```mysql
show trigger trigger_name;

show create trigger_name;

drop trigger trigger_name;
```

## 注意

1. 通过外键约束来改变表的数据，是不会触发触发器的；
2. mysql 必须写 for each row，监听每一行，没一条记录变化都会触发触发器；oracle 可以不写，不写就是批操作，运行一个语句，不管这个语句会引起多少条记录的变化，触发器只执行一次。

# 备份

## 逻辑备份 mysqldump

mysqldump -u root -p >

# 定时删除

# 碎片化整理

# 全文索引 fulltext

```mysql
SELECT *, MATCH(name) AGAINST('f            d') AS score
FROM book
WHERE MATCH(name) AGAINST('f            d')
ORDER BY score DESC;
```

## 建立全文索引，用 parser 分词器

FULLTEXT(name) WITH PARSER ngram

## 查看全局变量

```mysql
-- latin文，因为拉丁文用空格分词，对中文无效
SELECT @@innodb_ft_min_token_size;
SELECT @@innodb_ft_max_token_size;
-- 适用于中文,日文,韩文等表意语言的全文搜索
SELECT @@ngram_token_size
SHOW VARIABLES like '%token%';
-- 默认值
innodb_ft_max_token_size 84
innodb_ft_min_token_size 3
ngram_token_size 2
```

分词长度就是最小查找的长度

ngram_token_size 的默认值是 2，所以很多小网站的最小搜索词都是 2

## 设置分词长度

配置文件中更改

C:\ProgramData\MySQL\MySQL Server 8.0

添加参数|修改 ngram_token_size = 1

![1682602118294](image/MySQL/1682602118294.png)

## 第三方分词器

jieba
