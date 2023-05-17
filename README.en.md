# How To Use

- CLI: Press `ctrl+shift+f10`

# Features

> 1: 继承组件或页面

> 2: 查找页面

> 3: 继承目录组件

# Configuration

you can also configure. Open your user and workspace settings (File > Preferences > Settings):

| name | Description | Default |
|----|----|-----|
| `zfs-toolkit.configPackagePathName` | 需要从node_modules继承依赖的名称） | `@zfs` |
| `zfs-toolkit.configExcludePathName` | 设置查找时排除的文件夹 | `["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"]` |
| `zfs-toolkit.configExtendPathName` | 设置继承到指定src下的目录 | `components` |
| `zfs-toolkit.configExtendComponentsPathName` | 设置继承到指定目录的关键字 | `["ui", "boe-core"]` |