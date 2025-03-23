import { DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, Injector } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { DefaultDialogService } from '@ui-lib/services';
import { injectInjectorToProps } from 'libs/ui-core/.storybook/utils';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { DraggableDialogHeaderComponent } from './draggable-dialog-header/draggable-dialog-header.component';

interface DialogData {
  title: string;
  description: string;
}

@Component({
  selector: 'lib-mock-dialog',
  imports: [DialogContentComponent, DraggableDialogHeaderComponent],
  template: `
    <lib-draggable-dialog-header>
      <div class="text-large-regular" style="margin: auto">{{ data.title }}</div>
    </lib-draggable-dialog-header>
    <lib-dialog-content>
      <div class="text-body-regular" style="margin: auto">
        <p>{{ data.description }}</p>
      </div>
    </lib-dialog-content>
  `,
  standalone: true,
})
export class MockDialogComponent {
  constructor(@Inject(DIALOG_DATA) public data: DialogData) {}
}

const meta: Meta = {
  title: 'Services/default dialog',
  parameters: {
    layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatSnackBarModule, MatButtonModule],
    }),
    applicationConfig({
      providers: [DefaultDialogService, provideAnimations()],
    }),
    injectInjectorToProps(),
  ],
};

export default meta;

type Story = StoryObj<{
  data: MatDialogConfig<DialogData>;
}>;

export const Primary: Story = {
  render: args => ({
    props: {
      data: args.data,
      openDialog: (injector: Injector, data: MatDialogConfig<DialogData>) => {
        action('dialog-open-click')(data);
        const dialogService = injector.get(DefaultDialogService);
        dialogService.open(MockDialogComponent, data);
      },
    },
    template: `
			<button mat-flat-button (click)="openDialog(injector, data)" color="primary">Show Dialog</button>
		`,
  }),
  args: {
    data: {
      height: '150px',
      width: '400px',
      data: {
        title: 'Mock Dialog',
        description: 'This is a mock dialog used in Storybook.',
      },
    },
  },
};

export const withBackdrop: Story = {
  render: args => ({
    props: {
      data: args.data,
      openDialog: (injector: Injector, data: MatDialogConfig<DialogData>) => {
        action('dialog-open-click')(data);
        const dialogService = injector.get(DefaultDialogService);
        dialogService.open(MockDialogComponent, data);
      },
    },
    template: `
			<button mat-flat-button (click)="openDialog(injector, data)" color="primary">Show Dialog</button>
		`,
  }),
  args: {
    data: {
      height: '150px',
      width: '400px',
      hasBackdrop: true,
      data: {
        title: 'Mock Dialog',
        description: 'This is a mock dialog used in Storybook.',
      },
    },
  },
};
