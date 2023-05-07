/*
 * @Author: Do not edit
 * @Date: 2023-05-07 22:02:39
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-08 00:30:15
 * @FilePath: /ly-tools/src/lib/quickOpen.ts
 */
import { QuickPickItem } from 'vscode';

export interface PickItem extends QuickPickItem {
  code: string;
}

const quickPickItem: PickItem[] = [
  {
    code: 'extendView',
    label: '1:继承view',
    description: '默认为view下的页面',
  },
  {
    code: 'extendComponent',
    label: '2:继承components',
    description: 'ui或components下的组件',
  },
  {
    code: 'extendAllComponent',
    label: '3:继承所有组件',
    description: '指定@zfs文件夹下的所有组件,可通过配置修改,目录默认为@zfs/',
  }
];


export {
  quickPickItem,
};