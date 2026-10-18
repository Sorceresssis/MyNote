# pm2

## 常用命令

pm2 的服务都有一个数字 id，你可以用 id 快速操作它。下面以编号为 0 的服务为例（当然，把 id 换为应用名也是一样的）：

pm2 start # 启动一个服务，携带 --name 参数添加一个应用名，携带参数 --watch 将观察修改重启服务

pm2 start app.json # 启动一个 json 文件中的所有服务

pm2 list # 列出当前的服务 pm2 monit # 监视每个 node 进程的 CPU 和内存的使用情况

pm2 stop <name> # 停止服务(pm2 stop 名称或 id)

pm2 stop all # 停止所有服务进程

pm2 restart <name> # 重启服务(pm2 restart app.js)

pm2 restart all # 重启所有进程

pm2 delete <name> # 删除服务(pm2 delete app_name|app_id)

pm2 delete all # 删除全部服务

pm2 logs # 查看所有服务的输出日志

pm2 logs <name> # 查看服务的输出日志

## window 开机自启

1、安装 pm2（建议安装到全局）

npm install pm2 -g

2、安装 windows 自启动包

npm install pm2-windows-startup -g

3、创建开机启动脚本文件

pm2-startup install

4、使用 pm2 启动项目

pm2 start 项目启动文件（最好是进入到项目启动文件同级目录）

5、保存 pm2 中的项目（最好加一个保存一个）

pm2 save

执行完以上操作，重启电脑查看

卸载服务

pm2-service-uninstall

linux 系统
1、启动服务

pm2 start 项目启动文件（最好是进入到项目启动文件同级目录）

2、保存当前已启动的服务

pm2 save

3、设置开机自启配置

pm2 startup

4、执行 pm2 startup 后，得到提示，复制并执行以 sudo env 开头的提示，用来设置环境变量

sudo env ...

执行完以上操作，重启电脑查看
