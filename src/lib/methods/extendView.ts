/*
 * @Author: Do not edit
 * @Date: 2023-05-09 21:41:10
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-09 23:42:59
 * @FilePath: /ly-tools/src/lib/methods/extendView.ts
 */
import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';
import * as fs from 'node:fs';
import { sep, join } from 'node:path';
import type { MultiStepInput } from '../multiStepInput';
import { compile } from '../utils/compile';

const NODE_MODULES = 'node_modules';
const PACKAGE_PATH = ['@zfs'];
const EXCLUDE_PATH = ['ui', 'element-ui', 'el-bigdata-table', 'boe-ia', 'lib'];
const INCLUDES_DIR = ['prj'];
const EXTENSION_NAME_REG = '.vue';
const MODULES_REG = /(?<=node_modules\/)(\D|\w|\/)*/g;

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
  const findFilesInDir: (startPath:string, filter: RegExp) => QuickPickItem[] | [] = (startPath, filter) => {
    if (!fs.existsSync(startPath)) {
      console.log("no dir ", startPath);
      return [];
    }
  
    let files = fs.readdirSync(startPath);
    let result: QuickPickItem[] = [];
  
    for (let i = 0; i < files.length; i++) {
      if (EXCLUDE_PATH.includes(files[i])) {
        continue;
      };
      let filename = join(startPath, files[i]);
      let stat = fs.lstatSync(filename);
  
      if (stat.isDirectory()) {
        result = [ ...result, ...findFilesInDir(filename, filter)];
      } else if (filter.test(filename)) {
        const detail = filename.match(MODULES_REG)![0];
        result.push({ label: files[i], detail });
      }
    }
  
    return result;
  };
  
  // 6.加载全部文件目录
  const reg = new RegExp(EXTENSION_NAME_REG + '$');
  const fileList = findFilesInDir(modulesPath + sep + PACKAGE_PATH.join(sep), reg);
  let items: QuickPickItem[] = fileList;

  // 7.显示加载全部文件
  const result = await input.showQuickPick({
    title: '继承view',
    step: 1,
    totalSteps: 1,
    items,
    // activeItems: items,
    placeholder: '请输入view名称',
  });

  const { label, detail = '' } = result;
  // 写入地址
  const destPath = join(modulesPath, `..${sep}`, 'src', detail!.split('src')[1]);

  // 添加组件
  const writeFileComponent = async (name: string, dest: string, importDetail: string) => {
    const upperName = name.replace(/^\w/g, (match) => (match.toUpperCase()));
    // 1.编译ejs模板 result
    const result = await compile('vueComponent', { name, upperName, path: importDetail.split('.')[0] });
    
    // 2.写入文件的操作
    fs.writeFileSync(dest, result);
  };
  
  await writeFileComponent(label.split('.')[0], destPath, detail);
};

export { extendView };
