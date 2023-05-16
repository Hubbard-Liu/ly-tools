/*
 * @Author: Do not edit
 * @Date: 2023-05-07 23:58:43
 * @LastEditors: Liuyu
 * @LastEditTime: 2023-05-16 10:17:43
 * @FilePath: /ly-tools/src/lib/multiStepInput.ts
 */
import { ExtensionContext, window, QuickPickItem, Disposable, QuickInput} from 'vscode';
import { openView, extendComponent, extendAllComponent } from './methods';

async function multiStepInput(context: ExtensionContext, methods: string){
  const input = new MultiStepInput();
  switch(methods){
    case 'extendComponent':
      extendComponent(input);
      break;
    case 'openView':
      openView(input);
      break;
    case 'extendAllComponent':
      extendAllComponent(input);
      break;
    default:
      break;
  }
}

interface QuickPickParameters<T extends QuickPickItem> {
	title: string;
	step: number;
	totalSteps: number;
	items?: T[];
	activeItems?: T[];
	activeItem?: T;
	ignoreFocusOut?: boolean;
	placeholder: string;
  onChangeValue?: Function;
}

class MultiStepInput {
	private current?: QuickInput;
	// private steps: QuickInput[];

	async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItems, placeholder, onChangeValue }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<T>((resolve, reject) => {
				const input = window.createQuickPick<T>();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.placeholder = placeholder;
				input.items = items || [];
				input.activeItems = activeItems || [];

				disposables.push(
					input.onDidChangeSelection(items => {
            input.hide();
            return resolve(items[0]);
          }),
          input.onDidChangeValue(items => {
            onChangeValue && onChangeValue(items);
          }),
				);
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
  MultiStepInput,
};