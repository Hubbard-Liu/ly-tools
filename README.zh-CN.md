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
| `ly-tools.configPackagePathName` | 需要从node_modules继承依赖的名称） | `@zfs` |
| `ly-tools.configExcludePathName` | 设置查找时排除的文件夹 | `["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"]` |
| `ly-tools.configExtendPathName` | 设置继承到指定src下的目录 | `components` |
| `ly-tools.configExtendComponentsPathName` | 设置继承到指定目录的关键字 | `["ui", "boe-core"]` |