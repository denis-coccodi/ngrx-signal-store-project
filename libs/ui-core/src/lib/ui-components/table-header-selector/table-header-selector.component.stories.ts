import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/angular';
import { TableHeaderSelectorComponent } from './table-header-selector.component';


const meta: Meta<TableHeaderSelectorComponent<string>> = {
	component: TableHeaderSelectorComponent,
	title: 'Components/Table Header Selector',
	parameters: {
	  layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
	},
};
export default meta;
type Story = StoryObj<TableHeaderSelectorComponent<string>>;

export const Primary: Story = {
	args: {
		data: {
			title: 'Height',
			selected: 'METRIC',
			onClickFunction: (id) => {
				action('button-click')(id);
			},
			selectors: [
				{
					id: 'METRIC',
					btnLabel: 'Cm',
				},
				{
					id: 'IMPERIAL',
					btnLabel: 'Ft/In',
				},
			],
		}
	},
};
