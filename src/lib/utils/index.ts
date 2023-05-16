/*
 * @Author: Do not edit
 * @Date: 2023-05-08 23:03:27
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-05-16 10:27:36
 * @FilePath: /ly-tools/src/lib/utils/index.ts
 */
import * as fs from 'node:fs';
import { compile } from '../utils/compile';
import type { QuickPickItem } from 'vscode';
import { sep, join } from 'node:path';
import { 
  NODE_MODULES,
  EXCLUDE_PATH,
  MODULES_REG
 } from '../config';

/**
 * findDirModules查找当前node_modules目录
 * @param arrPath 
 * @returns node_modules Path
 */
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

 /**
  * writeFileComponent写入文件
  * @param name 写入的文件名
  * @param dest 写入的文件地址
  * @param importDetail 导入的地址
  */
const writeFileComponent = async (name: string, dest: string, importDetail: string) => {
  if (name.indexOf('-') !== -1) {
    name = name.replace(/-(\w)/g, (_, p1) => p1.toUpperCase());
  }
  const upperName = name.replace(/^\w/g, (match) => (match.toUpperCase()));
  // 1.编译ejs模板 result
  const result = await compile('vueComponent', { name, upperName, path: importDetail.split('.')[0] });
  const isWriteDirPath = dest.match(/.*\//)![0];
  
  // 2.判断文件夹是否存在
  if (!fs.existsSync(isWriteDirPath)) {
    fs.mkdirSync(isWriteDirPath, { recursive: true });
  }
  // 3.写入文件的操作
  fs.writeFileSync(dest, result);
};

/**
 * findFilesInDir递归查找文件目录
 * @param startPath 起始路径
 * @param filter 需要查找的文件正则
 * @returns {QuickPickItem[]}
 */
const findFilesInDir: (startPath:string, filter: RegExp) => QuickPickItem[] | [] = (startPath, filter) => {
  if (!fs.existsSync(startPath)) {
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

export {
  writeFileComponent,
  findFilesInDir,
  findDirModules,
};