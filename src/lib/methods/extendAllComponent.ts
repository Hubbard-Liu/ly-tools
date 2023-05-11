/*
 * @Author: Do not edit
 * @Date: 2023-05-09 21:41:10
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-12 01:10:39
 * @FilePath: /ly-tools/src/lib/methods/extendAllComponent.ts
 */
import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';
import * as fs from 'node:fs';
import { sep, join ,basename} from 'node:path';
import type { MultiStepInput } from '../multiStepInput';
import { writeFileComponent, findFilesInDir, findDirModules ,allWriteFileComponent } from '../utils';
import { 
  PACKAGE_PATH,
  NODE_MODULES,
  EXCLUDE_PATH,
  MODULES_REG,
  EXTENSION_NAME_REG,
 } from '../config';

const extendAllComponent = async (input: MultiStepInput) => {
  // 1.fsPath
  const document = vscode.window.activeTextEditor?.document;
  const fsPath = document?.uri ? document?.uri.fsPath : document?.fileName;

  // 2.path separator
  const pathArr: string[] = fsPath?.split(sep) ?? [];
  if (pathArr?.length === 0) {
    vscode.window.showErrorMessage('请进入一个文件');
    return;
  };

  // 3.find modules path
  const modulesPath = findDirModules(pathArr);

  // @zfs下的路径
  const packagePath = join(modulesPath, PACKAGE_PATH);
  const filter = new RegExp(EXTENSION_NAME_REG + '$');
  const reg1 = new RegExp(`(${PACKAGE_PATH}.*)\/`);

  const findFilesInDir: (startPath:string) => any[] | [] = (startPath) => {
    if (!fs.existsSync(startPath)) {
      return [];
    }
  
    let files = fs.readdirSync(startPath);
    let result: any[] = [];
  
    for (let i = 0; i < files.length; i++) {
      // 排除
      if (EXCLUDE_PATH.includes(files[i])) {
        continue;
      };
      // 拼接文件路径
      let filename = join(startPath, files[i]);

      // 获取指定路径的文件或目录的状态信息
      let stat = fs.lstatSync(filename);
      
      // 判断是否为文件夹
      if (stat.isDirectory()) {
        result = [ ...result, ...findFilesInDir(filename)];
      } else if (filter.test(filename)) {
        const detail = filename.match(reg1)![1];
        if (!result.includes(detail)){
          result.push(detail);
        }
      }
    }
  
    return result;
  };

  const formatPackagePath = findFilesInDir(packagePath);
  
  
  // 4.find package path
  // 查找指定文件夹下的文件路径

  // 5.加载全部文件目录
  let items: QuickPickItem[] = formatPackagePath.map(path => ({label:path}));

  // 6.显示加载全部文件
  const result = await input.showQuickPick({
    title: '一键继承',
    step: 1,
    totalSteps: 1,
    items,
    // activeItems: items,
    placeholder: '请输入继承的文件夹,一键继承文件夹下的所有组件',
  });

  // // 7.判断选择的文件 名称 地址
  const { label } = result;
  
  // // 8.需要写入地址 /Users/mac/Documents/project/vscodePlugin/zfs-fssc-web/src
  const destPath = join(modulesPath, `..${sep}`, 'src', label!.split('src')[1]);
  // 依赖包的路径
  const selectModulesPath = join(modulesPath, label);

  const batchWriteFileComponent: (startPath:string) => any[] | [] = (startPath) => {
    let files = fs.readdirSync(startPath);
    let result: any[] = [];

    for (let i = 0; i < files.length; i++) {
      // 拼接文件路径
      let filename = join(startPath, files[i]);
      
      // 判断是否vue文件
      if (filter.test(filename)) {
        const detail = filename.match(reg1)![1];
        const name = basename(filename).split('.')[0];
        console.log('detail', detail);
        console.log('destPath', destPath);
        console.log('name', name);
        allWriteFileComponent(name, destPath, detail);
      }
    }
  
    return result;
  };

  batchWriteFileComponent(selectModulesPath);
  
  // // 9.判断当前文件是否存在
  // if (!fs.existsSync(destPath)) {
  //   // 添加组件
  //   await writeFileComponent(label.split('.')[0], destPath, detail);
  // }

  // // 10.选择的node_modules文件路径
  // const selectModulesPath  = modulesPath + sep + detail;

  // // 11.打开文件
  // vscode.workspace.openTextDocument(destPath).then((doc) => {
  //   // 打开当前写入文件
  //   vscode.window.showTextDocument(doc, vscode.ViewColumn.Active);

  //   // 打开侧边依赖栏文件
  //   vscode.workspace.openTextDocument(selectModulesPath).then(
  //     (descDoc) => {
  //       vscode.window.showTextDocument(
  //         descDoc,
  //         vscode.ViewColumn.Beside,
  //         true,
  //       );
  //     },
  //     (err) => {
  //       vscode.window.showErrorMessage(
  //         `侧边打开${detail}文件失败`,
  //       );
  //     },
  //   );
  // });
};

export { extendAllComponent };
