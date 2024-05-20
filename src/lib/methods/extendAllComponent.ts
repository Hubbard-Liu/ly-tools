import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';
import * as fs from 'node:fs';
import { sep, join ,basename} from 'node:path';
import type { MultiStepInput } from '../multiStepInput';
import { writeFileComponent, findDirModules } from '../utils';
import { 
  PACKAGE_PATH,
  EXCLUDE_PATH,
  EXTEND_PATH,
  MODULES_REG,
  EXTENSION_NAME_REG,
  EXTEND_CPM_PATH,
 } from '../config';
 const isMac = process.platform === 'darwin';

const showErrorMessage = (message: string) => {
  vscode.window.showErrorMessage(message);
};

const extendAllComponent = async (input: MultiStepInput) => {
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

  // @zfs下的路径
  const existingPaths: string[] = [];
  for (const subPath of PACKAGE_PATH) {
    const fullPath = join(modulesPath, subPath);
    if (fs.existsSync(fullPath)) {
      existingPaths.push(subPath);
    }
  }

  // 如果存在的子路径数量为0，则显示错误消息并返回
  if (existingPaths.length === 0) {
    showErrorMessage('未找到指定的node_modules文件夹文件');
    return;
  }

  const filter = new RegExp(EXTENSION_NAME_REG + '$');

  // 循环查找文件夹下的文件
  const formatPackagePaths: string[] = [];
  for (const subPath of existingPaths) {
    const packagePath = join(modulesPath, subPath);
    const reg1 = isMac ? new RegExp(`(${subPath}.*)\/`) : new RegExp(`(${subPath}.*)`);

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
          if (isMac) {
            if (!result.includes(detail)){
              result.push(detail);
            }
          } else {
            const formatDetail = detail.replace(/[^\\/]*$/, () => (''));
            if (!result.includes(formatDetail)){
              result.push(formatDetail);
            }
          }
        }
      }
    
      return result;
    };

    const formatPackagePath = findFilesInDir(packagePath);
    if (formatPackagePath) {
      formatPackagePaths.push(...formatPackagePath);
    }
  }

  // const packagePath = join(modulesPath, existingPaths[0]);
  // const filter = new RegExp(EXTENSION_NAME_REG + '$');
  // const reg1 = isMac ? new RegExp(`(${existingPaths[0]}.*)\/`) : new RegExp(`(${existingPaths[0]}.*)`);

  // const formatPackagePath = findFilesInDir(packagePath);
  
  // if (!formatPackagePath) {
  //   showErrorMessage('未找到node_modules文件夹');
  //   return;
  // }
  // 4.find package path
  // 查找指定文件夹下的文件路径

  // 5.加载全部文件目录
  let items: QuickPickItem[] = formatPackagePaths.map(path => ({label:path}));

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

  let filePath = label!.split('src')[1];

  // 单独判断是否为 service 文件夹
  if (label.search(/service/g) !== -1) {
    filePath = join('service', filePath);
  }
  
  // // 8.需要写入地址 /Users/mac/Documents/project/vscodePlugin/zfs-fssc-web/src
  let destPath = [modulesPath, `..${sep}`, 'src', filePath];

  // 判断路径是否有关键字 默认写入到components下面
  if (label.search(EXTEND_CPM_PATH) !== -1) {
    destPath.splice(3, 1, EXTEND_PATH);
  }
  const formatDestPath = join(...destPath);
  // 依赖包的路径
  const selectModulesPath = join(modulesPath, label);

  // 批量写入
  const batchWriteFileComponent: (startPath:string) => Promise<any> | [] = async (startPath) => {
    let files = fs.readdirSync(startPath);
    let result: any[] = [];

    for (let i = 0; i < files.length; i++) {
      // 拼接文件路径
      let filename = join(startPath, files[i]);
      
      // 判断是否vue文件
      if (filter.test(filename)) {
        const detail = filename.match(MODULES_REG)![0];
        const name = basename(filename).split('.')[0];
        const fileDestPath = join(formatDestPath, name + '.vue');

        if (!fs.existsSync(fileDestPath)) {
          // 添加组件
          await writeFileComponent(name, fileDestPath, detail.substring(1, detail.length));
          result.push(fileDestPath);
        }
      }
    }
    return result;
  };

  const fileComponentList = await batchWriteFileComponent(selectModulesPath);
  if (fileComponentList?.length > 0) {
    vscode.window.showInformationMessage(`一键继承成功, 共继承${fileComponentList.length}个组件`);
  } else {
    showErrorMessage('一键继承失败, 请检查是否已经继承过');
  }
};

export { extendAllComponent };
