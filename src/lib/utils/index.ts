/*
 * @Author: Do not edit
 * @Date: 2023-05-08 23:03:27
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-06-07 16:09:34
 * @FilePath: /zfs-toolkit/src/lib/utils/index.ts
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

const excludePath = [...EXCLUDE_PATH, 'node_modules'];
const isMac = process.platform === 'darwin';

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
  const importDetailPath = importDetail.split('.')[0].replace(/\\/g, '/');;
  const result = await compile('vueComponent', { name, upperName, path: importDetailPath });
  const isWriteDirPath = isMac ? dest.match(/.*\//)![0] : dest.match(/.*\\/)![0];

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
    if (excludePath.includes(files[i])) {
      continue;
    };
    let filename = join(startPath, files[i]);
    let stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      result = [ ...result, ...findFilesInDir(filename, filter)];
    } else if (filter.test(filename)) {
      const detail = filename.match(MODULES_REG)![0];
      result.push({ label: files[i], detail: detail.substring(1, detail.length) });
    }
  }

  return result;
};

/**
 * 转换为正则目录
 * @param arr 
 * @returns regex
 */
const arrayToRegex = (arr: string[]) => {
  if (!Array.isArray(arr) || arr.length === 0) {
      throw new Error("Input must be a non-empty array");
  }

  // 将数组中的每个元素转义，以便在正则表达式中安全使用
  const escapedArray = arr.map(item => item.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  // 使用 | 符号将所有元素连接起来
  const regexPattern = escapedArray.join('|');
  
  // 创建正则表达式对象，使用 new RegExp() 可以动态创建正则表达式
  return new RegExp(`(${regexPattern})`);
};

export {
  writeFileComponent,
  findFilesInDir,
  findDirModules,
  arrayToRegex
};