import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { BasePortalOutlet } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { DefaultDialogContainerComponent } from './default-dialog-container/default-dialog-container.component';

@Injectable({
  providedIn: 'root',
})
export class DefaultDialogService {
  constructor(private dialog: Dialog) {}

  get openDialogs() {
    return this.dialog.openDialogs;
  }

  get afterOpened() {
    return this.dialog.afterOpened;
  }

  get afterAllClosed() {
    return this.dialog.afterAllClosed;
  }

  get getDialogById() {
    return this.dialog.getDialogById;
  }

  get closeAll() {
    return this.dialog.closeAll;
  }

  open<T, D>(
    component: ComponentType<T>,
    config?: DialogConfig<D, DialogRef<T, T>, BasePortalOutlet> | undefined,
  ): DialogRef<T, T> {
    const defaultConfig: DialogConfig<D, DialogRef<T, T>, BasePortalOutlet> | undefined = {
      hasBackdrop: false,
      container: DefaultDialogContainerComponent,
      ...config,
    };
    return this.dialog.open(component, defaultConfig);
  }

  hasOpenDialogs(): boolean {
    return this.dialog.openDialogs.length > 0;
  }

  hasOpenDialogsOfType<T>(component: ComponentType<T>): boolean {
    return this.dialog.openDialogs.some(dialog => dialog.componentInstance instanceof component);
  }

  getTopDialog<T>(): DialogRef<T, T> | undefined {
    return this.dialog.openDialogs.length ? this.dialog.openDialogs[this.dialog.openDialogs.length - 1] : undefined;
  }
}
