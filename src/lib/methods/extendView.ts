import * as vscode from 'vscode';
import * as fs from 'node:fs';
import { sep, join } from 'node:path';
import type { QuickPickItem } from 'vscode';
import type { MultiStepInput } from '../multiStepInput';

const NODE_MODULES = 'node_modules';
const PACKAGE_PATH = ['acorn', 'dist'];
const EXTENSION_NAME_REG = '.js';

const extendView = async (input: MultiStepInput) => {
  // 1.fsPath
  const document = vscode.window.activeTextEditor?.document;
  const fsPath = document?.uri ? document?.uri.fsPath : document?.fileName;

  // 2.path separator
  const pathArr: string[] = fsPath?.split(sep) ?? [];
  if (pathArr?.length === 0) {
    vscode.window.showErrorMessage('请进入一个文件');
    return;
  };
  
  // 3.find node_modules dir
  const findDirModules: (arrPath: string[]) => string = (arrPath) => {
    let path = arrPath.join(sep) + sep + NODE_MODULES;
    if (fs.existsSync(path)) {
      return path;
    } else {
      arrPath.pop();
      if (arrPath.length === 0) {
        return '';
      } else {
        return findDirModules(arrPath);
      }
    }
  };

  // 4.find modules path
  const modulesPath = findDirModules(pathArr);

  // 5.find package path
  // 查找指定文件夹下的文件路径
  const findFiles: (dir:string, filter: RegExp) => string[] = (dir, filter) => {
    let results: string[] = [];

    fs.readdirSync(dir).forEach((file) => {
        file = join(dir, file);
        let stat = fs.statSync(file);

        if (stat && stat.isDirectory()) {
          results = [ ...results, ...findFiles(file, filter)];
        } else {
          if (filter.test(file)) {
            results.push(file);
          }
        }
      });

      return results;
  };

  // const findFilesInDir: (startPath:string, filter: RegExp) => QuickPickItem[] | [] = (startPath, filter) => {
  //   if (!fs.existsSync(startPath)) {
  //     console.log("no dir ", startPath);
  //     return [];
  //   }
  
  //   let files = fs.readdirSync(startPath);
  //   let result: QuickPickItem[] = [];
  
  //   for (let i = 0; i < files.length; i++) {
  //     let filename = join(startPath, files[i]);
  //     let stat = fs.lstatSync(filename);
  
  //     if (stat.isDirectory()) {
  //       result = [ ...result, ...findFilesInDir(filename, filter)];
  //     } else if (filename.indexOf(filter) >= 0) {
  //       result.push({ label: files[i], description: filename });
  //     }
  //   }
  
  //   return result;
  // };
  
  let files = findFilesInDir('指定路径', /匹配正则/);

  // 先去找目录再去显示
  const reg = new RegExp(EXTENSION_NAME_REG + '$');
  const fileList = findFiles(modulesPath + sep + PACKAGE_PATH.join(sep), reg);
  console.log(fileList);
  let items: QuickPickItem[] = fileList.map(path => ({ label: path, description: path }));

  const result = await input.showQuickPick({
    title: '继承view',
    step: 1,
    totalSteps: 1,
    items,
    // activeItems: items,
    placeholder: '请输入view名称',
    onChangeValue
  });

  function onChangeValue(value: string){
    console.log('value', value);
    if (value === '') {return;}
    // const reg = new RegExp(value + EXTENSION_NAME_REG + '$');
    // const fileList = findFiles(modulesPath + sep + PACKAGE_PATH.join(sep), reg);
    // items = fileList.map(path => ({ label: path, description: path }));
  }


};

export { extendView };

