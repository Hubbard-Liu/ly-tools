/*
 * @Author: Do not edit
 * @Date: 2023-05-07 22:02:39
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-05-16 10:47:59
 * @FilePath: /zfs-toolkit/src/lib/quickOpen.ts
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
    label: '2:查找页面openView',
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