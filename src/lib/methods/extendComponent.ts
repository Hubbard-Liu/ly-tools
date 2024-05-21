import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';
import * as fs from 'node:fs';
import { sep, join } from 'node:path';
import type { MultiStepInput } from '../multiStepInput';
import { writeFileComponent, findFilesInDir, findDirModules,arrayToRegex } from '../utils';
import { 
  PACKAGE_PATH,
  EXTENSION_NAME_REG,
  EXTEND_CPM_PATH,
  EXTEND_PATH,
  EXTEND_SERVICE_PATH
 } from '../config';

const showErrorMessage = (message: string) => {
  vscode.window.showErrorMessage(message);
};

const regExtendService = arrayToRegex(EXTEND_SERVICE_PATH);

const extendComponent = async (input: MultiStepInput) => {
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
    title: '默认继承组件或页面',
    step: 1,
    totalSteps: 1,
    items,
    placeholder: '请输入组件或页面名称',
  });

  // 8.判断选择的文件 名称 地址
  const { label, detail = '' } = result;
  
  let filePath = detail!.split('src')[1];

  // 单独判断是否为 service 文件夹
  if (detail.search(/service/g) !== -1 || detail.search(regExtendService) !== -1) {
    filePath = join('service', filePath);
  }
  
  // 9.需要写入地址
  let destPath = [modulesPath, `..${sep}`, 'src', filePath];

  // 判断路径是否有关键字 默认写入到components下面
  if (detail.search(EXTEND_CPM_PATH) !== -1) {
    destPath.splice(3, 1, EXTEND_PATH, label);
  }
  const formatDestPath = join(...destPath);
  
  // 10.判断当前文件是否存在
  if (!fs.existsSync(formatDestPath)) {
    // 添加组件
    await writeFileComponent(label.split('.')[0], formatDestPath, detail);
  }

  // 选择的node_modules文件路径
  const selectModulesPath  = modulesPath + sep + detail;

  // 11.打开文件
  vscode.workspace.openTextDocument(formatDestPath).then((doc) => {
    // 打开当前写入文件
    vscode.window.showTextDocument(doc, vscode.ViewColumn.Active);

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
  });
};

export { extendComponent };
