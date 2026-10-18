---
text: 快速开始
---

# 快速开始

## uv

一个用 Rust 编写的，速度极快的 Python 包和项目管理器。由于它的速度和效率，uv 已经成为了 Python 开发者的首选工具之一。

### windows 安装

**配置安装位置**

在 `系统环境变量` 中对 uv 进行一些配置。

| 变量名                | 变量值            | 含义                    |
| --------------------- | ----------------- | ----------------------- |
| UV_HOME               | C:\Development\uv | uv 所有文件的总目录     |
| UV_INSTALL_DIR        | %UV_HOME%\bin     | uv 的安装目录 (uv.exe)  |
| UV_CACHE_DIR          | %UV_HOME%\cache   | uv 的缓存目录           |
| UV_PYTHON_INSTALL_DIR | %UV_HOME%\python  | uv 的 Python 安装目录   |
| UV_PYTHON_BIN_DIR     | %UV_HOME%\bin     | Python 可执行文件的目录 |
| UV_TOOL_DIR           | %UV_HOME%\tools   | uv 的工具目录           |
| UV_TOOL_BIN_DIR       | %UV_HOME%\bin     | uv 的工具可执行文件目录 |

也可以用管理员权限打开 powershell，然后执行环境变量配置命令。

```powershell
setx UV_HOME "C:\Development\uv" /M
setx UV_INSTALL_DIR "%UV_HOME%\bin" /M
# ...
```

**安装 uv**

可以使用官方的安装脚本来安装 uv。

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

也可以去 github 的 releases 页面下载最新的安装包，然后解压到指定目录。

[https://github.com/astral-sh/uv/releases](https://github.com/astral-sh/uv/releases)

**验证安装**

在命令行中输入以下命令，检查 uv 是否安装成功。

```powershell
uv --version
```

### 常见命令

**Python versions**
Installing and managing Python itself.

| Command               | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `uv python install`   | Install Python versions.                                  |
| `uv python list`      | View available Python versions.                           |
| `uv python find`      | Find an installed Python version.                         |
| `uv python pin`       | Pin the current project to use a specific Python version. |
| `uv python uninstall` | Uninstall a Python version.                               |

**Scripts**
Executing standalone Python scripts, e.g., example.py.

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `uv run`             | Run a script.                      |
| `uv add --script`    | Add a dependency to a script.      |
| `uv remove --script` | Remove a dependency from a script. |

**Projects**
Creating and working on Python projects, i.e., with a pyproject.toml.

| Command      | Description                                           |
| ------------ | ----------------------------------------------------- |
| `uv init`    | Create a new Python project.                          |
| `uv add`     | Add a dependency to the project.                      |
| `uv remove`  | Remove a dependency from the project.                 |
| `uv sync`    | Sync the project's dependencies with the environment. |
| `uv lock`    | Create a lockfile for the project's dependencies.     |
| `uv run`     | Run a command in the project environment.             |
| `uv tree`    | View the dependency tree for the project.             |
| `uv build`   | Build the project into distribution archives.         |
| `uv publish` | Publish the project to a package index.               |

See the guide on projects to get started.

**Tools**
Running and installing tools published to Python package indexes, e.g., ruff or black.

| Command                | Description                                   |
| ---------------------- | --------------------------------------------- |
| `uvx / uv tool run`    | Run a tool in a temporary environment.        |
| `uv tool install`      | Install a tool user-wide.                     |
| `uv tool uninstall`    | Uninstall a tool.                             |
| `uv tool list`         | List installed tools.                         |
| `uv tool update-shell` | Update the shell to include tool executables. |

**The pip interface**
Manually managing environments and packages — intended to be used in legacy workflows or cases where the high-level commands do not provide enough control.

Creating virtual environments (replacing venv and virtualenv):

`uv venv`: Create a new virtual environment.

See the documentation on using environments for details.

Managing packages in an environment (replacing pip and pipdeptree):

| Command            | Description                                                 |
| ------------------ | ----------------------------------------------------------- |
| `uv pip install`   | Install packages into the current environment.              |
| `uv pip show`      | Show details about an installed package.                    |
| `uv pip freeze`    | List installed packages and their versions.                 |
| `uv pip check`     | Check that the current environment has compatible packages. |
| `uv pip list`      | List installed packages.                                    |
| `uv pip uninstall` | Uninstall packages.                                         |
| `uv pip tree`      | View the dependency tree for the environment.               |
| `uv pip compile`   | Compile requirements into a lockfile.                       |
| `uv pip sync`      | Sync an environment with a lockfile.                        |

**Utility**
Managing and inspecting uv's state, such as the cache, storage directories, or performing a self-update:

| Command          | Description                                 |
| ---------------- | ------------------------------------------- |
| `uv cache clean` | Remove cache entries.                       |
| `uv cache prune` | Remove outdated cache entries.              |
| `uv cache dir`   | Show the uv cache directory path.           |
| `uv tool dir`    | Show the uv tool directory path.            |
| `uv python dir`  | Show the uv installed Python versions path. |
| `uv self update` | Update uv to the latest version.            |

### uv 项目命令和 python pip 命令的区别

例如 `uv add` 和 `pip install` 的区别：

uv add 就像是 node 的 npm install，安装依赖到项目中，并且会更新 pyproject.toml 文件。

而 `pip install` 就只会将依赖安装到当前环境中，不会对项目文件进行任何修改。
