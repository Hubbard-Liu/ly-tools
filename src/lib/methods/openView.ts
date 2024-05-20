/*
 * @Author: Do not edit
 * @Date: 2023-05-09 21:41:10
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-06-02 14:38:53
 * @FilePath: /zfs-toolkit/src/lib/methods/openView.ts
 */
import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';
import * as fs from 'node:fs';
import { sep, join } from 'node:path';
import type { MultiStepInput } from '../multiStepInput';
import { findFilesInDir,findDirModules } from '../utils';
import { 
  PACKAGE_PATH,
  EXTENSION_NAME_REG,
 } from '../config';

const showErrorMessage = (message: string) => {
  vscode.window.showErrorMessage(message);
};

const openView = async (input: MultiStepInput) => {
  // 1.fsPath
  const document = vscode.window.activeTextEditor?.document;
  const fsPath = document?.uri ? document?.uri.fsPath : document?.fileName;

  // 2.path separator
  const pathArr: string[] = fsPath?.split(sep) ?? [];
  if (pathArr?.length === 0) {
    showErrorMessage('请进入一个文件');
    return;
  };
  
    // 3.find modules path
    const modulesPath = findDirModules(pathArr);

    // 4.find node_modules dir
     // 存储存在的子路径
     const existingPaths: string[] = [];
     for (const subPath of PACKAGE_PATH) {
       const fullPath = join(modulesPath, subPath);
       if (fs.existsSync(fullPath)) {
         existingPaths.push(fullPath);
       }
     }
   
     // 如果存在的子路径数量为0，则显示错误消息并返回
     if (existingPaths.length === 0) {
       showErrorMessage('未找到指定的node_modules文件夹文件');
       return;
     }
    
    const reg = new RegExp(EXTENSION_NAME_REG + '$');
  
    // 6.加载全部文件目录
    let items: QuickPickItem[] = [];
  
    for (const path of existingPaths) {
      const fileList = findFilesInDir(path, reg);
      if (fileList) {
        items = [...items, ...fileList];
      }
    }

  // 7.显示加载全部文件
  const result = await input.showQuickPick({
    title: '查找组件或页面',
    step: 1,
    totalSteps: 1,
    items,
    // activeItems: items,
    placeholder: '请输入组件或页面的名称',
  });

  // 8.判断选择的文件 名称 地址
  const { detail = '' } = result;

  // 9.需要写入地址
  const destPath = join(modulesPath, `..${sep}`, 'src', detail!.split('src')[1]);

  // 选择的node_modules文件路径
  const selectModulesPath  = modulesPath + sep + detail;

  // 判断当前文件是否创建
  if (fs.existsSync(destPath)) {
    // 11.打开文件
    vscode.workspace.openTextDocument(destPath).then((doc) => {
      // 打开当前找到的文件
      vscode.window.showTextDocument(doc, vscode.ViewColumn.Active);
    });
  }

  // 打开侧边依赖栏文件
  vscode.workspace.openTextDocument(selectModulesPath).then(
    (descDoc) => {
      vscode.window.showTextDocument(
        descDoc,
        vscode.ViewColumn.Beside,
        true,
      );
    },
    (err) => {
      showErrorMessage(
        `侧边打开${detail}文件失败`,
      );
    },
  );


};

export { openView };
