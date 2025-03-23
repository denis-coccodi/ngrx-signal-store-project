import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';

import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatepickerComponent } from './datepicker.component';

const meta: Meta<DatepickerComponent> = {
  component: DatepickerComponent,
  title: 'Components/DatePicker',
  parameters: {
    layout: 'padded', // Options: 'padded', 'centered', 'fullscreen'
  },

  decorators: [
    moduleMetadata({
      imports: [CommonModule, ReactiveFormsModule, FormsModule],
    }),
    storyFn => ({
      template: `
        <div class="storybook-wrapper" class="pl-16">
            <div class="storybook-content" style="width: 200px">
                ${storyFn().template}
            </div>
        </div>
	`,
      props: storyFn().props,
    }),
  ],
};
export default meta;
type Story = StoryObj<DatepickerComponent>;

export const Primary: Story = {
  args: {
    dateFormControl: new FormControl<string>('', [Validators.required]),
    placeholder: 'Pick A Date',
    minDate: new Date('2025-02-03'),
    maxDate: new Date(),
    // uses moment standard strings: https://momentjs.com/docs/#/manipulating/
    dateDisplayFormat: 'DD/MM/YYYY',
  },
};

export const reverseDateFormat: Story = {
  args: {
    dateFormControl: new FormControl<string>('2025-02-21', [Validators.required]),
    placeholder: 'Pick A Date',
    minDate: new Date('2025-02-18'),
    maxDate: new Date('2025-02-24'),
    // uses moment standard strings: https://momentjs.com/docs/#/manipulating/
    dateDisplayFormat: 'YYYY-MM-DD',
  },
};

export const noConstraints: Story = {
  args: {
    dateFormControl: new FormControl<string>('21/02/2096', [Validators.required]),
    placeholder: 'Pick A Date',
    // uses moment standard strings: https://momentjs.com/docs/#/manipulating/
    dateDisplayFormat: 'DD/MM/YYYY',
  },
};

export const upperConstraintOnly: Story = {
  args: {
    dateFormControl: new FormControl<string>('21/02/2025', [Validators.required]),
    placeholder: 'Pick A Date',
    maxDate: new Date('2025-02-24'),
    // uses moment standard strings: https://momentjs.com/docs/#/manipulating/
    dateDisplayFormat: 'DD/MM/YYYY',
  },
};
export const lowerConstraintOnly: Story = {
  args: {
    dateFormControl: new FormControl<string>('21/02/2025', [Validators.required]),
    placeholder: 'Pick A Date',
    minDate: new Date('2025-02-18'),
    // uses moment standard strings: https://momentjs.com/docs/#/manipulating/
    dateDisplayFormat: 'DD/MM/YYYY',
  },
};
