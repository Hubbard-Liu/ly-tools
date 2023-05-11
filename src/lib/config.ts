/*
 * @Author: Do not edit
 * @Date: 2023-05-11 22:11:33
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-11 22:27:07
 * @FilePath: /ly-tools/src/lib/config.ts
 */
import * as vscode from 'vscode';

const PACKAGE_PATH: string = vscode.workspace.getConfiguration().get('ly-tools.configPackagePathName') || '@zfs';
const EXCLUDE_PATH: string[] = vscode.workspace.getConfiguration().get('ly-tools.configExcludePathName') || ["ui", "element-ui", "el-bigdata-table", "boe-ia", "lib"];
const NODE_MODULES = 'node_modules';
const EXTENSION_NAME_REG = '.vue';
const MODULES_REG = /(?<=node_modules\/)(\D|\w|\/)*/g;

export {
  PACKAGE_PATH,
  EXCLUDE_PATH,
  NODE_MODULES,
  EXTENSION_NAME_REG,
  MODULES_REG
};