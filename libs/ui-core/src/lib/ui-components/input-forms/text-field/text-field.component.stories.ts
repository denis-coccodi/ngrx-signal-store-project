import type { Meta, StoryObj } from '@storybook/angular';
import { TextFieldComponent } from './text-field.component';

import { FormControl, Validators } from '@angular/forms';

const meta: Meta<TextFieldComponent> = {
  component: TextFieldComponent,
  title: 'Components/Text Field',
  parameters: {
    layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
  },
};
export default meta;
type Story = StoryObj<TextFieldComponent>;

export const Primary: Story = {
  args: {
    formCtrl: new FormControl('', [Validators.required, Validators.min(1)]),
    customStyles: { width: '200px' },
  },
};

export const withSuffix: Story = {
  args: {
    formCtrl: new FormControl('', [Validators.required, Validators.min(1), Validators.pattern('[\\d]*')]),
    suffix: 'cm',
    customStyles: { width: '200px' },
  },
};
