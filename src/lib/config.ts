/*
 * @Author: Do not edit
 * @Date: 2023-05-11 22:11:33
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-06-02 14:14:12
 * @FilePath: /zfs-toolkit/src/lib/config.ts
 */
import * as vscode from 'vscode';

let PACKAGE_PATH: string[] = vscode.workspace.getConfiguration().get('zfs-toolkit.configPackagePathName') || ['@zfs', '@zfs/web'];
let EXTEND_PATH: string = vscode.workspace.getConfiguration().get('zfs-toolkit.configExtendPathName') || 'components';
let EXCLUDE_PATH: string[] = vscode.workspace.getConfiguration().get('zfs-toolkit.configExcludePathName') || ["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"];
let extendComponentsPath: string[] = vscode.workspace.getConfiguration().get('zfs-toolkit.configExtendComponentsPathName') || ["ui", "boe-core"];
const NODE_MODULES = 'node_modules';
const EXTENSION_NAME_REG = '.vue';
const MODULES_REG = /(?<=(node_modules))(\D|\w|\/)*/g;
let EXTEND_CPM_PATH = new RegExp(extendComponentsPath.map(reg => `(\/${reg}\/)`).join('|'), 'g');

const configChange = () => {
  // 监听配置文件变化
  vscode.workspace.onDidChangeConfiguration((e) => {
		PACKAGE_PATH = vscode.workspace.getConfiguration().get('zfs-toolkit.configPackagePathName') || ['@zfs', '@zfs/web'];
    EXCLUDE_PATH = vscode.workspace.getConfiguration().get('zfs-toolkit.configExcludePathName') || ["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"];
    EXTEND_PATH = vscode.workspace.getConfiguration().get('zfs-toolkit.configExtendPathName') || 'components';
    extendComponentsPath = vscode.workspace.getConfiguration().get('zfs-toolkit.configExtendComponentsPathName') || ["ui", "boe-core"];
    EXTEND_CPM_PATH = new RegExp(extendComponentsPath.map(reg => `(\/${reg}\/)`).join('|'), 'g');
	});
};

export {
  PACKAGE_PATH,
  EXCLUDE_PATH,
  NODE_MODULES,
  EXTENSION_NAME_REG,
  MODULES_REG,
  EXTEND_PATH,
  EXTEND_CPM_PATH,
  configChange
};