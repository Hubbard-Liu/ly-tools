/*
 * @Author: Do not edit
 * @Date: 2023-05-07 23:58:43
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-05-08 19:54:44
 * @FilePath: /ly-tools/src/lib/multiStepInput.ts
 */
import { ExtensionContext, window, QuickPickItem, Disposable, QuickInput} from 'vscode';
import { extendView, extendComponent, extendAllComponent } from './methods';

async function multiStepInput(context: ExtensionContext, methods: string){
  const input = new MultiStepInput();
  switch(methods){
    case 'extendView':
      await input.showQuickPick({
        title: '继承view',
        step: 1,
        totalSteps: 1,
        placeholder: '请输入view名称',
        items: [],
      });
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

interface QuickPickParameters<T extends QuickPickItem> {
	title: string;
	step: number;
	totalSteps: number;
	items: T[];
	activeItem?: T;
	ignoreFocusOut?: boolean;
	placeholder: string;
}

class MultiStepInput {

	private current?: QuickInput;
	private steps: number = 0;

	async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, placeholder }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createQuickPick<T>();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.placeholder = placeholder;
				input.items = items;

				disposables.push(
					input.onDidChangeSelection(items => {
            return resolve(items[0]);
          }),
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}

}

export {
  multiStepInput,
};