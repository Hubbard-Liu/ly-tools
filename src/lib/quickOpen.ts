/*
 * @Author: Do not edit
 * @Date: 2023-05-07 22:02:39
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-11 22:45:39
 * @FilePath: /ly-tools/src/lib/quickOpen.ts
 */
import { QuickPickItem } from 'vscode';

export interface PickItem extends QuickPickItem {
  code: string;
}

const quickPickItem: PickItem[] = [
  {
    code: 'extendComponent',
    label: '1:继承extends',
    description: '默认继承@zfs下的组件或页面',
  },
  {
    code: 'openView',
    label: '2:打开页面openView',
    description: '打开一个指定组件或页面',
  },
  {
    code: 'extendAllComponent',
    label: '3:继承目录组件extendsDir',
    description: '继承指定文件夹下的所有组件',
  }
];


export {
  quickPickItem,
};