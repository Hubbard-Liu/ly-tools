# 如何使用

- 直接使用 `ctrl+shift+f10` 组合按键
> 可以利用VSCODE的Keyboard shortcuts重新定义快捷键。

# 特性

> 1: 继承组件或页面

> 2: 查找页面

> 3: 继承目录组件

# 配置

插件配置，点击 VS Code 的 `文件 > 首选项 > 设置`，打开设置面板：

| 名称 | 描述 | 默认值 |
|----|----|-----|
| `zfs-toolkit.configPackagePathName` | 需要从node_modules继承依赖的名称） | `@zfs` |
| `zfs-toolkit.configExcludePathName` | 设置查找时排除的文件夹 | `["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"]` |
| `zfs-toolkit.configExtendPathName` | 设置继承到指定src下的目录 | `components` |
| `zfs-toolkit.configExtendComponentsPathName` | 设置继承到指定目录的关键字 | `["ui", "boe-core"]` |
| `zfs-toolkit.configExtendIncludePathName` | 设置组件路径继承至src/service下的目录,例如:src/service | `["ui", "boe-core"]` |