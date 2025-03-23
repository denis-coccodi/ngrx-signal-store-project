import { CommonModule } from '@angular/common';
import { Injector } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { applicationConfig, Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { injectInjectorToProps } from 'libs/ui-core/.storybook/utils';
import { SnackbarClassType, SnackbarMessage } from './snack-notification.model';
import { SnackNotificationsDialogService } from './snack-notifications-dialog.service';

const DEFAULT_DURATION = 5000;
const DEFAULT_ACTION_LABEL = 'Close';

const meta: Meta = {
  title: 'Services/Snack Notifications',
  parameters: {
    layout: 'centered', // Options: 'padded', 'centered', 'fullscreen'
  },
  decorators: [
    moduleMetadata({
      imports: [CommonModule, MatSnackBarModule, BrowserAnimationsModule, MatButtonModule],
    }),
    applicationConfig({
      providers: [SnackNotificationsDialogService],
    }),
    injectInjectorToProps(),
  ],
  argTypes: {
    messageType: {
      options: [SnackbarClassType.SUCCESS, SnackbarClassType.WARNING, SnackbarClassType.ERROR],
      control: { type: 'select' },
    },
  },
};

export default meta;

type Story = StoryObj<{
  message: string;
  messages: SnackbarMessage[];
  messageType: SnackbarClassType;
  duration: number;
  actionLabel: string;
}>;

export const Primary: Story = {
  render: args => ({
    props: {
      message: args.message,
      messageType: args.messageType,
      duration: args.duration,
      actionLabel: args.actionLabel,
      openSnackbar: (
        injector: Injector,
        message = '',
        messageType = SnackbarClassType.SUCCESS,
        duration = DEFAULT_DURATION,
        actionLabel = DEFAULT_ACTION_LABEL,
      ) => {
        action('snack-open-click')(message, messageType, duration, actionLabel);
        const snackService = injector.get(SnackNotificationsDialogService);
        snackService.openSnackBar(message, messageType, duration, actionLabel);
      },
    },
    template: `
			<button mat-flat-button (click)="openSnackbar(injector, message, messageType, duration, actionLabel)" color="primary">Show Snackbar</button>
		`,
  }),
  args: {
    message: 'This is a test message!',
    messageType: SnackbarClassType.SUCCESS,
    duration: DEFAULT_DURATION,
    actionLabel: DEFAULT_ACTION_LABEL,
  },
};

export const queueSnackbarMessage: Story = {
  render: args => ({
    props: {
      messages: args.messages,
      queueSnackbarMessages: (injector: Injector, messages = []) => {
        action('queue-messages-click')(messages);
        const snackService = injector.get(SnackNotificationsDialogService);
        snackService.addMessagesToQueue(messages);
      },
    },
    template: `
			<button mat-flat-button (click)="queueSnackbarMessages(injector, messages)" color="primary">Queue Snackbar Messages</button>
		`,
  }),
  args: {
    messages: [
      {
        text: 'This is message 1',
        type: SnackbarClassType.ERROR,
        duration: 3000,
        actionLabel: 'Close Message',
      },
      {
        text: 'This is message 2',
        type: SnackbarClassType.SUCCESS,
        duration: undefined,
        actionLabel: 'Dismiss',
      },
      {
        text: 'This is message 3',
        type: SnackbarClassType.WARNING,
        duration: 3000,
        actionLabel: 'Chiudi',
      },
    ],
  },
  argTypes: {
    messageType: { table: { disable: true } },
  },
};

export const openSuccessMessage: Story = {
  render: args => ({
    props: {
      message: args.message,
      duration: args.duration,
      actionLabel: args.actionLabel,
      openSnackbarSuccess: (
        injector: Injector,
        message = '',
        duration = DEFAULT_DURATION,
        actionLabel = DEFAULT_ACTION_LABEL,
      ) => {
        action('snack-success-click')(message, duration, actionLabel);
        const snackService = injector.get(SnackNotificationsDialogService);
        snackService.openSuccessMessage(message, duration, actionLabel);
      },
    },
    template: `
			<button mat-flat-button (click)="openSnackbarSuccess(injector, message, duration, actionLabel)" color="primary">Show Success Snackbar</button>
		`,
  }),
  args: {
    message: 'This is a success message!',
    duration: DEFAULT_DURATION,
    actionLabel: DEFAULT_ACTION_LABEL,
  },
  argTypes: {
    messageType: { table: { disable: true } },
  },
};

export const openWarningMessage: Story = {
  render: args => ({
    props: {
      message: args.message,
      duration: args.duration,
      actionLabel: args.actionLabel,
      openSnackbarWarning: (
        injector: Injector,
        message = '',
        duration = DEFAULT_DURATION,
        actionLabel = DEFAULT_ACTION_LABEL,
      ) => {
        action('snack-warning-click')(message, duration, actionLabel);
        const snackService = injector.get(SnackNotificationsDialogService);
        snackService.openWarningMessage(message, duration, actionLabel);
      },
    },
    template: `
			<button mat-flat-button (click)="openSnackbarWarning(injector, message, duration, actionLabel)" color="primary">Show Warning Snackbar</button>
		`,
  }),
  args: {
    message: 'This is a warning message!',
    duration: DEFAULT_DURATION,
    actionLabel: DEFAULT_ACTION_LABEL,
  },
  argTypes: {
    messageType: { table: { disable: true } },
  },
};

export const openErrorMessage: Story = {
  render: args => ({
    props: {
      message: args.message,
      duration: args.duration,
      actionLabel: args.actionLabel,
      openSnackbarError: (
        injector: Injector,
        message = '',
        duration = DEFAULT_DURATION,
        actionLabel = DEFAULT_ACTION_LABEL,
      ) => {
        action('snack-error-click')(message, duration, actionLabel);
        const snackService = injector.get(SnackNotificationsDialogService);
        snackService.openErrorMessage(message, duration, actionLabel);
      },
    },
    template: `
			<button mat-flat-button (click)="openSnackbarError(injector, message, duration, actionLabel)" color="primary">Show Error Snackbar</button>
		`,
  }),
  args: {
    message: 'This is an error message!',
    duration: DEFAULT_DURATION,
    actionLabel: DEFAULT_ACTION_LABEL,
  },
  argTypes: {
    messageType: { table: { disable: true } },
  },
};
