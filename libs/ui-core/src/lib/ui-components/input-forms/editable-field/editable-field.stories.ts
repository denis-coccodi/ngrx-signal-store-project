import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { IconComponent } from '@ui-lib/components';
import { TextFieldComponent } from './../text-field/text-field.component';
import { EditableFieldComponent } from './editable-field.component';

const meta: Meta<EditableFieldComponent> = {
  component: EditableFieldComponent,
  title: 'Components/Editable Field',
  parameters: {
    layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatButtonModule, TextFieldComponent, ReactiveFormsModule, FormsModule, IconComponent],
    }),
  ],
};

export default meta;

class EditableFieldComponentTestInterface extends EditableFieldComponent {
  formCtrl?: FormControl;
}

type Story = StoryObj<EditableFieldComponentTestInterface>;

export const Primary: Story = {
  args: {
    displayedValue: 'Default Value',
    editMode: false,
    customStyles: {
      width: '134px',
      height: '48px',
    },
    formCtrl: new FormControl(''),
  },
  render: args => ({
    props: args,
    template: `
        <div class="storybook-wrapper" style="margin-left: 16px">
          <div class="storybook-content pb-8">
            <lib-editable-field [editMode]="editMode" [displayedValue]="displayedValue" [customStyles]="customStyles">
                <lib-text-field fields [formCtrl]="formCtrl"></lib-text-field>
            </lib-editable-field>
          </div>
          <button mat-flat-button (click)="editMode = !editMode" color="primary">Switch edit field mode</button>
        </div>
    `,
  }),
};

export const withAdditionalContent: Story = {
  args: {
    displayedValue: 'Default Value',
    editMode: false,
    customStyles: { height: '48px' },
    formCtrl: new FormControl(''),
  },
  render: args => ({
    props: args,
    template: `
        <div class="storybook-wrapper" style="margin-left: 16px">
          <div class="storybook-content pb-8" [ngStyle]="{width: '132px'}">
            <lib-editable-field [editMode]="editMode" [displayedValue]="displayedValue" [customStyles]="customStyles">
                <lib-icon class="pl-8" [customStyles]="{width: '16px'}" DisplayedValues name="PencilSimple"></lib-icon>
                <lib-text-field fields [formCtrl]="formCtrl"></lib-text-field>
            </lib-editable-field>
          </div>
          <button mat-flat-button (click)="editMode = !editMode" color="primary">Switch edit field mode</button>
        </div>
    `,
  }),
};
