import type { Meta, StoryObj } from '@storybook/angular';

import { DropdownComponent } from './dropdown.component';

const meta: Meta<DropdownComponent<string>> = {
  component: DropdownComponent,
  title: 'Components/Dropdown',
  parameters: {
    layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
  },
};
export default meta;
type Story = StoryObj<DropdownComponent<string>>;

export const Primary: Story = {
  args: {
    options: [{ value: 'VALUE_1', description: 'desc_1'}, { value: 'VALUE_2', description: 'desc_2'}],
    selectedOption: { value: 'VALUE_1', description: 'desc_1'},
  },
};
