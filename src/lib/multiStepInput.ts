/*
 * @Author: Do not edit
 * @Date: 2023-05-07 23:58:43
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-08 00:44:03
 * @FilePath: /ly-tools/src/lib/multiStepInput.ts
 */
import { ExtensionContext } from 'vscode';
import { extendView, extendComponent, extendAllComponent } from './methods';

function multiStepInput(context: ExtensionContext, methods: string){
  switch(methods){
    case 'extendView':
      extendView();
      break;
    case 'extendComponent':
      extendComponent();
      break;
    case 'extendAllComponent':
      extendAllComponent();
      break;
    default:
      break;
  }
}

export {
  multiStepInput,
};