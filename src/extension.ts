/*
 * @Author: Do not edit
 * @Date: 2023-05-05 23:06:52
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-08 00:38:26
 * @FilePath: /ly-tools/src/extension.ts
 */
import * as vscode from 'vscode';
import { quickPickItem } from './lib/quickOpen';
import type { PickItem } from './lib/quickOpen';
import { multiStepInput } from './lib/multiStepInput';

export function activate(context: vscode.ExtensionContext) {
	console.log('插件已激活');
	let disposable = vscode.commands.registerCommand('ly-tools.openTools', () => {
		// 启动
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = quickPickItem;
		quickPick.placeholder = '请选择继承类型';
		quickPick.onDidChangeSelection(selection => {
			console.log('selection', selection[0]);
			const { code } = selection[0] as PickItem;
			multiStepInput(context, code);
		});
		// quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	});

	let disposable2 = vscode.commands.registerCommand('ly-tools.openTools2', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('ly-tools!');
	});

	context.subscriptions.push(disposable, disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() {}
