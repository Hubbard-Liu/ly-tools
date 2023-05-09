/*
 * @Author: Do not edit
 * @Date: 2023-05-07 23:58:43
 * @LastEditors: LiuYu
 * @LastEditTime: 2023-05-09 21:53:25
 * @FilePath: /ly-tools/src/lib/multiStepInput.ts
 */
import { ExtensionContext, window, QuickPickItem, Disposable, QuickInput} from 'vscode';
import { extendView, extendComponent, extendAllComponent } from './methods';

async function multiStepInput(context: ExtensionContext, methods: string){
  const input = new MultiStepInput();
  switch(methods){
    case 'extendView':
      extendView(input);
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
  MultiStepInput,
};