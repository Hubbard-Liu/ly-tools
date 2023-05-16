/*
 * @Author: Do not edit
 * @Date: 2023-05-11 22:11:33
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-05-16 10:08:09
 * @FilePath: /ly-tools/src/lib/config.ts
 */
import * as vscode from 'vscode';

let PACKAGE_PATH: string = vscode.workspace.getConfiguration().get('ly-tools.configPackagePathName') || '@zfs';
let EXTEND_PATH: string = vscode.workspace.getConfiguration().get('ly-tools.configExtendPathName') || 'components';
let EXCLUDE_PATH: string[] = vscode.workspace.getConfiguration().get('ly-tools.configExcludePathName') || ["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"];
let extendComponentsPath: string[] = vscode.workspace.getConfiguration().get('ly-tools.configExtendComponentsPathName') || ["ui", "boe-core"];
const NODE_MODULES = 'node_modules';
const EXTENSION_NAME_REG = '.vue';
const MODULES_REG = /(?<=node_modules\/)(\D|\w|\/)*/g;
let EXTEND_CPM_PATH = new RegExp(extendComponentsPath.map(reg => `(\/${reg}\/)`).join('|'), 'g');

const configChange = () => {
  // 监听配置文件变化
  vscode.workspace.onDidChangeConfiguration((e) => {
		PACKAGE_PATH = vscode.workspace.getConfiguration().get('ly-tools.configPackagePathName') || '@zfs';
    EXCLUDE_PATH = vscode.workspace.getConfiguration().get('ly-tools.configExcludePathName') || ["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"];
    EXTEND_PATH = vscode.workspace.getConfiguration().get('ly-tools.configExtendPathName') || 'components';
    extendComponentsPath = vscode.workspace.getConfiguration().get('ly-tools.configExtendComponentsPathName') || ["ui", "boe-core"];
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